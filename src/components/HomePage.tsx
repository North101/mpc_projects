import projects from "../projects.json";
import { ProjectList } from "./ProjectList";
import { Wrap } from './Wrap';

export const HomePage = () => {
  return (
    <Wrap>
      <ProjectList projects={projects} />
    </Wrap>
  )
}
