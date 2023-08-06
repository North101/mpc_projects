import projects from "../projects";
import { ProjectList } from "./ProjectList";
import { Wrap } from './Wrap';

interface AuthorPageProps {
  name: string
}

export const AuthorPage = ({name}: AuthorPageProps) => {
  const authorProjects = projects.filter(e => e.authors.includes(name));
  return (
    <Wrap>
      <ProjectList projects={authorProjects} />
    </Wrap>
  )
}
