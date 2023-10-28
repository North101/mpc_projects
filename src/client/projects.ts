import { useEffect, useState } from 'react'
import { ProjectInfo } from './types'

let projects: Promise<ProjectInfo[]>

const fetchProjects = async () => {
  const r = await fetch('/projects.json')
  return await r.json()
}

export const useProjects = () => {
  const [data, setData] = useState<ProjectInfo[] | undefined>()

  useEffect(() => {
    projects ??= fetchProjects()
    projects.then(setData)
  }, [])

  return data
}
