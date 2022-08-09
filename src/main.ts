// https://docs.github.com/en/actions/learn-github-actions/environment-variables
// https://www.npmjs.com/package/@octokit/rest
// Typescript action: https://github.com/peter-evans/create-pull-request
// Typescript action: https://github.com/gr2m/create-or-update-pull-request-action
// Typescript action: https://github.com/fjogeleit/yaml-update-action
// Template for Typescript action: https://github.com/actions/typescript-action
import * as core from '@actions/core'
import {GitHubInputs} from './inputs'
import {addCommitAndPush} from './git'
import {runChecks} from './checks'

function run(): void {
  const inputs = new GitHubInputs()

  try {
    // Run checks
    const success = runChecks()

    // Commit updated atlantis.yaml back to PR, if changed
    if (inputs.commitChange && !success) {
      addCommitAndPush(inputs.atlantisConfigPath)
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
