import fs from 'node:fs/promises'


export const readJson = async (filename: string) => {
  return JSON.parse(await fs.readFile(filename, 'utf-8'))
}
