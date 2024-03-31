import { useQuery } from '@tanstack/react-query'
import { WebsiteProjects } from './types'

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => fetch('/projects.json').then(async (res) => res.json()),
    select: (data) => data as unknown as WebsiteProjects.Info[],
    staleTime: Infinity,
  })
}
