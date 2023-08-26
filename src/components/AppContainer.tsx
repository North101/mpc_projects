import { Dispatch, SetStateAction, useState } from 'react'
import { Nav, NavLink } from 'react-bootstrap'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/esm/Form'
import Navbar from 'react-bootstrap/esm/Navbar'
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse'
import Stack from 'react-bootstrap/esm/Stack'
import { useProjects } from '../projects'
import { CircularProgressIndicator } from './CircularProgressIndicator'
import { ProjectList } from './ProjectList'
import { Branding } from './Branding'


interface HeaderProps {
  setSearch: Dispatch<SetStateAction<string>>
}

const Header = ({ setSearch }: HeaderProps) => (
  <Navbar expand='sm' className='bg-body-tertiary' sticky='top'>
    <Container>
      <Navbar.Brand href='/' className="col-sm-4 d-flex justify-content-start align-items-stretch">
        <Branding />
      </Navbar.Brand>
      <Navbar.Toggle />
      <NavbarCollapse>
        <Nav className='d-flex justify-content-start flex-fill ms-4'>
          <NavLink href='/help'>Getting Started</NavLink>
          <NavLink href='/about'>About</NavLink>
          <span className='flex-fill' />
          <Form>
            <Form.Control
              type='search'
              placeholder='Search'
              className='me-2'
              aria-label='Search'
              onChange={e => setSearch(e.target.value)}
            />
          </Form>
        </Nav>
      </NavbarCollapse>
    </Container>
  </Navbar>
)

interface SearchProjectListProps {
  search: string
}

const SearchProjectList = ({ search }: SearchProjectListProps) => {
  const projects = useProjects()
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
  children: JSX.Element
}

export const AppContainer = ({ children }: AppContainerProps) => {
  const [search, setSearch] = useState<string>('')
  return (
    <Stack gap={2} className='d-flex h-100'>
      <Header setSearch={setSearch} />
      <div className='d-flex flex-fill overflow-auto'>
        <Container className='main'>
          {search.trim() ? <SearchProjectList search={search} /> : children}
        </Container>
      </div>
      <div />
    </Stack>
  )
}
