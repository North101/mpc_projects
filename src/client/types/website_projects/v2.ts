import { V2 } from '../extension_projects'

export interface Part extends V2.Part {
  enabled?: boolean
}

export interface Project {
  version: 2
  code: string
  parts: Part[]

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
