import { useContext } from 'react'
import Button from 'react-bootstrap/esm/Button'
import { FilterContext } from './FilteredProjectList'

const ProjectAuthor = ({ author }: { author: string }) => {
  const { authorFilter, setAuthorFilter } = useContext(FilterContext)
  const onClick = () => setAuthorFilter(authorFilter.map((v) => {
    if (author == v.label) {
      return {
        ...v,
        checked: true,
      }
    }
    return v
  }))
  return (
    <Button className='p-0 m-0' variant='link' onClick={onClick}>
      {author}
    </Button>
  )
}

interface ProjectAuthorsProps {
  authors: string[]
}

export const ProjectAuthors = ({ authors }: ProjectAuthorsProps) => (
  <>
    {authors.map((e, i) => <span key={i}>
      {i > 0 && ', '}
      <ProjectAuthor key={i} author={e} />
    </span>)}
  </>
)
