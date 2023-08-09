import { useProjects } from '../projects'
import { Project } from '../types'
import { AppContainer } from './AppContainer'
import { CircularProgressIndicator } from './CircularProgressIndicator'
import { FilteredProjectListContainer } from './FilteredProjectList'

interface AuthorProjectsProps {
  name: string
  projects: Project[]
}

const AuthorProjects = ({ name, projects }: AuthorProjectsProps) => {
  const filteredProjects = projects.filter(e => e.authors.includes(name))
  return <FilteredProjectListContainer projects={filteredProjects} />
}

interface AuthorPageProps {
  name: string
}

export const AuthorPage = (props: AuthorPageProps) => {
  const projects = useProjects()
  if (projects == undefined) {
    return (
      <AppContainer>
        <CircularProgressIndicator />
      </AppContainer>
    )
  }

  return <AuthorProjects {...props} projects={projects} />
}
