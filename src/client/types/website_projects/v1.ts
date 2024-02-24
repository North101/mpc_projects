import { V1 } from '../extension_projects'

export interface Project {
  version: 1
  code: string
  cards: V1.Card[]

  projectId: string[]
  name: string
  description: string
  artist?: string | null
  info?: string | null
  website?: string | null
  cardsLink?: string | null
  scenarioCount: number
  investigatorCount: number
  authors: string[]
  statuses: string[]
  tags: string[]
  created: string
  updated: string
  hash: string
}
