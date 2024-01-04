import ISO6391 from 'iso-639-1'
import { useContext } from 'react'
import Badge from 'react-bootstrap/esm/Badge'
import Button from 'react-bootstrap/esm/Button'
import Stack from 'react-bootstrap/esm/Stack'
import { FilterContext } from './FilteredProjectList'


const stringToClass = (rawString: string): string => {
  let langClass = rawString.replace(/[\s~]/g, '-')
  langClass = langClass.replace(/[!"#$%&'()*+,./:<=>?@[\\\]^`{|}]/g, '')
  return langClass.toLowerCase()
}

const ProjectLang = ({ lang }: { lang: string }) => {
  const { langFilter, setLangFilter } = useContext(FilterContext)
  const onClick = () => setLangFilter(langFilter.map((v) => {
    if (lang == v.label) {
      return {
        ...v,
        checked: true,
      }
    }
    return v
  }))
  return (
    <Button variant='link' className={`p-0 m-0 lang lang-${stringToClass(lang)}`} onClick={onClick}>
      <Badge pill bg='secondary'>{ISO6391.getNativeName(lang)}</Badge>
    </Button>
  )
}

interface ProjectLangProps {
  lang: string
}

export const ProjectLangs = ({ lang }: ProjectLangProps) => (
  <Stack direction='horizontal' gap={1} className='lang-pills'>
    {<ProjectLang lang={lang} />}
  </Stack>
)
