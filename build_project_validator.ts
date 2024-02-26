import Ajv from 'ajv'
import standaloneCode from 'ajv/dist/standalone'
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

export const buildProjectValidate = async (path: string) => {
  const files = await glob([
    resolve(path, 'v[0-9]*.ts'),
    resolve(path, 'union.ts'),
  ])
  const program = TJS.getProgramFromFiles(files, compilerOptions, path)
  const schema = {
    ...TJS.generateSchema(program, 'ProjectUnion', settings, files)
  }

  const ajv = new Ajv({
    schemas: [schema],
    code: { source: true, esm: true },
  })
  const moduleCode = standaloneCode(ajv, {
    validate: '#',
  })
  fs.writeFile(resolve(path, 'validate.js'), moduleCode)
}


const paths = [
  './vite-plugin-project-builder/types/extension_projects',
  './vite-plugin-project-builder/types/website_projects',
]
for (const path of paths) {
  await buildProjectValidate(path)
}
