import crypto from 'crypto'
import fs from 'node:fs/promises'
import path from 'node:path'


export const readJson = async (filename: string) => {
  try {
    return JSON.parse(await fs.readFile(filename, 'utf-8'))
  } catch (e) {
    throw Error(`Failed to parse ${filename}`)
  }
}

export const writeJson = async <T>(filename: string, value: T, indent?: number) => {
  return fs.writeFile(filename, JSON.stringify(value, undefined, indent), 'utf-8')
}

export const hashJson = (value: unknown) => {
  const hashSum = crypto.createHash('sha256')
  hashSum.update(JSON.stringify(value))
  return hashSum.digest('hex')
}

export const isProjectFile = (projectsDir: string, file: string) => {
  if (path.extname(file) != '.json') return false

  return file == path.join(projectsDir, path.basename(file))
}
