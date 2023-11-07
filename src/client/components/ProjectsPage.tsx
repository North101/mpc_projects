import { useProjects } from '../projects'
import { AppContainer } from './AppContainer'
import { CircularProgressIndicator } from './CircularProgressIndicator'
import { FilteredProjectListContainer } from './FilteredProjectList'

export const ProjectsPage = () => {
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
      <FilteredProjectListContainer projects={projects} />
    </AppContainer>
  )
}
