import projects from "../projects";
import { AppContainer } from "./AppContainer";
import { FilteredProjectList, useAuthorFilter, useSort, useTagFilter } from "./FilteredProjectList";

export const HomePage = () => {
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
