import { useProjects } from '../projects'
import { ProjectInfo } from '../types'
import { AppContainer } from './AppContainer'
import { CircularProgressIndicator } from './CircularProgressIndicator'
import { FilteredProjectListContainer } from './FilteredProjectList'

interface StatusProjectsProps {
  status: string
  projects: ProjectInfo[]
}

const StatusProjects = ({ status, projects }: StatusProjectsProps) => {
  const filteredProjects = projects.filter(e => e.statuses.find(e => e == status))
  return <FilteredProjectListContainer projects={filteredProjects} />
}

interface StatusPageProps {
  status: string
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

  return (
    <AppContainer>
      <StatusProjects {...props} projects={projects} />
    </AppContainer>
  )
}
