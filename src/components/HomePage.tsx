import { useProjects } from '../projects'
import { AppContainer } from './AppContainer'
import { CircularProgressIndicator } from './CircularProgressIndicator'
import { FilteredProjectListContainer } from './FilteredProjectList'
import { Intro } from './Intro.tsx';

export const HomePage = () => {
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
      <>
        <Intro />
        <FilteredProjectListContainer projects={projects} />
      </>
    </AppContainer>
  )
}
