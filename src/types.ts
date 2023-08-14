export interface CardFace {
  Name: string
  ID: string
  SourceID: string
  Exp: string
  Width: number
  Height: number
}

export interface Card {
  count: number
  front?: CardFace
  back?: CardFace
}

export interface ProjectPart {
  enabled?: boolean
  name: string
  cards: Card[]
}

export interface Project {
  projectId: string
  name: string
  description: string
  content: string
  website?: string
  authors: string[]
  tags: string[]
  info?: string
  created: string
  updated: string
  version: 2
  code: string
  parts: ProjectPart[]
  hash: string
}

export interface ProjectInfoPart {
  enabled: boolean
  name: string
  count: number
}

export interface ProjectInfo {
  name: string
  description: string
  content: string
  website: string | null
  authors: string[]
  tags: string[]
  info: string | null
  created: string
  updated: string
  filename: string
  parts: ProjectInfoPart[]
  sites: string[]
}

export interface ProjectDownload {
  version: 2
  code: string
  parts: ProjectPart[]
}
