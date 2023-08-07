import { useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Nav from 'react-bootstrap/esm/Nav';
import Navbar from 'react-bootstrap/esm/Navbar';
import Row from 'react-bootstrap/esm/Row';
import Stack from 'react-bootstrap/esm/Stack';
import { CheckboxDropdown, CheckboxState } from './CheckboxDropdown';
import { ProjectCard } from './ProjectCard';

const distinct = function <T>(value: T, index: number, self: Array<T>) {
  return self.indexOf(value) == index;
}

declare global {
  interface Array<T> {
    toSorted(compareFn?: ((a: T, b: T) => number) | undefined): Array<T>;
  }
}

Array.prototype.toSorted = function <T>(compareFn?: ((a: T, b: T) => number) | undefined): Array<T> {
  const copy = [...this];
  copy.sort(compareFn)
  return copy;
}

const sortByLabel = (a: CheckboxState, b: CheckboxState) => a.label == b.label ? 0 : a.label > b.label ? 1 : -1;

const sorts: {
  [key: string]: (a: Project, b: Project) => number;
} = {
  'Name': (a: Project, b: Project) => a.name == b.name ? 0 : a.name > b.name ? 1 : -1,
  'Newest': (a: Project, b: Project) => a.created == b.created ? 0 : a.created > b.created ? 1 : -1,
  'Oldest': (a: Project, b: Project) => a.created == b.created ? 0 : a.created > b.created ? -1 : 1,
}

export const useSort = () => {
  return useState('Newest');
}

export const useAuthorFilter = (projects: Project[]) => {
  return useState<CheckboxState[]>(projects.flatMap(e => e.authors).filter(distinct).map(e => {
    return {
      id: e,
      label: e,
      checked: false,
    };
  }).toSorted(sortByLabel));
}

export const useTagFilter = (projects: Project[]) => {
  return useState<CheckboxState[]>(projects.flatMap(e => e.tags).filter(distinct).map(e => {
    return {
      id: e,
      label: e,
      checked: false,
    };
  }).toSorted(sortByLabel));
}

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
            <Nav className="flex-grow-1" style={{ justifyContent: 'end' }}>
              <CheckboxDropdown
                label="Sort"
                items={Object.keys(sorts).map((e) => {
                  return {
                    id: e,
                    label: e,
                    checked: e == sort,
                  };
                })}
                onChecked={(id: string) => setSort(id)}
                onSelectNone={() => setSort('Newest')}
              />
              <CheckboxDropdown
                label="Authors"
                items={authorFilter}
                onChecked={(id: string, event: React.FormEvent<HTMLInputElement>) => setAuthorFilter(authorFilter.map(e => {
                  return {
                    ...e,
                    checked: e.id == id ? event.currentTarget.checked : e.checked,
                  };
                }))}
                onSelectNone={() => setAuthorFilter(authorFilter.map(e => {
                  return {
                    ...e,
                    checked: false,
                  };
                }))}
              />
              <CheckboxDropdown
                label="Tags"
                items={tagFilter}
                onChecked={(id: string, event: React.FormEvent<HTMLInputElement>) => setTagFilter(tagFilter.map(e => {
                  return {
                    ...e,
                    checked: e.id == id ? event.currentTarget.checked : e.checked,
                  };
                }))}
                onSelectNone={() => setTagFilter(tagFilter.map(e => {
                  return {
                    ...e,
                    checked: false,
                  };
                }))}
              />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ProjectList projects={filteredProjects} />
    </Stack>
  )
}

interface ProjectListProps {
  projects: Project[];
}

export const ProjectList = (props: ProjectListProps) => {
  const { projects } = props;
  return (
    <Row xs={1} md={2} lg={4} className="g-4">
      {projects.map((e, index) => {
        return <Col key={index}>
          <ProjectCard project={e} />
        </Col>
      })}
    </Row>
  )
}
