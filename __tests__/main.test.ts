import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import {YoutrackParentFinder} from '../src/yourtrack-parent-finder'

import {expect, test} from '@jest/globals'

dotenv.config()

test('find parent ticket', async () => {
  const finder = new YoutrackParentFinder({
    baseUrl: process.env.YOUTRACK_URL ?? '',
    token: process.env.YOUTRACK_TOKEN ?? ''
  })

  const parentIssue = await finder.findIssueParent('WAP-1546')
  expect(parentIssue?.hummanId).toEqual('PRD-663')

  const initativeParent = await finder.findIssueParentRecursive('WAP-1701')
  expect(initativeParent?.hummanId).toEqual('PRD-660')
})
