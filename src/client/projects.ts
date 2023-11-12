import { useEffect, useState } from 'react'
import { ProjectInfo } from './types'

let projects: Promise<ProjectInfo[]>

const fetchProjects = async (): Promise<ProjectInfo[]>  => {
  const r = await fetch('/projects.json')
  return await r.json() as ProjectInfo[]
}

export const useProjects = () => {
  const [data, setData] = useState<ProjectInfo[] | undefined>()

  useEffect(() => {
    projects ??= fetchProjects()
    projects.then(setData)
  }, [])

  return data
}
