import { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/esm/Nav";
import Navbar from "react-bootstrap/esm/Navbar";
import Stack from "react-bootstrap/esm/Stack";
import { CheckboxDropdown, CheckboxState } from "./CheckboxDropdown";
import { ProjectList } from "./ProjectList";

declare global {
  interface Array<T> {
    toSorted(compareFn?: ((a: T, b: T) => number) | undefined): Array<T>;
    distinct(): Array<T>;
  }
}

Array.prototype.toSorted = function <T>(compareFn?: ((a: T, b: T) => number) | undefined): Array<T> {
  const copy = [...this];
  copy.sort(compareFn)
  return copy;
}

const distinct = function <T>(value: T, index: number, self: Array<T>) {
  return self.indexOf(value) == index;
}

Array.prototype.distinct = function <T>(): Array<T> {
  return this.filter(distinct);
}

const sortByLabel = (a: CheckboxState, b: CheckboxState) => a.label == b.label ? 0 : a.label > b.label ? 1 : -1;

const sorts: {
  [key: string]: (a: Project, b: Project) => number;
} = {
  "Name": (a: Project, b: Project) => a.name == b.name ? 0 : a.name > b.name ? 1 : -1,
  "Newest": (a: Project, b: Project) => a.created == b.created ? 0 : a.created > b.created ? 1 : -1,
  "Oldest": (a: Project, b: Project) => a.created == b.created ? 0 : a.created > b.created ? -1 : 1,
}

export const useSort = () => useState("Newest");

export const useAuthorFilter = (projects: Project[]) => useState<CheckboxState[]>(projects.flatMap(e => e.authors)
  .distinct()
  .map(e => ({
    id: e,
    label: e,
    checked: false,
  }))
  .toSorted(sortByLabel));

export const useTagFilter = (projects: Project[]) => useState<CheckboxState[]>(projects.flatMap(e => e.tags)
  .distinct()
  .map(e => ({
    id: e,
    label: e,
    checked: false,
  }))
  .toSorted(sortByLabel));

interface FilteredProjectListProps {
  projects: Project[];
  sort: string;
  setSort: (state: string) => void;
  authorFilter: CheckboxState[];
  setAuthorFilter: (state: CheckboxState[]) => void;
  tagFilter: CheckboxState[];
  setTagFilter: (state: CheckboxState[]) => void;
}

export const FilteredProjectList = (props: FilteredProjectListProps) => {
  const { projects, sort, setSort, authorFilter, setAuthorFilter, tagFilter, setTagFilter } = props;

  const filteredAuthors = authorFilter.filter(e => e.checked).map(e => e.id);
  const filteredTags = tagFilter.filter(e => e.checked).map(e => e.id);
  const filteredProjects = projects.filter(e => {
    const hasSomeAuthors = !filteredAuthors.length || e.authors.some(author => filteredAuthors.includes(author));
    const hasSomeTags = !filteredTags.length || e.tags.some(tag => filteredTags.includes(tag));
    return hasSomeAuthors && hasSomeTags;
  }).toSorted(sorts[sort]);

  return (
    <Stack gap={4}>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="flex-grow-1">
              <CheckboxDropdown
                type="radio"
                label="Sort"
                items={Object.keys(sorts).map((e) => ({
                  id: e,
                  label: e,
                  checked: e == sort,
                }))}
                onChecked={(id: string) => setSort(id)}
              />
              <CheckboxDropdown
                type="checkbox"
                label="Authors"
                items={authorFilter}
                onChecked={(id: string, event: React.FormEvent<HTMLInputElement>) => setAuthorFilter(authorFilter.map(e => ({
                  ...e,
                  checked: e.id == id ? event.currentTarget.checked : e.checked,
                })))}
                onSelectNone={() => setAuthorFilter(authorFilter.map(e => ({
                  ...e,
                  checked: false,
                })))}
              />
              <CheckboxDropdown
                type="checkbox"
                label="Tags"
                items={tagFilter}
                onChecked={(id: string, event: React.FormEvent<HTMLInputElement>) => setTagFilter(tagFilter.map(e => ({
                  ...e,
                  checked: e.id == id ? event.currentTarget.checked : e.checked,
                })))}
                onSelectNone={() => setTagFilter(tagFilter.map(e => ({
                  ...e,
                  checked: false,
                })))}
              />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ProjectList projects={filteredProjects} />
    </Stack>
  )
}
