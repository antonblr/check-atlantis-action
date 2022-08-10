import * as core from '@actions/core'
import {exec} from '@actions/exec'

export async function addCommitAndPush(file: string): Promise<void> {
  core.info('Commit and push the changes...')
  await exec('git config --local user.name github-actions')
  await exec('git config --local user.email github-actions@github.com')
  await exec(`git add ${file}`)
  await exec('git commit -m "ci: fix atlantis.yaml configuration"')
  await exec('git push')
}
