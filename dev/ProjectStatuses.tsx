import Badge from 'react-bootstrap/esm/Badge'
import Stack from 'react-bootstrap/esm/Stack'


const stringToClass = (rawString: string) : string => {
  let statusClass = rawString.replace(/[\s~]/g, '-');
  statusClass = statusClass.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}]/g, '');
  return statusClass.toLowerCase();
}

export const ProjectStatus = ({ status }: { status: string })  => (
  <a className={`status status-${stringToClass(status)}`} href={`/status/${status}`}>
    <Badge pill bg='secondary'>{status}</Badge>
  </a>
)

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
