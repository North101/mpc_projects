import * as V4 from './v4'

export * as Latest from './latest'
export type { ProjectUnion } from './union'
export * as V1 from './v1'
export * as V2 from './v2'
export * as V3 from './v3'
export * as V4 from './v4'
export { validate } from './validate'

export interface Info {
  filename: string
  image: string | null
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
  lang: string
  created: string
  updated: string
  options: {
    name: string
    parts: {
      name: string
      count: number
      enabled: boolean
    }[]
  }[]
}

export interface Data {
  options: V4.Option[]
}
