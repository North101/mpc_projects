import { useContext } from 'react';
import Badge from 'react-bootstrap/esm/Badge'
import Stack from 'react-bootstrap/esm/Stack'
import { FilterContext } from './FilteredProjectList';


const stringToClass = (rawString: string): string => {
  let statusClass = rawString.replace(/[\s~]/g, '-');
  statusClass = statusClass.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}]/g, '');
  return statusClass.toLowerCase();
}

export const ProjectStatus = ({ status }: { status: string }) => {
  const { statusFilter, setStatusFilter } = useContext(FilterContext)
  const onClick = () => {
    setStatusFilter(statusFilter.map((v) => {
      if (status == v.label) {
        return {
          ...v,
          checked: true,
        }
      }
      return v
    }))
  }
  return (
    <a className={`status status-${stringToClass(status)}`} href='javascript:void(0)' onClick={onClick}>
      <Badge pill bg='secondary'>{status}</Badge>
    </a>
  )
}

interface ProjectStatusProps {
  statuses: string[]
}

export const ProjectStatuses = ({ statuses }: ProjectStatusProps) => (
  <Stack direction='horizontal' gap={1}>
    {statuses.map(e =>
      <ProjectStatus key={e} status={e} />
    )}
  </Stack>
)
