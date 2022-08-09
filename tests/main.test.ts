import {expect, test} from '@jest/globals'
import * as checks from '../src/checks'
import {mkdirSync, rmdirSync} from 'fs'
import * as path from 'path'

function setInput(name: string, value: string): void {
  process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] = value
}

test('test terraform/atlantis.yaml', () => {
  const directories = ['a/b/', 'a/c/a/', 'a/c/b/']
  console.log('Creating test directories...')
  for (const d of directories) {
    mkdirSync(path.join(__dirname, d), {recursive: true})
  }

  // Mock GitHub action inputs
  setInput('atlantis-config-path', path.join(__dirname, 'atlantis.yaml'))
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
