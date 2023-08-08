import { useProjects } from "../projects";
import { AppContainer } from "./AppContainer";
import { CircularProgressIndicator } from "./CircularProgressIndicator";
import { FilteredProjectList, useAuthorFilter, useSort, useTagFilter } from "./FilteredProjectList";

interface AuthorProjectsProps {
  name: string
  projects: Project[];
}

const AuthorProjects = ({ name, projects }: AuthorProjectsProps) => {
  const authorProjects = projects.filter(e => e.authors.includes(name));
  const [sort, setSort] = useSort();
  const [authorFilter, setAuthorFilter] = useAuthorFilter(authorProjects);
  const [tagFilter, setTagFilter] = useTagFilter(authorProjects);
  return (
    <AppContainer>
      <FilteredProjectList
        projects={authorProjects}
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

interface AuthorPageProps {
  name: string
}

export const AuthorPage = (props: AuthorPageProps) => {
  const projects = useProjects();
  if (projects == undefined) {
    return (
      <AppContainer>
        <CircularProgressIndicator />
      </AppContainer>
    );
  }

  return <AuthorProjects {...props} projects={projects} />
}
