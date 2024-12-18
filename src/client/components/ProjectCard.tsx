import { useState } from 'react'
import { BoxArrowUpRight, CloudArrowDown, InfoCircleFill } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger'
import Tooltip from 'react-bootstrap/esm/Tooltip'
import { useSizes } from '../projects'
import { WebsiteProjects } from '../types'
import { ChangelogIcon } from './Icons'
import { ProjectAuthors } from './ProjectAuthors'
import { ProjectChangelogModal } from './ProjectChangelogModal'
import { ProjectDownloadModal } from './ProjectDownloadModal'
import { ProjectLangs } from './ProjectLangs'
import { ProjectStatuses } from './ProjectStatuses'
import { ProjectTags } from './ProjectTags'

const sizeIcons: {
  [key: string]: [number, number]
} = {
  'Blank Micro Cards (32 x 45mm)': [32, 45],
  'Blank Mini American Cards (41mm x 63mm)': [41, 63],
  'Blank Mini European Cards (44mm x 67mm)': [44, 67],
  'Blank Square Cards (70mm x 70mm)': [70, 70],
  'Blank Game Cards (63 x 88mm)': [63, 88],
  'Blank Poker Cards (63.5 x 88.9mm)': [63.5, 88.9],
  'Blank Bridge Cards (57mm x 89mm)': [57, 89],
  'Blank Square Cards (89mm x 89mm)': [89, 89],
  'Blank Tarot Cards (70mm x 121mm)': [70, 121],
  'Blank Jumbo Cards (89mm x 127mm)': [89, 127],
}


interface ProjectCardSizesProps {
  project: WebsiteProjects.Info
}

const listSizeIcons = (project: WebsiteProjects.Info): [string, number, number, boolean][] => {
  const sizes = project.options
    .flatMap((e) => e.parts)
    .flatMap((e) => e.size)

  const showSizes = useSizes()
  return Object.entries(sizeIcons)
    .filter(([key]) => showSizes.includes(key))
    .map(([key, [width, height]]) => [key, width, height, sizes.includes(key)])
}


const ProjectCardSizes = ({ project }: ProjectCardSizesProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'end' }}>
      {listSizeIcons(project).map(([name, width, height, found], index) => (
        <OverlayTrigger
          key={index}
          overlay={<Tooltip id={name}>{name}</Tooltip>}
        >
          <div style={{
            width: width / 3,
            height: height / 3,
            border: 1,
            borderColor: 'grey',
            borderStyle: 'solid',
            backgroundColor: found ? 'white' : 'transparent',
            borderRadius: 4,
          }} />
        </OverlayTrigger>
      ))}
    </div>
  )
}


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
  project: WebsiteProjects.Info
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

enum ProjectShow {
  download,
  changelog,
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [show, setShow] = useState<ProjectShow | null>(null)

  const onShowDownload = () => setShow(ProjectShow.download)
  const onShowChangelog = () => setShow(ProjectShow.changelog)
  const onClose = () => setShow(null)

  const count = project.options.flatMap(option => option.parts).filter((part) => {
    return part.enabled
  }).reduce((count, card) => count + card.count, 0)

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
            {project.changelog && <Button
              className='changelog'
              variant='outline-primary'
              size='sm'
              aria-label={`${project.name} changelog`}
              onClick={onShowChangelog}
            >
              <ChangelogIcon />
            </Button>}
            <Button
              className='download'
              variant='outline-primary'
              size='sm'
              aria-label={`download ${project.name}`}
              onClick={onShowDownload}
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
            <BoxArrowUpRight />
          </Card.Link>}
          {project.cardsLink && <Card.Link
            className="icon-link mt-auto"
            href={project.cardsLink}
          >
            View the cards
            <BoxArrowUpRight />
          </Card.Link>}
        </Card.Body>
        <Card.Footer>
          <ProjectLangs lang={project.lang} />
          <ProjectStatuses statuses={project.statuses} />
          <ProjectTags tags={project.tags} />
          <ProjectCardSizes project={project} />
        </Card.Footer>
      </Card>
      {show == ProjectShow.download && <ProjectDownloadModal
        project={project}
        onClose={onClose}
      />}
      {show == ProjectShow.changelog && <ProjectChangelogModal
        project={project}
        onClose={onClose}
      />}
    </>
  )
}
