import * as core from '@actions/core'

const sortByKeys = ['dir', 'name']

export interface Inputs {
  atlantisConfigPath: string
  commitChange: boolean
  includeChecks: string[]
  projectsSortBy: string
  token: string
}

export class GitHubInputs implements Inputs {
  get atlantisConfigPath(): string {
    return core.getInput('atlantis-config-path')
  }

  get commitChange(): boolean {
    return core.getInput('commit-change') === 'true'
  }

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
