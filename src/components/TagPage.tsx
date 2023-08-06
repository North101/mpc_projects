import projects from "../projects";
import { ProjectList, useAuthorFilter, useSort, useTagFilter } from "./ProjectList";
import { Wrap } from './Wrap';

interface TagPageProps {
  tag: string
}

export const TagPage = ({ tag }: TagPageProps) => {
  const tagProjects = projects.filter(e => e.tags.find(e => e == tag));
  const [sort, setSort] = useSort();
  const [authorFilter, setAuthorFilter] = useAuthorFilter(tagProjects);
  const [tagFilter, setTagFilter] = useTagFilter(tagProjects);
  return (
    <Wrap>
      <ProjectList
        projects={tagProjects}
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
