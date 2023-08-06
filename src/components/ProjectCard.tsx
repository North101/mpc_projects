import { CloudArrowDown } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import { ProjectAuthors } from './ProjectAuthors';
import { ProjectTags } from './ProjectTags';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return <Card style={{ height: 250, overflow: 'hidden' }}>
    <Card.Header as="h5">
      <div style={{ display: 'flex' }}>
        <Card.Link href={`/project/${project.name}`} style={{ flex: 1, alignSelf: 'center', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {project.name}
        </Card.Link>
        <Button style={{ width: 32, height: 32 }} variant="outline-primary" size='sm'>
          <a href={`/projects/${project.filename}`} download={true} style={{color: 'inherit'}}><CloudArrowDown /></a>
        </Button>
      </div>
      <Card.Subtitle><ProjectAuthors authors={project.authors} /></Card.Subtitle>
    </Card.Header>
    <Card.Header><ProjectTags tags={project.tags} /></Card.Header>
    <Card.Body>
      <Card.Text>{project.description}</Card.Text>
    </Card.Body>
  </Card>;
}
