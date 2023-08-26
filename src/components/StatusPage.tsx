import { useProjects } from '../projects'
import { ProjectInfo } from '../types'
import { AppContainer } from './AppContainer'
import { CircularProgressIndicator } from './CircularProgressIndicator'
import { FilteredProjectListContainer } from './FilteredProjectList'

interface StatusProjectsProps {
  tag: string
  projects: ProjectInfo[]
}

const StatusProjects = ({ status, projects }: StatusProjectsProps) => {
  const filteredProjects = projects.filter(e => e.status.find(e => e == status))
  return <FilteredProjectListContainer projects={filteredProjects} />
}

interface StatusPageProps {
  tag: string
}

export const StatusPage = (props: StatusPageProps) => {
  const projects = useProjects()
  if (projects == undefined) {
    return (
      <AppContainer>
        <CircularProgressIndicator />
      </AppContainer>
    )
  }

  return <StatusProjects {...props} projects={projects} />
}
