import { useProjects } from "../projects";
import { AppContainer } from "./AppContainer";
import { CircularProgressIndicator } from "./CircularProgressIndicator";
import { FilteredProjectList, useAuthorFilter, useSort, useTagFilter } from "./FilteredProjectList";

interface HomeProjectsProps {
  projects: Project[]
}

const HomeProjects = ({ projects }: HomeProjectsProps) => {
  const [sort, setSort] = useSort();
  const [authorFilter, setAuthorFilter] = useAuthorFilter(projects);
  const [tagFilter, setTagFilter] = useTagFilter(projects);
  return (
    <AppContainer>
      <FilteredProjectList
        projects={projects}
        sort={sort}
        setSort={setSort}
        authorFilter={authorFilter}
        setAuthorFilter={setAuthorFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
      />
    </AppContainer>
  )
}

export const HomePage = () => {
  const projects = useProjects();
  if (projects == undefined) {
    return (
      <AppContainer>
        <CircularProgressIndicator />
      </AppContainer>
    );
  }

  return <HomeProjects projects={projects} />
}
