import { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Navbar from "react-bootstrap/esm/Navbar";
import Stack from "react-bootstrap/esm/Stack";
import { useProjects } from "../projects";
import { CircularProgressIndicator } from "./CircularProgressIndicator";
import { ProjectList } from "./ProjectList";
import { NavLink } from "react-bootstrap";


interface HeaderProps {
  setSearch: (value: string) => void;
}

const Header = ({ setSearch }: HeaderProps) => (
  <Navbar expand className="bg-body-tertiary" sticky="top">
    <Container className="d-flex justify-content-start">
      <Navbar.Brand href="/">MPC Projects</Navbar.Brand>
      <NavLink href="/about">About</NavLink>
      <span style={{ flex: 1 }} />
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
  const projects = useProjects();
  if (projects == undefined) {
    return <CircularProgressIndicator />
  }

  return (
    <ProjectList
      projects={projects.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))}
    />
  )
}

interface AppContainerProps {
  children: JSX.Element;
}

export const AppContainer = ({ children }: AppContainerProps) => {
  const [search, setSearch] = useState<string>("")
  return (
    <Stack gap={2} className="d-flex h-100">
      <Header setSearch={setSearch} />
      <div className="d-flex" style={{ flex: 1, overflowY: 'auto' }}>
        <Container>
          {search.trim() ? <SearchProjectList search={search} /> : children}
        </Container>
      </div>
      <div />
    </Stack>
  )
}
