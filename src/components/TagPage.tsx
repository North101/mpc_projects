import projects from "../projects.json";
import { ProjectList } from "./ProjectList";
import { Wrap } from './Wrap';

interface TagPageProps {
  tag: string
}

export const TagPage = ({tag}: TagPageProps) => {
  const tagProjects = projects.filter(e => e.tags.find(e => e == tag));
  return (
    <Wrap>
      <ProjectList projects={tagProjects} />
    </Wrap>
  )
}
