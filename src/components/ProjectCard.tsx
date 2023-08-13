import { useState } from 'react'
import { CloudArrowDown, InfoCircle } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger'
import Tooltip from 'react-bootstrap/esm/Tooltip'
import { ProjectInfo } from '../types'
import { ProjectAuthors } from './ProjectAuthors'
import { ProjectDownloadModal } from './ProjectDownloadModal'
import { ProjectTags } from './ProjectTags'

interface ProjectTooltipProps {
  name: string
  info: string
}

export const ProjectTooltip = ({ name, info }: ProjectTooltipProps) => {
  return (
    <OverlayTrigger
      overlay={<Tooltip id={name}>{info}</Tooltip>}
    >
      <InfoCircle size={16} className='mx-1' />
    </OverlayTrigger>
  )
}

interface ProjectCardProps {
  project: ProjectInfo
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Card>
        <Card.Header as='h5'>
          <div className='d-flex align-items-center'>
            <Card.Link className='text-truncate flex-fill align-self-center' href={project.website ?? undefined}>
              {project.name}
            </Card.Link>
            <Button style={{ width: 32, height: 32, marginLeft: 4 }} variant='outline-primary' size='sm' onClick={handleShow}>
              <CloudArrowDown />
            </Button>
          </div>
          <Card.Subtitle className='text-truncate'>
            <ProjectAuthors authors={project.authors} />
          </Card.Subtitle>
        </Card.Header>
        <Card.Body className='d-flex align-items-center'>
          <small className='flex-fill'>Cards: {project.parts.reduce((count, card) => count + card.count, 0)}</small>
          {project.info && <ProjectTooltip name={project.name} info={project.info} />}
        </Card.Body>
        <Card.Footer>
          <ProjectTags tags={project.tags} />
        </Card.Footer>
      </Card>
      {show && <ProjectDownloadModal project={project} handleClose={handleClose} />}
    </>
  )
}
