import Ajv, { ValidateFunction } from 'ajv'

import { ProjectUnion } from './union'

let validator: ValidateFunction<ProjectUnion> | null = null

export const validate = async (data: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  validator ??= new Ajv().compile<ProjectUnion>(await import('./schema.json'))
  return validator(data)
}
