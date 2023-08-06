import { useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Navbar from 'react-bootstrap/esm/Navbar';
import Stack from 'react-bootstrap/esm/Stack';
import projects from "../projects";
import { ProjectList, useAuthorFilter, useSort, useTagFilter } from './ProjectList';


interface HeaderProps {
  setSearch: (value: string) => void;
}

const Header = ({ setSearch }: HeaderProps) => (
  <Navbar expand="lg" className="bg-body-tertiary" sticky='top'>
    <Container>
      <Navbar.Brand href="/">MPC Projects</Navbar.Brand>
      <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
          onChange={e => setSearch(e.target.value)}
        />
      </Form>
    </Container>
  </Navbar>
);

interface SearchProjectListProps {
  search: string;
}

const SearchProjectList = ({ search }: SearchProjectListProps) => {
  const searchProjects = search.length ? projects.filter(e => e.name.toLowerCase().includes(search.toLowerCase())) : [];
  const [sort, setSort] = useSort();
  const [authorFilter, setAuthorFilter] = useAuthorFilter(searchProjects);
  const [tagFilter, setTagFilter] = useTagFilter(searchProjects);
  return <ProjectList
    key='search'
    projects={searchProjects}
    sort={sort}
    setSort={setSort}
    authorFilter={authorFilter}
    setAuthorFilter={setAuthorFilter}
    tagFilter={tagFilter}
    setTagFilter={setTagFilter}
  />
}

interface WrapProps {
  children: JSX.Element;
}

export const Wrap = ({ children }: WrapProps) => {
  const [search, setSearch] = useState<string>("")

  return (
    <Stack gap={4}>
      <Header setSearch={setSearch} />
      <Container>
        {search.trim() ? <SearchProjectList search={search} /> : children}
      </Container>
      <div />
    </Stack>
  )
}
