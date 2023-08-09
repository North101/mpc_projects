import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import { ProjectCard } from './ProjectCard'
import { Project } from '../types'

interface ProjectListProps {
  projects: Project[]
}

export const ProjectList = ({ projects }: ProjectListProps) => (
  <Row xs={1} md={2} lg={3} className='g-4'>
    {projects.map((e, index) => (
      <Col key={index}>
        <ProjectCard project={e} />
      </Col>
    ))}
  </Row>
)
