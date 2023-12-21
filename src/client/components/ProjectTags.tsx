import { useContext } from 'react'
import Badge from 'react-bootstrap/esm/Badge'
import Button from 'react-bootstrap/esm/Button'
import Stack from 'react-bootstrap/esm/Stack'
import { FilterContext } from './FilteredProjectList'


export const ProjectTag = ({ tag }: { tag: string }) => {
  const { tagFilter, setTagFilter } = useContext(FilterContext)
  const onClick = () => setTagFilter(tagFilter.map((v) => {
    if (tag == v.label) {
      return {
        ...v,
        checked: true,
      }
    }
    return v
  }))
  return (
    <Button variant='link' className='p-0 m-0' onClick={onClick}>
      <Badge pill bg='secondary'>{tag}</Badge>
    </Button>
  )
}

interface ProjectTagsProps {
  tags: string[]
}

export const ProjectTags = ({ tags }: ProjectTagsProps) => (
  <Stack direction='horizontal' gap={1} className='tag-pills'>
    {tags.map(e =>
      <ProjectTag key={e} tag={e} />
    )}
  </Stack>
)
