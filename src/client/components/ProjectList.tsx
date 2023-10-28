import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import { ProjectInfo } from '../types'
import { ProjectCard } from './ProjectCard'

interface ProjectListProps {
  projects: ProjectInfo[]
}

export const ProjectList = ({ projects }: ProjectListProps) => (
  <Row xs={1} md={2} lg={3} className='projects g-4 mt-2 mt-md-0'>
    {projects.map((e, index) => (
      <Col key={index}>
        <ProjectCard project={e} />
      </Col>
    ))}
  </Row>
)
