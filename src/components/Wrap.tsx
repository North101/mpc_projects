import { useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Navbar from 'react-bootstrap/esm/Navbar';
import Stack from 'react-bootstrap/esm/Stack';
import projects from "../projects";
import { ProjectList } from './ProjectList';


interface HeaderProps {
  setSearch: (value: string | undefined) => void;
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

interface AppProps {
  children: JSX.Element;
}

export const Wrap = ({ children }: AppProps) => {
  const [search, setSearch] = useState<string | undefined>()
  const searchProjects = search && projects.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <Stack gap={4}>
      <Header setSearch={setSearch} />
      <Container>{searchProjects ? <ProjectList projects={searchProjects} /> : children}</Container>
      <div />
    </Stack>
  )
}
