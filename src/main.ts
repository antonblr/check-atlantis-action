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
      addCommitAndPush(inputs.atlantisConfig)
    } else if (!success) {
      core.setFailed('Some of the checks are failed.')
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
