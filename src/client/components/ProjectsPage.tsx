import { useProjects } from '../projects'
import { AppContainer } from './AppContainer'
import { CircularProgressIndicator } from './CircularProgressIndicator'
import { FilteredProjectListContainer } from './FilteredProjectList'

export const ProjectsPage = () => {
  const { isLoading, data } = useProjects()
  if (isLoading) {
    return (
      <AppContainer>
        <CircularProgressIndicator />
      </AppContainer>
    )
  }

  return (
    <>
      <AppContainer>
        <FilteredProjectListContainer projects={data ?? []} />
      </AppContainer>
    </>
  )
}
