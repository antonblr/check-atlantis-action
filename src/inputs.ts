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
    let input_path = core.getInput('atlantis-config')
    const root_dir = process.cwd()

    if (!input_path) return path.join(root_dir, 'atlantis.yaml')

    // Normalise relative path
    if (!path.isAbsolute(input_path)) {
      input_path = path.join(root_dir, input_path)
    }

    return input_path
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
