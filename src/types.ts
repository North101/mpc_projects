interface BaseProject {
  id: string
  name: string
  description: string
  content: string
  website: string | null
  authors: string[]
  tags: string[]
  info: string | null
  created: string
  updated: string
}

export interface Project extends BaseProject {
  filename: string
  cardCount: number
  sites: string[]
}

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

export interface FullProject extends BaseProject {
  id: string
  version: number
  code: string
  cards: Card[]
  hash: string
}
