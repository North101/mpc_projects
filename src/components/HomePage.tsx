import { useProjects } from "../projects";
import { AppContainer } from "./AppContainer";
import { CircularProgressIndicator } from "./CircularProgressIndicator";
import { FilteredProjectListContainer } from "./FilteredProjectList";

export const HomePage = () => {
  const projects = useProjects();
  if (projects == undefined) {
    return (
      <AppContainer>
        <CircularProgressIndicator />
      </AppContainer>
    );
  }

  return <FilteredProjectListContainer projects={projects} />
}
