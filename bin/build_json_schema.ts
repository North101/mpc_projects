import Ajv, { SchemaObject } from 'ajv'
import standaloneCode from 'ajv/dist/standalone'
import { program } from 'commander'
import fs from 'node:fs/promises'
import path from 'node:path'
import TJS from 'typescript-json-schema'


interface ValidatorConifg {
  action: 'validator'
  input: string
  type: string
  output: string
  ref: string
}

interface JSONConfig {
  action: 'json'
  input: string
  type: string
  output: string
}

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
  program: TJS.Program
  filename: string
  type: string
}

interface SchemaResult {
  filename: string
  type: string
  schema: SchemaObject
}

const buildSchema = async ({ program, filename, type }: BuildSchema): Promise<SchemaResult> => {
  const files = [
    filename,
  ]
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
  ref: string
}

const writeSchemaValidator = async ({ filename, schema, ref }: WriteSchemaValidator) => {
  const ajv = new Ajv({
    schemas: [schema.schema],
    code: { source: true, esm: true },
  })
  const moduleCode = standaloneCode(ajv, {
    [ref]: '#',
  })
  await fs.mkdir(path.dirname(filename), { recursive: true })
  await fs.writeFile(
    filename,
    moduleCode,
  )
  await writeSchemaValidatorType({
    filename,
    schema,
    ref: ref,
  })
}

const writeSchemaValidatorType = async ({ filename, schema, ref: name }: WriteSchemaValidator) => {
  const dir = path.relative(path.dirname(filename), path.dirname(schema.filename))
  await fs.writeFile(
    toTypeDefinition(filename),
    [
      `import { ${schema.type} } from '${dir.startsWith('..') ? '' : './'}${dir ? `${dir}/` : ''}${path.basename(schema.filename)}'`,
      ``,
      `export declare function ${name}(data: unknown): data is ${schema.type};`,
      ``,
    ].join('\n'),
  )
}

const validatorAction = async (input: string, type: string, output: string, ref: string) => {
  await writeSchemaValidator({
    schema: await buildSchema({
      program: TJS.getProgramFromFiles([input], compilerOptions),
      filename: path.resolve(input),
      type: type,
    }),
    filename: path.resolve(output),
    ref: ref,
  })
}

const jsonAction = async (input: string, type: string, output: string) => {
  await writeSchemaJson({
    schema: await buildSchema({
      program: TJS.getProgramFromFiles([input], compilerOptions),
      filename: path.resolve(input),
      type: type,
    }),
    filename: path.resolve(output),
  })
}

const configAction = async (filename: string) => {
  const config: (ValidatorConifg | JSONConfig)[] = JSON.parse(await fs.readFile(filename, 'utf-8'))
  await Promise.all([
    config.flatMap(async item => {
      if (item.action == 'validator') {
        await validatorAction(item.input, item.type, item.output, item.ref)
      } else if (item.action == 'json') {
        await jsonAction(item.input, item.type, item.output)
      }
    })
  ])
}

program
  .name('build_json_schema')

program
  .command('validator <input> <type> <output> <ref>')
  .action(validatorAction)

program
  .command('json <input> <type> <output>')
  .action(jsonAction)

program
  .command('config <filename>')
  .action(configAction)

program.parse()
