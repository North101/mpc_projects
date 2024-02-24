import { V2 } from '../website_projects'

export interface Option {
  name: string
  parts: V2.Part[]
}

export interface Project {
  version: 3
  code: string
  options: Option[]

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
