import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import { ProjectInfo } from '../types'
import { ProjectCard } from './ProjectCard'
//import { Breakpoint } from '../useBreakpoint'

interface ProjectListProps {
  projects: ProjectInfo[]
}

{/*const cols = ({Breakpoint}) : string => {
  if ({Breakpoint} === 'lg') {
    const cols = 3
  } else if ({Breakpoint} === 'md') {
    const cols = 2
  } else {
    const cols = 1
  }
  console.log(`breakpoint = ${Breakpoint}, cols = ${cols}`)
  return cols
}*/}

export const ProjectList = ({ projects }: ProjectListProps, cols: number) => (
  <Row xs={1} md={2} lg={3} className='projects g-4'>
    {projects.map((e, index) => (
      //<Col key={index} className={cols}>
      <Col key={index}>
        <ProjectCard project={e} />
      </Col>
    ))}
  </Row>
)
