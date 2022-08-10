import * as core from '@actions/core'
import path from 'path'

const sortByKeys = ['dir', 'name']

export interface Inputs {
  atlantisConfig: string
  commitChange: boolean
  includeChecks: string[]
  projectsSortBy: string
  token: string
}

export class GitHubInputs implements Inputs {
  get atlantisConfig(): string {
    let atlantisConf = core.getInput('atlantis-config')

    if (!atlantisConf) {
      atlantisConf = 'atlantis.yaml'
    }

    return path.resolve(process.env['GITHUB_WORKSPACE'] as string, atlantisConf)
  }

  get commitChange(): boolean {
    return core.getInput('commit-change') === 'true'
  }

  // TODO
  get includeChecks(): string[] {
    if (!core.getInput('include')) return []

    return core
      .getInput('include')
      .split(',')
      .map(check => check.trim())
      .filter(check => !!check)
  }

  get projectsSortBy(): string {
    const key = core.getInput('sort-by')

    if (!sortByKeys.includes(key)) {
      // error
      console.error(`Invalid sort-by key ${key}. Only ${sortByKeys} allowed.`)
    }
    return key
  }

  get token(): string {
    return core.getInput('token')
  }
}
