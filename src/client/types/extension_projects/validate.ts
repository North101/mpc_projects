import Ajv from 'ajv'

import { ProjectUnion } from './union'

const ajv = new Ajv()
export const validate = async (data: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const schema = await import('./schema.json')
  return ajv.compile<ProjectUnion>(schema)(data)
}
