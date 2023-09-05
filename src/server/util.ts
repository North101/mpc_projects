import { promises as fs } from 'fs'


export const readJson = async (filename: string) => {
  return JSON.parse(await fs.readFile(filename, 'utf-8'))
}
