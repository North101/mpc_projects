import { PropsWithChildren, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Stack from 'react-bootstrap/esm/Stack'
import { useProjects } from '../projects'
import { CircularProgressIndicator } from './CircularProgressIndicator'
import { Header } from './Header'
import { ProjectList } from './ProjectList'

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

export const AppContainer = ({ children }: React.PropsWithChildren) => {
  const [search, setSearch] = useState<string>('')
  return (
    <Stack gap={2} className='d-flex h-100'>
      <Header setSearch={setSearch} />
      <div className='d-flex flex-fill'>
        <Container className='main'>
          {search.trim() ? <SearchProjectList search={search} /> : children}
        </Container>
      </div>
      <div />
    </Stack>
  )
}

export const AppContainerIntro = ({ children }: PropsWithChildren) => {
  const [search, setSearch] = useState<string>('')
  return (
    <Stack gap={2} className='d-flex h-100'>
      <Header setSearch={setSearch} />
      <div className='d-flex flex-fill'>
        <Container fluid='xxl' className='main'>
          {search.trim() ? <SearchProjectList search={search} /> : children}
        </Container>
      </div>
      <div />
    </Stack>
  )
}
