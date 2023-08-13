import { useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Nav from 'react-bootstrap/esm/Nav'
import Navbar from 'react-bootstrap/esm/Navbar'
import Stack from 'react-bootstrap/esm/Stack'
import { ProjectInfo } from '../types'
import { AppContainer } from './AppContainer'
import { CheckboxDropdown, CheckboxState } from './CheckboxDropdown'
import { ProjectList } from './ProjectList'

declare global {
  interface Array<T> {
    toSorted(compareFn?: ((a: T, b: T) => number) | undefined): Array<T>
    distinct(): Array<T>
  }
}

Array.prototype.toSorted = function <T>(compareFn?: ((a: T, b: T) => number) | undefined): Array<T> {
  const copy = [...this]
  copy.sort(compareFn)
  return copy
}

const distinct = function <T>(value: T, index: number, self: Array<T>) {
  return self.indexOf(value) == index
}

Array.prototype.distinct = function <T>(): Array<T> {
  return this.filter(distinct)
}

const sortByLabel = (a: CheckboxState, b: CheckboxState) => a.label == b.label ? 0 : a.label > b.label ? 1 : -1

const removeArticle = (value: string) => {
  const [article, ...rest] = value.split(' ')
  if (rest.length == 0) return value

  const articleL = article.toLowerCase()
  if (articleL == 'a' || articleL == 'the' || articleL == 'an') return rest.join(' ')

  return value
}

const sorts: {
  [key: string]: (a: ProjectInfo, b: ProjectInfo) => number
} = {
  'Alphabetical': (a: ProjectInfo, b: ProjectInfo) => a.name == b.name ? 0 : a.name > b.name ? 1 : -1,
  'Natural': (a: ProjectInfo, b: ProjectInfo) => {
    const aName = removeArticle(a.name)
    const bName = removeArticle(b.name)
    return aName == bName ? 0 : aName > bName ? 1 : -1
  },
  'Last Updated': (a: ProjectInfo, b: ProjectInfo) => a.updated == b.updated ? 0 : a.updated > b.updated ? -1 : 1,
  'Newest': (a: ProjectInfo, b: ProjectInfo) => a.created == b.created ? 0 : a.created > b.created ? 1 : -1,
  'Oldest': (a: ProjectInfo, b: ProjectInfo) => a.created == b.created ? 0 : a.created > b.created ? -1 : 1,
}

export const useSort = (): [string, (value: string) => void] => {
  const [sort, setSort] = useState(() => {
    const sort = localStorage.getItem('sort')
    if (!sort || !(sort in sorts)) return Object.keys(sorts)[0]

    return sort
  })

  useEffect(() => {
    localStorage.setItem('sort', sort)
  }, [sort])

  return [sort, setSort]
}

export const useAuthorFilter = (projects: ProjectInfo[]) => useState<CheckboxState[]>(projects.flatMap(e => e.authors)
  .distinct()
  .map(e => ({
    id: e,
    label: e,
    checked: false,
  }))
  .toSorted(sortByLabel))

export const useTagFilter = (projects: ProjectInfo[]) => useState<CheckboxState[]>(projects.flatMap(e => e.tags)
  .distinct()
  .map(e => ({
    id: e,
    label: e,
    checked: false,
  }))
  .toSorted(sortByLabel)
)

export const useSiteFilter = (projects: ProjectInfo[]) => useState<CheckboxState[]>(projects.flatMap(e => e.sites)
  .distinct()
  .map(e => ({
    id: e,
    label: e,
    checked: false,
  }))
  .toSorted(sortByLabel)
)

interface FilteredProjectListProps {
  projects: ProjectInfo[]
  sort: string
  setSort: (state: string) => void
  authorFilter: CheckboxState[]
  setAuthorFilter: (state: CheckboxState[]) => void
  tagFilter: CheckboxState[]
  setTagFilter: (state: CheckboxState[]) => void
  siteFilter: CheckboxState[]
  setSiteFilter: (state: CheckboxState[]) => void
}

export const FilteredProjectList = (props: FilteredProjectListProps) => {
  const {
    projects,
    sort,
    setSort,
    authorFilter,
    setAuthorFilter,
    tagFilter,
    setTagFilter,
    siteFilter,
    setSiteFilter,
  } = props

  const filteredAuthors = authorFilter.filter(e => e.checked).map(e => e.id)
  const filteredTags = tagFilter.filter(e => e.checked).map(e => e.id)
  const filteredSites = siteFilter.filter(e => e.checked).map(e => e.id)
  const filteredProjects = projects.filter(e => {
    const hasSomeAuthors = !filteredAuthors.length || e.authors.some(author => filteredAuthors.includes(author))
    const hasSomeTags = !filteredTags.length || e.tags.some(tag => filteredTags.includes(tag))
    const hasSomeSites = !filteredSites.length || e.sites.some(tag => filteredSites.includes(tag))
    return hasSomeAuthors && hasSomeTags && hasSomeSites
  }).toSorted(sorts[sort])

  return (
    <Stack gap={2}>
      <Navbar className='bg-body-tertiary' sticky='top'>
        <Container fluid>
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='flex-grow-1'>
              <CheckboxDropdown
                type='radio'
                label='Sort'
                items={Object.keys(sorts).map((e) => ({
                  id: e,
                  label: e,
                  checked: e == sort,
                }))}
                onChecked={(id: string) => setSort(id)}
              />
              <CheckboxDropdown
                type='checkbox'
                label='Authors'
                items={authorFilter}
                onChecked={(id: string, event: React.FormEvent<HTMLInputElement>) => setAuthorFilter(authorFilter.map(e => ({
                  ...e,
                  checked: e.id == id ? event.currentTarget.checked : e.checked,
                })))}
                onSelectNone={() => setAuthorFilter(authorFilter.map(e => ({
                  ...e,
                  checked: false,
                })))}
              />
              <CheckboxDropdown
                type='checkbox'
                label='Tags'
                items={tagFilter}
                onChecked={(id: string, event: React.FormEvent<HTMLInputElement>) => setTagFilter(tagFilter.map(e => ({
                  ...e,
                  checked: e.id == id ? event.currentTarget.checked : e.checked,
                })))}
                onSelectNone={() => setTagFilter(tagFilter.map(e => ({
                  ...e,
                  checked: false,
                })))}
              />
              <CheckboxDropdown
                type='checkbox'
                label='Sites'
                items={siteFilter}
                onChecked={(id: string, event: React.FormEvent<HTMLInputElement>) => setSiteFilter(siteFilter.map(e => ({
                  ...e,
                  checked: e.id == id ? event.currentTarget.checked : e.checked,
                })))}
                onSelectNone={() => setSiteFilter(siteFilter.map(e => ({
                  ...e,
                  checked: false,
                })))}
              />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ProjectList projects={filteredProjects} />
    </Stack>
  )
}

interface FilteredProjectListContainerProps {
  projects: ProjectInfo[]
}

export const FilteredProjectListContainer = ({ projects }: FilteredProjectListContainerProps) => {
  const [sort, setSort] = useSort()
  const [authorFilter, setAuthorFilter] = useAuthorFilter(projects)
  const [tagFilter, setTagFilter] = useTagFilter(projects)
  const [siteFilter, setSiteFilter] = useSiteFilter(projects)
  return (
    <AppContainer>
      <FilteredProjectList
        projects={projects}
        sort={sort}
        setSort={setSort}
        authorFilter={authorFilter}
        setAuthorFilter={setAuthorFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        siteFilter={siteFilter}
        setSiteFilter={setSiteFilter}
      />
    </AppContainer>
  )
}
