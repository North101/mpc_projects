import { useEffect, useState } from 'react'
import { Project } from './types'

let projects: Promise<Project[]>

const fetchProjects = async () => {
  const r = await fetch('/projects.json')
  return await r.json()
}

export const useProjects = () => {
  const [data, setData] = useState<Project[] | undefined>()

  useEffect(() => {
    projects ??= fetchProjects()
    projects.then(setData)
  }, [])

  return data
}
