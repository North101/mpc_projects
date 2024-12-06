import { useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Stack from 'react-bootstrap/esm/Stack'
import { useProjects } from '../projects'
import { CircularProgressIndicator } from './CircularProgressIndicator'
import { Header } from './Header'
import { ProjectList } from './ProjectList'
import { Announcements } from './Announcements'

interface SearchProjectListProps {
  search: string
}

const SearchProjectList = ({ search }: SearchProjectListProps) => {
  const { isLoading, data } = useProjects()
  if (isLoading) {
    return <CircularProgressIndicator />
  }

  return (
    <ProjectList
      projects={data?.filter(e => e.name.toLowerCase().includes(search.toLowerCase())) ?? []}
    />
  )
}

export interface AppContainerProps extends React.PropsWithChildren {
  fluid?: string
  showSearch?: boolean
  showAnnouncements?: boolean
}

export const AppContainer = ({ children, fluid, showSearch = true }: AppContainerProps) => {
  const [search, setSearch] = useState<string>('')
  const [showAnnouncements, setShowAnnouncements] = useState(true)
  return (
    <Stack gap={2} className='d-flex h-100'>
      <Header showSearch={showSearch} setSearch={setSearch} />
      <Announcements showAnnouncements={showAnnouncements} setShowAnnouncements={setShowAnnouncements} />
      <div className='d-flex flex-fill'>
        <Container fluid={fluid ? 'xxl' : undefined} className='main'>
          {search.trim() ? <SearchProjectList search={search} /> : children}
        </Container>
      </div>
      <div />
    </Stack>
  )
}
