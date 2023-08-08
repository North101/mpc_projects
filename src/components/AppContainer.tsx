import { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Navbar from "react-bootstrap/esm/Navbar";
import Stack from "react-bootstrap/esm/Stack";
import { useProjects } from "../projects";
import { CircularProgressIndicator } from "./CircularProgressIndicator";
import { ProjectList } from "./ProjectList";


interface HeaderProps {
  setSearch: (value: string) => void;
}

const Header = ({ setSearch }: HeaderProps) => (
  <Navbar expand className="bg-body-tertiary" sticky="top">
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
    <Stack gap={2} className="h-100">
      <Header setSearch={setSearch} />
      <Container className="h-100">
        {search.trim() ? <SearchProjectList search={search} /> : children}
      </Container>
      <div />
    </Stack>
  )
}
