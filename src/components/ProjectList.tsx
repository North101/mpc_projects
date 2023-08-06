import Row from 'react-bootstrap/esm/Row';
import { ProjectCard } from './ProjectCard';
import Col from 'react-bootstrap/esm/Col';

interface ProjectListProps {
  projects: Project[]
}

export const ProjectList = ({ projects }: ProjectListProps) => {
  return (
    <Row xs={1} md={1} lg={2} className="g-4">
      {projects.map((e, index) => {
        return <Col key={index}>
          <ProjectCard project={e} />
        </Col>
      })}
    </Row>
  )
}
