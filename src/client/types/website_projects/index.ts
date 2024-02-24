import Ajv from 'ajv'
import schema from './schema.json'

import * as V1 from './v1'
import * as V2 from './v2'
import * as V3 from './v3'

export * as V1 from './v1'
export * as V2 from './v2'
export * as V3 from './v3'
export * as Latest from './v3'

export type ProjectUnion = V1.Project | V2.Project | V3.Project

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
  code: string
  options: V3.Option[]
}

const ajv = new Ajv({
  removeAdditional: 'all',
})
export const validate = ajv.compile<ProjectUnion>(schema)
