import projects from "../projects";
import { ProjectList } from "./ProjectList";
import { Wrap } from './Wrap';

export const HomePage = () => {
  return (
    <Wrap>
      <ProjectList projects={projects} />
    </Wrap>
  )
}
