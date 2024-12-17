import * as V4 from './v4'

export * as Latest from './latest'
export type { ProjectUnion } from './union'
export * as V1 from './v1'
export * as V2 from './v2'
export * as V3 from './v3'
export * as V4 from './v4'
export * as V5 from './v5'
export { validate } from './validate'

export interface Info {
  projectIds: {
    [projectId: string]: string
  }
  hidden: boolean
  filename: string
  image: string | null
  changelog: string | null
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
      size: string
    }[]
  }[]
}

export interface Data {
  options: V4.Option[]
}
