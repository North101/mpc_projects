import { glob } from 'glob'
import fs from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import * as TJS from "typescript-json-schema"
import { PluginOption } from 'vite'

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

const generateSchema = async (path: string) => {
  const files = await glob([
    resolve(path, 'v[0-9]*.ts'),
    resolve(path, 'union.ts'),
  ])
  const program = TJS.getProgramFromFiles(files, null, path)
  const schema = {
    ...TJS.generateSchema(program, 'ProjectUnion', undefined, files)
  }
  fs.writeFile(resolve(path, 'schema.json'), JSON.stringify(schema, sortedKeys, 2))
}

export const schemaBuilder = ({ paths }: { paths: string[] }): PluginOption => {
  paths = paths.map(path => resolve(path))
  return {
    name: 'vite-plugin-build-schema',
    async writeBundle() {
      for (const path of paths) {
        await generateSchema(path)
      }
    },
    handleHotUpdate: async ({ file }) => {
      for (const path of paths) {
        if (file.startsWith(path) && extname(file) == '.ts') {
          await generateSchema(path)
        }
      }
    },
  }
}
