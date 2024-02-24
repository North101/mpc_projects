import Ajv from 'ajv'
import schema from './schema.json'

import * as V1 from './v1'
import * as V2 from './v2'

export * as V1 from './v1'
export * as V2 from './v2'
export * as Latest from './v2'

export type ProjectUnion = V1.Project | V2.Project

const ajv = new Ajv({
  removeAdditional: 'all',
})
export const validate = ajv.compile<ProjectUnion>(schema)
