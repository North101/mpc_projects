import Ajv, { SchemaObject } from 'ajv'
import standaloneCode from 'ajv/dist/standalone'
import fs from 'node:fs/promises'
import path from 'node:path'
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

interface BuildSchema {
  filename: string
  type: string
}

interface SchemaResult extends BuildSchema {
  schema: SchemaObject
}

const buildSchema = async ({ filename, type }: BuildSchema): Promise<SchemaResult> => {
  const files = [
    filename,
  ]
  const program = TJS.getProgramFromFiles(files, compilerOptions, filename)
  return {
    filename,
    type,
    schema: TJS.generateSchema(program, type, settings, files)!,
  }
}

const writeSchemaJson = async ({ filename, schema }: { filename: string, schema: SchemaResult }) => {
  return fs.writeFile(filename, JSON.stringify(schema.schema, sortObjectKeys, 2))
}

const toTypeDefinition = (filename: string) => {
  const parts = path.parse(filename)
  return path.format({
    ...parts,
    base: undefined,
    ext: 'd.ts',
  })
}

interface WriteSchemaValidator {
  filename: string
  schema: SchemaResult
  name: string
}

const writeSchemaValidator = async ({ filename, schema, name }: WriteSchemaValidator) => {
  const ajv = new Ajv({
    schemas: [schema.schema],
    code: { source: true, esm: true },
  })
  const moduleCode = standaloneCode(ajv, {
    [name]: '#',
  })
  await fs.writeFile(
    filename,
    moduleCode,
  )
  await writeSchemaValidatorDef({
    filename,
    schema,
    name,
  })
}

const writeSchemaValidatorDef = async ({ filename, schema, name }: WriteSchemaValidator) => {
  await fs.writeFile(
    toTypeDefinition(filename),
    [
      `import { ${schema.type} } from './${path.relative(path.dirname(filename), schema.filename)}'`,
      ``,
      `export declare function ${name}(data: unknown): data is ${schema.type};`,
      ``,
    ].join('\n'),
  )
}

const typesPaths = {
  extension: 'vite-plugin-project-builder/types/extension_projects',
  website: 'vite-plugin-project-builder/types/website_projects',
}
for (const typePath of Object.values(typesPaths)) {
  await writeSchemaValidator({
    schema: await buildSchema({
      filename: path.resolve(typePath, 'union.ts'),
      type: 'ProjectUnion',
    }),
    filename: path.resolve(typePath, 'validate.js'),
    name: 'validate',
  })
}

await writeSchemaJson({
  schema: await buildSchema({
    filename: path.resolve(typesPaths.website, 'latest.ts'),
    type: 'Project',
  }),
  filename: path.resolve('projects.schema.json'),
})
