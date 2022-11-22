import * as core from '@actions/core'
import {YoutrackParentFinder} from './yourtrack-parent-finder'

async function run(): Promise<void> {
  try {
    const baseUrl = core.getInput('youtrack_base_url')
    const token = core.getInput('youtrack_token')
    const issueId = core.getInput('issue_id')
    core.startGroup(`[Youtrack] find parent issue for ${issueId}`)

    core.info(`initialize YoutrackParentFinder`)

    const finder = new YoutrackParentFinder({baseUrl, token})
    core.info(`find parent issue`)
    const parent = await finder.findIssueParentRecursive(issueId)

    core.info(`found parent issue: ${JSON.stringify(parent)}`)

    core.setOutput('parent_id', parent?.id)
    core.setOutput('parent_humman_id', parent?.hummanId)

    core.endGroup()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
