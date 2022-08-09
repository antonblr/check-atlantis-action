import * as yaml from 'js-yaml'
import {existsSync, readFileSync, writeFileSync} from 'fs'
import {GitHubInputs} from './inputs'
import path from 'path'

const checks = [checkObsolete, checkOrdering]
const inputs = new GitHubInputs()

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
  const file = inputs.atlantisConfigPath
  console.log(`Running checks on ${file}...`)

  // Get document
  const doc = yaml.load(readFileSync(file, 'utf8')) as AtlantisConfig
  const projects: Project[] = doc.projects

  const results: string[] = []
  for (const check of checks) {
    const status = check(projects)
    console.log(`${check.name} => ${status}`)
    results.push(status)
  }

  // Write processed document back
  writeFileSync(file, yaml.dump(doc, {flowLevel: 6, quotingType: '"'}))
  return results.every(val => val === 'ok')
}

export function checkObsolete(document: Project[]): string {
  console.info(`Check obsolete projects...`)
  let checkStatus = 'ok'

  const root_dir = process.cwd()
  for (const [index, item] of document.entries()) {
    if (!existsSync(path.join(root_dir, item.dir))) {
      checkStatus = 'fail'
      console.warn(`\tcleanup project {name: '${item.name}'}`)
      document.splice(index, 1)
    }
  }

  return checkStatus
}

export function checkOrdering(document: Project[]): string {
  const key = inputs.projectsSortBy as keyof Project
  let checkStatus = 'ok'

  console.info(`Sort projects by '${key}' key...`)

  document.sort(function (a, b) {
    if (a[key] > b[key]) {
      return 1
    } else {
      checkStatus = 'fail'
      return -1
    }
  })

  return checkStatus
}
