import {Issue, Youtrack} from 'youtrack-rest-client'
import {IssueLink} from 'youtrack-rest-client/dist/entities/issueLink'
import {YoutrackTokenOptions} from 'youtrack-rest-client/dist/options/youtrack_options'

export type ParentIssueResponse = {
  id: string
  hummanId: string
}

export class YoutrackParentFinder {
  private youtrack: Youtrack | null = null

  constructor(config: YoutrackTokenOptions) {
    this.youtrack = new Youtrack(config)
  }

  async findIssueParent(
    youtrack_ticket: string
  ): Promise<ParentIssueResponse | null> {
    if (this.youtrack == null) {
      throw Error('Youtrack client is not configured')
    }

    const issue: Issue = await this.youtrack.issues.byId(youtrack_ticket)

    const parentLinks = (issue.links ?? []).filter(
      (link: IssueLink) =>
        link.linkType?.targetToSource === 'subtask of' &&
        link.direction === 'INWARD'
    )

    for (const l of parentLinks) {
      l.direction
      for (const i of l.issues) {
        if (i?.id) {
          const parent: Issue = await this.youtrack.issues.byId(i.id)
          if (parent !== null) {
            return this.issueToResponse(parent)
          }
        }
      }
    }

    return null
  }

  issueToResponse(issue: Issue): ParentIssueResponse {
    return {
      id: issue.id ?? '',
      hummanId: `${issue.project?.shortName}-${issue.numberInProject}`
    }
  }

  async findIssueParentRecursive(
    id: string
  ): Promise<ParentIssueResponse | null> {
    if (this.youtrack == null) {
      throw Error('Youtrack client is not configured')
    }

    console.log(`Find paren for ${id}`)

    const parent = await this.findIssueParent(id)
    console.log(`-> ${parent?.hummanId}`)

    if (parent === null) {
      const issue = await this.youtrack.issues.byId(id)
      if (issue !== null) {
        return this.issueToResponse(issue)
      }
    }

    return this.findIssueParentRecursive(parent?.hummanId ?? '')
  }
}
