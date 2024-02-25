import { glob } from 'glob'
import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import * as TJS from "typescript-json-schema"

const settings: TJS.PartialArgs = {
  required: true,
}

const compilerOptions: TJS.CompilerOptions = {
  alwaysStrict: true,
  strictNullChecks: true,
}

const sortedKeys = (key: string, value: unknown) => {
  if (value instanceof Object && !Array.isArray(value)) {
    return Object.keys(value)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = value[key];
        return sorted
      }, {})
  }
  return value
}

export const generateSchema = async (path: string) => {
  const files = await glob([
    resolve(path, 'v[0-9]*.ts'),
    resolve(path, 'union.ts'),
  ])
  const program = TJS.getProgramFromFiles(files, compilerOptions, path)
  const schema = {
    ...TJS.generateSchema(program, 'ProjectUnion', settings, files)
  }
  fs.writeFile(resolve(path, 'schema.json'), JSON.stringify(schema, sortedKeys, 2))
}
