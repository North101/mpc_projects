import { useProjects } from '../projects'
import { ProjectInfo } from '../types'
import { AppContainer } from './AppContainer'
import { CircularProgressIndicator } from './CircularProgressIndicator'
import { FilteredProjectListContainer } from './FilteredProjectList'

interface SiteProjectsProps {
  site: string
  projects: ProjectInfo[]
}

const SiteProjects = ({ site, projects }: SiteProjectsProps) => {
  const filteredProjects = projects.filter(e => Object.values(e.sites).find(e => e == site))
  return <FilteredProjectListContainer projects={filteredProjects} />
}

interface SitePageProps {
  site: string
}

export const SitePage = (props: SitePageProps) => {
  const projects = useProjects()
  if (projects == undefined) {
    return (
      <AppContainer>
        <CircularProgressIndicator />
      </AppContainer>
    )
  }

  return <SiteProjects {...props} projects={projects} />
}
