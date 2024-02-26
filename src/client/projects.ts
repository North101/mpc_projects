import { useEffect, useState } from 'react'
import { WebsiteProjects } from './types'

let projects: Promise<WebsiteProjects.Info[]>

const fetchProjects = async (): Promise<WebsiteProjects.Info[]>  => {
  const r = await fetch('/projects.json')
  return await r.json() as WebsiteProjects.Info[]
}

export const useProjects = () => {
  const [data, setData] = useState<WebsiteProjects.Info[] | undefined>()

  useEffect(() => {
    projects ??= fetchProjects()
    projects.then(setData)
  }, [])

  return data
}
