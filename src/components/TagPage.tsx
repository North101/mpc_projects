import projects from "../projects";
import { AppContainer } from "./AppContainer";
import { FilteredProjectList, useAuthorFilter, useSort, useTagFilter } from "./FilteredProjectList";

interface TagPageProps {
  tag: string
}

export const TagPage = ({ tag }: TagPageProps) => {
  const tagProjects = projects.filter(e => e.tags.find(e => e == tag));
  const [sort, setSort] = useSort();
  const [authorFilter, setAuthorFilter] = useAuthorFilter(tagProjects);
  const [tagFilter, setTagFilter] = useTagFilter(tagProjects);
  return (
    <AppContainer>
      <FilteredProjectList
        projects={tagProjects}
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
