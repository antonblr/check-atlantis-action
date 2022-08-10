import {expect, test} from '@jest/globals'
import {mkdirSync, rmdirSync} from 'fs'
import * as path from 'path'
import * as checks from '../src/checks'

const originalGitHubWorkspace = process.env['GITHUB_WORKSPACE']

function setInput(name: string, value: string): void {
  process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] = value
}

describe('action tests', () => {
  beforeAll(() => {
    // GitHub workspace
    process.env['GITHUB_WORKSPACE'] = __dirname
  })

  afterAll(() => {
    // Restore GitHub workspace
    delete process.env['GITHUB_WORKSPACE']
    if (originalGitHubWorkspace) {
      process.env['GITHUB_WORKSPACE'] = originalGitHubWorkspace
    }
  })

  test('run all checks', () => {
    const directories = ['a/b/', 'a/c/a/', 'a/c/b/']
    console.log('Creating test directories...')
    for (const d of directories) {
      mkdirSync(path.join(__dirname, d), {recursive: true})
    }

    // Mock GitHub actions input
    setInput('sort-by', 'dir')

    // first pass should sort and remove obsolete projects
    const status1 = checks.runChecks()
    expect(status1).toBeFalsy()

    // second pass should need no modifications
    const status2 = checks.runChecks()
    expect(status2).toBeTruthy()

    console.log('Cleanup test directories...')
    rmdirSync(path.join(__dirname, 'a'), {recursive: true})
  })
})
