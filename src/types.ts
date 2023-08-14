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

export enum Version {
  Version1 = 1,
  Version2 = 2,
}

export interface ProjectV1 {
  projectId: string
  name: string
  description: string
  content: string
  website: string | null
  authors: string[]
  tags: string[]
  info: string | null
  created: string
  updated: string
  version: Version.Version1
  code: string
  cards: Card[]
  hash: string
}

export interface ProjectV2 {
  projectId: string
  name: string
  description: string
  content: string
  website: string | null
  authors: string[]
  tags: string[]
  info: string | null
  created: string
  updated: string
  version: Version.Version2
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
