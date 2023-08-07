import projects from "../projects";
import { AppContainer } from "./AppContainer";
import { FilteredProjectList, useAuthorFilter, useSort, useTagFilter } from "./FilteredProjectList";

interface AuthorPageProps {
  name: string
}

export const AuthorPage = ({ name }: AuthorPageProps) => {
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
