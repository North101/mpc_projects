import Ajv, { Schema } from 'ajv'
import standaloneCode from 'ajv/dist/standalone'
import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import TJS from 'typescript-json-schema'

const settings: TJS.PartialArgs = {
  required: true,
}

const compilerOptions: TJS.CompilerOptions = {
  alwaysStrict: true,
  strictNullChecks: true,
}

const sortObjectKeys = (key: string, value: unknown) => {
  if (!(value instanceof Object) || Array.isArray(value)) return value
  return Object.keys(value).sort().reduce((sorted, key) => {
    sorted[key] = value[key]
    return sorted
  }, {})
}

const buildSchema = async (path: string, type: string): Promise<Schema> => {
  const files = [
    path,
  ]
  const program = TJS.getProgramFromFiles(files, compilerOptions, path)
  return {
    ...TJS.generateSchema(program, type, settings, files),
  }
}

const writeSchemaJson = async ({ filename, schema }: { filename: string, schema: Schema }) => {
  return fs.writeFile(filename, JSON.stringify(schema, sortObjectKeys, 2))
}

const writeSchemaValidator = async ({ filename, schema }: { filename: string, schema: Schema }) => {
  const ajv = new Ajv({
    schemas: [schema],
    code: { source: true, esm: true },
  })
  const moduleCode = standaloneCode(ajv, {
    validate: '#',
  })
  return fs.writeFile(filename, moduleCode)
}

const typesPath = 'vite-plugin-project-builder/types'
const paths = [
  'extension_projects',
  'website_projects',
]
for (const path of paths) {
  await writeSchemaValidator({
    schema: await buildSchema(resolve(typesPath, path, 'union.ts'), 'ProjectUnion'),
    filename: resolve(typesPath, path, 'validate.js'),
  })
}

await writeSchemaJson({
  schema: await buildSchema(resolve(typesPath, 'website_projects', 'latest.ts'), 'Project'),
  filename: resolve('projects.schema.json'),
})
