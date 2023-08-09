import crypto from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'


export const readJson = async (filename: string) => {
  return JSON.parse(await fs.readFile(filename, 'utf-8'))
}

export const writeJson = async <T>(filename: string, value: T) => {
  return fs.writeFile(filename, JSON.stringify(value, undefined, 2), 'utf-8')
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
