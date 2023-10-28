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

export type ProjectLatest = ProjectV2

export type ProjectUnion = ProjectV1 | ProjectV2

export interface ProjectMeta {
  projectId: string[]
  name: string
  description: string
  image?: string | null
  artist?: string | null
  info?: string | null
  website?: string | null
  linktext?: string | null
  authors: string[]
  statuses: string[]
  tags: string[]
  created: string
  updated: string
  hash: string
}

export interface PartMeta extends Part {
  key: number
  enabled?: boolean
}

export interface ProjectV1Meta extends ProjectV1, ProjectMeta {

}

export interface ProjectV2Meta extends ProjectV2, ProjectMeta {
  parts: PartMeta[]
}

export type ProjectLatestMeta = ProjectV2Meta

export type ProjectUnionMeta = ProjectV1Meta | ProjectV2Meta

export interface PartInfo {
  key: number
  name: string
  count: number
  enabled: boolean
}

export interface ProjectInfo {
  filename: string
  name: string
  description: string
  image: string | null
  info: string | null
  artist: string | null
  website: string | null
  linktext: string | null
  authors: string[]
  statuses: string[]
  tags: string[]
  created: string
  updated: string
  //sites: {
  //  [key: string]: string
  //}
  parts: PartInfo[]
}
