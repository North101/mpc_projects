import Button from 'react-bootstrap/esm/Button'
import { FilterContext } from './FilteredProjectList'
import { useContext } from 'react'

interface ProjectAuthorsProps {
  authors: string[]
}

export const ProjectAuthors = ({ authors }: ProjectAuthorsProps) => {
  const { authorFilter, setAuthorFilter } = useContext(FilterContext)
  const onClick = () => {
    setAuthorFilter(authorFilter.map((v) => {
      if (authors.includes(v.label)) {
        return {
          ...v,
          checked: true,
        }
      }
      return v
    }))
  }
  return (
    <>
      {authors.map((e, i) => <span key={i}>
        {i > 0 && ', '}
        <Button className='p-0' variant='link' onClick={onClick}>{e}</Button>
      </span>)}
    </>
  )
}
