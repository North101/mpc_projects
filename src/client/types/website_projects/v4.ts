import { V3 } from '../extension_projects'

export interface Part extends V3.Part {
  enabled?: boolean
}

export interface Option {
  name: string
  parts: Part[]
}

export interface Project {
  version: 4
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
