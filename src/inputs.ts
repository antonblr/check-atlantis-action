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

/**
 * Get an environment parameter, but throw an error if it is not set.
 */
export function getRequiredEnvParam(paramName: string): string {
  const value = process.env[paramName]
  if (value === undefined || value.length === 0) {
    throw new Error(`${paramName} environment variable must be set`)
  }
  return value
}

export class GitHubInputs implements Inputs {
  get atlantisConfig(): string {
    let atlantisConf = core.getInput('atlantis-config')

    if (!atlantisConf) {
      atlantisConf = 'atlantis.yaml'
    }

    return path.resolve(getRequiredEnvParam('GITHUB_WORKSPACE'), atlantisConf)
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
      throw new Error(`Invalid sort-by key ${key}. Allowed: ${sortByKeys}`)
    }
    return key
  }

  get token(): string {
    return core.getInput('token')
  }
}
