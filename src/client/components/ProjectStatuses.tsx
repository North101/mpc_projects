import { useContext } from 'react'
import Badge from 'react-bootstrap/esm/Badge'
import Button from 'react-bootstrap/esm/Button'
import Stack from 'react-bootstrap/esm/Stack'
import { FilterContext } from './FilteredProjectList'


const stringToClass = (rawString: string): string => {
  let statusClass = rawString.replace(/[\s~]/g, '-')
  statusClass = statusClass.replace(/[!"#$%&'()*+,./:<=>?@[\\\]^`{|}]/g, '')
  return statusClass.toLowerCase()
}

const ProjectStatus = ({ status }: { status: string }) => {
  const { statusFilter, setStatusFilter } = useContext(FilterContext)
  const onClick = () => setStatusFilter(statusFilter.map((v) => {
    if (status == v.label) {
      return {
        ...v,
        checked: true,
      }
    }
    return v
  }))
  return (
    <Button variant='link' className={`p-0 m-0 status status-${stringToClass(status)}`} onClick={onClick}>
      <Badge pill bg='secondary'>{status}</Badge>
    </Button>
  )
}

interface ProjectStatusProps {
  statuses: string[]
}

export const ProjectStatuses = ({ statuses }: ProjectStatusProps) => (
  <Stack direction='horizontal' gap={1} className='status-pills'>
    {statuses.map(e =>
      <ProjectStatus key={e} status={e} />
    )}
  </Stack>
)
