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

export interface Part {
  name: string
  cards: Card[]
}

export interface ProjectV1 {
  version: 1
  code: string
  cards: Card[]
}

export interface ProjectV2 {
  version: 2
  code: string
  parts: Part[]
}

export interface ProjectMeta {
  projectId: string[]
  name: string
  description: string
  content: string
  website?: string | null
  authors: string[]
  tags: string[]
  info?: string | null
  created: string
  updated: string
  hash: string
}

export interface PartMeta extends Part {
  enabled?: boolean
}

export interface ProjectV1Meta extends ProjectV1, ProjectMeta {

}

export interface ProjectV2Meta extends ProjectV2, ProjectMeta {
  parts: PartMeta[]
}

export interface PartInfo {
  name: string
  count: number
  enabled: boolean
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
  sites: string[]
  parts: PartInfo[]
}
