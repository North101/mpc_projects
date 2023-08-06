import projects from "../projects";
import { ProjectList, useAuthorFilter, useSort, useTagFilter } from "./ProjectList";
import { Wrap } from './Wrap';

interface AuthorPageProps {
  name: string
}

export const AuthorPage = ({ name }: AuthorPageProps) => {
  const authorProjects = projects.filter(e => e.authors.includes(name));
  const [sort, setSort] = useSort();
  const [authorFilter, setAuthorFilter] = useAuthorFilter(authorProjects);
  const [tagFilter, setTagFilter] = useTagFilter(authorProjects);
  return (
    <Wrap>
      <ProjectList
        projects={authorProjects}
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
