import { useProjects } from "../projects";
import { AppContainer } from "./AppContainer";
import { CircularProgressIndicator } from "./CircularProgressIndicator";
import { FilteredProjectList, useAuthorFilter, useSort, useTagFilter } from "./FilteredProjectList";

interface TagProjectsProps {
  tag: string
  projects: Project[]
}

const TagProjects = ({ tag, projects }: TagProjectsProps) => {
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

interface TagPageProps {
  tag: string
}

export const TagPage = (props: TagPageProps) => {
  const projects = useProjects();
  if (projects == undefined) {
    return (
      <AppContainer>
        <CircularProgressIndicator />
      </AppContainer>
    );
  }

  return <TagProjects {...props} projects={projects} />
}
