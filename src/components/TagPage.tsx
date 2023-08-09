import { useProjects } from '../projects'
import { Project } from '../types'
import { AppContainer } from './AppContainer'
import { CircularProgressIndicator } from './CircularProgressIndicator'
import { FilteredProjectListContainer } from './FilteredProjectList'

interface TagProjectsProps {
  tag: string
  projects: Project[]
}

const TagProjects = ({ tag, projects }: TagProjectsProps) => {
  const filteredProjects = projects.filter(e => e.tags.find(e => e == tag))
  return <FilteredProjectListContainer projects={filteredProjects} />
}

interface TagPageProps {
  tag: string
}

export const TagPage = (props: TagPageProps) => {
  const projects = useProjects()
  if (projects == undefined) {
    return (
      <AppContainer>
        <CircularProgressIndicator />
      </AppContainer>
    )
  }

  return <TagProjects {...props} projects={projects} />
}
