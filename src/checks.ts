import * as core from '@actions/core'
import * as yaml from 'js-yaml'
import {existsSync, readFileSync, writeFileSync} from 'fs'
import {GitHubInputs} from './inputs'
import path from 'path'

const checks = [checkObsolete, checkOrdering]

type AtlantisConfig = {
  version: number
  projects: Project[]
}

type Project = {
  name: string
  dir: string
  autoplan: {when_modified: string[]}
  workflow: string
  apply_requirements: string[]
}

export function runChecks(): boolean {
  const inputs = new GitHubInputs()
  const file = inputs.atlantisConfig
  core.info(`Running checks on ${file}...`)

  // Get document
  const doc = yaml.load(readFileSync(file, 'utf8')) as AtlantisConfig
  const projects: Project[] = doc.projects

  const results: string[] = []
  for (const check of checks) {
    core.startGroup(`Running ${check.name}`)
    const status = check(projects)
    core.info(`check status => '${status}'`)
    core.endGroup()
    results.push(status)
  }

  // Write processed document back
  writeFileSync(
    file,
    yaml.dump(doc, {flowLevel: 6, quotingType: '"', lineWidth: 120})
  )
  return results.every(val => val === 'ok')
}

export function checkObsolete(document: Project[]): string {
  core.info(`Check obsolete projects...`)
  let checkStatus = 'ok'

  const root_dir = process.cwd()
  for (const [index, item] of document.entries()) {
    if (!existsSync(path.join(root_dir, item.dir))) {
      checkStatus = 'fail'
      core.error(`\tcleanup project {name: '${item.name}'}`)
      document.splice(index, 1)
    }
  }

  return checkStatus
}

export function checkOrdering(document: Project[]): string {
  const inputs = new GitHubInputs()
  const file = inputs.atlantisConfig
  const key = inputs.projectsSortBy as keyof Project
  let checkStatus = 'ok'

  core.info(`Sort projects by '${key}' key...`)

  document.sort(function (a, b) {
    if (a[key] >= b[key]) {
      return 1
    } else {
      checkStatus = 'fail'
      return -1
    }
  })
  if (checkStatus === 'fail') {
    core.error(`${path.basename(file)} was not sorted by '${key}' key properly`)
  }

  return checkStatus
}
