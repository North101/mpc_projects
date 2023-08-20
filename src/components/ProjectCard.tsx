import { useState } from 'react'
import { CloudArrowDown, InfoCircle } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import { BoxArrowUpRight } from 'react-bootstrap-icons'
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

  const onShow = () => setShow(true)
  const onClose = () => setShow(false)

  const count = project.parts.reduce((count, card) => count + card.count, 0)

  return (
    <>
      <Card className='h-100'>
        <Card.Header as='div'>
          <h2 className='d-flex align-items-center'>
            <Card.Link
              className='flex-fill align-self-center icon-link'
              href={project.website ?? undefined}
            >
              {project.name}
              <BoxArrowUpRight />
            </Card.Link>
            <Button
              className='download'
              variant='outline-primary'
              size='sm'
              onClick={onShow}
            >
              <CloudArrowDown />
            </Button>
          </h2>
          <Card.Subtitle as='h3' className='text-truncate h6'>
            <ProjectAuthors authors={project.authors} />
          </Card.Subtitle>
        </Card.Header>
        <Card.Body className='d-flex'>
          <small className='flex-fill'>Cards: {count}</small>
          {project.info && <ProjectTooltip
            name={project.name}
            info={project.info}
          />}
        </Card.Body>
        <Card.Footer>
          <ProjectTags tags={project.tags} />
        </Card.Footer>
      </Card>
      {show && <ProjectDownloadModal
        project={project}
        onClose={onClose}
      />}
    </>
  )
}
