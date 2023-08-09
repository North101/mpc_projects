import { CloudArrowDown, InfoCircle } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger'
import Tooltip from 'react-bootstrap/esm/Tooltip'
import { ProjectAuthors } from './ProjectAuthors'
import { ProjectTags } from './ProjectTags'
import { Project } from '../types'

interface ProjectInfoProps {
  name: string
  info: string
}

export const ProjectInfo = ({ name, info }: ProjectInfoProps) => {
  return (
    <OverlayTrigger
      overlay={<Tooltip id={name}>{info}</Tooltip>}
    >
      <InfoCircle size={16} className='mx-1' />
    </OverlayTrigger>
  )
}

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => (
  <Card>
    <Card.Header as='h5'>
      <div className='d-flex align-items-center'>
        <Card.Link className='text-truncate flex-fill align-self-center' href={project.website ?? undefined}>
          {project.name}
        </Card.Link>
        <Button style={{ width: 32, height: 32, marginLeft: 4 }} variant='outline-primary' size='sm'>
          <a href={`/projects/${project.filename}`} download={true} style={{ color: 'inherit' }}><CloudArrowDown /></a>
        </Button>
      </div>
      <Card.Subtitle className='text-truncate'><ProjectAuthors authors={project.authors} /></Card.Subtitle>
    </Card.Header>
    <Card.Body className='d-flex align-items-center'>
      <small className='flex-fill'>Cards: {project.cardCount}</small>
      {project.info && <ProjectInfo name={project.name} info={project.info} />}
    </Card.Body>
    <Card.Footer>
      <ProjectTags tags={project.tags} />
    </Card.Footer>
  </Card>
)
