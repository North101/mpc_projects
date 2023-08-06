import { Wrap } from './Wrap';

import { CloudArrowDown } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import projects from "../projects.json";
import { ProjectAuthors } from './ProjectAuthors';
import { ProjectTags } from './ProjectTags';

interface ProjectPageProps {
  name: string;
}

export const ProjectPage = ({ name }: ProjectPageProps) => {
  const project = projects.find(e => e.name == name)!
  return (
    <Wrap>
      <Card>
        <Card.Header as="h5">
          <div style={{ display: 'flex' }}>
            <Card.Link href={`/project/${project.name}`} style={{ flex: 1, alignSelf: 'center', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {project.name}
            </Card.Link>
            <a href={`/${project.filename}`} download={true}>
              <Button style={{ width: 32, height: 32 }} variant="outline-primary" size='sm'>
                <CloudArrowDown />
              </Button>
            </a>
          </div>
          <Card.Subtitle><ProjectAuthors authors={project.authors} /></Card.Subtitle>
        </Card.Header>
        <Card.Header><ProjectTags tags={project.tags} /></Card.Header>
        <Card.Body>
          <Card.Text>
            <ReactMarkdown>{project.content ?? ""}</ReactMarkdown>
          </Card.Text>
        </Card.Body>
      </Card>
    </Wrap>
  )
}
