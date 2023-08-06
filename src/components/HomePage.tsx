import projects from "../projects";
import { ProjectList, useAuthorFilter, useSort, useTagFilter } from "./ProjectList";
import { Wrap } from './Wrap';

export const HomePage = () => {
  const [sort, setSort] = useSort();
  const [authorFilter, setAuthorFilter] = useAuthorFilter(projects);
  const [tagFilter, setTagFilter] = useTagFilter(projects);
  return (
    <Wrap>
      <ProjectList
        projects={projects}
        sort={sort}
        setSort={setSort}
        authorFilter={authorFilter}
        setAuthorFilter={setAuthorFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
      />
    </Wrap>
  )
}
