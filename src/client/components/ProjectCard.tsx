import ISO6391 from 'iso-639-1'
import { useState } from 'react'
import { BoxArrowUpRight, CloudArrowDown, InfoCircleFill } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger'
import Tooltip from 'react-bootstrap/esm/Tooltip'
import { ProjectInfo } from '../types'
import { ProjectAuthors } from './ProjectAuthors'
import { ProjectDownloadModal } from './ProjectDownloadModal'
import { ProjectStatuses } from './ProjectStatuses'
import { ProjectTags } from './ProjectTags'
import { ProjectLangs } from './ProjectLangs'

interface ProjectTooltipProps {
  name: string
  info: string
}

export const ProjectTooltip = ({ name, info }: ProjectTooltipProps) => (
  <OverlayTrigger
    overlay={<Tooltip id={name}>{info}</Tooltip>}
  >
    <InfoCircleFill size={16} className='info-tooltip mx-3 mt-3 position-absolute top-0 end-0' />
  </OverlayTrigger>
)

interface ProjectCardProps {
  project: ProjectInfo
}

{/*
export const ProjectParts= ({ project }: ProjectCardProps) => {
  const parts = project.parts.map(part =>
    {part.key > 0 <li>{part.name}</li> ?? '' }
  )
  return <ul>{parts}</ul>
})
*/}

export const ProjectImage = ({ name, info }: ProjectTooltipProps) => {
  if (info) {
    return (
      <OverlayTrigger
        placement='bottom-end'
        overlay={<Tooltip className='illustrator-tooltip' id={name || 'core.jpg'}>Illus. {info}</Tooltip>}
      >
        <img
          id={name || 'core.jpg'}
          className='card-img-top'
          alt=''
          src={name ? `/projects/${name}` : '/assets/images/core.jpg'}
        />
      </OverlayTrigger>
    )
  } else {
    return (
      <img
        className='card-img-top'
        alt=''
        src={name ? `/projects/${name}` : '/assets/images/core.jpg'}
      />
    )
  }
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [show, setShow] = useState(false)

  const onShow = () => setShow(true)
  const onClose = () => setShow(false)

  const enabledParts = project.parts.filter((part) => {
    return part.enabled
  })

  const count = enabledParts.reduce((count, card) => count + card.count, 0)

  return (
    <>
      <Card className='h-100'>
        <ProjectImage
          name={project.image ?? ''}
          info={project.artist ?? ''}
        />
        <Card.Header as='div'>
          <h2 className='card-title d-flex align-items-top'>
            <Card.Title
              className='flex-fill align-self-center'>
              {project.name}
            </Card.Title>
            <Button
              className='download'
              variant='outline-primary'
              size='sm'
              aria-label={`download ${project.name}`}
              onClick={onShow}
            >
              <CloudArrowDown
                className='icon-dl'
                focusable='false'
                aria-hidden='true'
              />
            </Button>
          </h2>
          <Card.Subtitle as='h3' className='h6'>
            <ProjectAuthors authors={project.authors} />
          </Card.Subtitle>
        </Card.Header>
        <Card.Body className='card-text position-relative d-flex flex-column align-items-start justify-content-start'>
          <small className='project-count'>Cards: {count}</small>
          {project.scenarioCount && project.scenarioCount > 0 ? <small
            className='scenario-count'>
            Scenarios: {project.scenarioCount}
          </small> : ''}
          {project.investigatorCount && project.investigatorCount > 0 ? <small
            className='scenario-count'>
            Investigators: {project.investigatorCount}
          </small> : ''}
          {project.info && <ProjectTooltip
            name={project.name}
            info={project.info}
          />}
          <Card.Text className='my-2'>
            {project.description}
          </Card.Text>
          {/* <ProjectParts /> */}
          {project.website && <Card.Link
            className="icon-link mt-auto"
            href={project.website}
          >
            Learn more
            <BoxArrowUpRight/>
          </Card.Link>}
          {project.cardsLink && <Card.Link
              className="icon-link mt-auto"
              href={project.cardsLink}
          >
            View the cards
            <BoxArrowUpRight/>
          </Card.Link>}
        </Card.Body>
        <Card.Footer>
          <ProjectLangs lang={ISO6391.getNativeName(project.lang)} />
          <ProjectStatuses statuses={project.statuses} />
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
