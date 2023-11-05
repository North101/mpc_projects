import { useContext } from 'react'
import Badge from 'react-bootstrap/esm/Badge'
import Stack from 'react-bootstrap/esm/Stack'
import { FilterContext } from './FilteredProjectList'


export const ProjectTag = ({ tag }: { tag: string }) => {
  const { tagFilter, setTagFilter } = useContext(FilterContext)
  const onClick = () => {
    setTagFilter(tagFilter.map((v) => {
      if (tag == v.label) {
        return {
          ...v,
          checked: true,
        }
      }
      return v
    }))
  }
  return (
    <a href='javascript:void(0)' onClick={onClick}>
      <Badge pill bg='secondary'>{tag}</Badge>
    </a>
  )
}

interface ProjectTagsProps {
  tags: string[]
}

export const ProjectTags = ({ tags }: ProjectTagsProps) => (
  <Stack direction='horizontal' gap={1}>
    {tags.map(e =>
      <ProjectTag key={e} tag={e} />
    )}
  </Stack>
)
