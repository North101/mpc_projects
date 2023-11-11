import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import { CheckSquare, CheckSquareFill, Funnel, FunnelFill, GeoAlt, GeoAltFill, Person, PersonFill, SortDown, Tag, TagFill } from 'react-bootstrap-icons'
import Container from 'react-bootstrap/esm/Container'
import Nav from 'react-bootstrap/esm/Nav'
import Navbar from 'react-bootstrap/esm/Navbar'
import Stack from 'react-bootstrap/esm/Stack'
import { ProjectInfo } from '../types'
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
  'Natural': (a: ProjectInfo, b: ProjectInfo) => {
    const aName = removeArticle(a.name)
    const bName = removeArticle(b.name)
    return aName == bName ? 0 : aName > bName ? 1 : -1
  },
  'Alphabetical': (a: ProjectInfo, b: ProjectInfo) => a.name == b.name ? 0 : a.name > b.name ? 1 : -1,
  'Last Updated': (a: ProjectInfo, b: ProjectInfo) => a.updated == b.updated ? 0 : a.updated > b.updated ? -1 : 1,
  'Newest': (a: ProjectInfo, b: ProjectInfo) => a.created == b.created ? 0 : a.created > b.created ? -1 : 1,
  'Oldest': (a: ProjectInfo, b: ProjectInfo) => a.created == b.created ? 0 : a.created > b.created ? 1 : -1,
}

export const useSort = (): [string, Dispatch<SetStateAction<string>>] => {
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
  .toSorted(sortByLabel)
)

export const useTagFilter = (projects: ProjectInfo[]) => useState<CheckboxState[]>(projects.flatMap(e => e.tags)
  .distinct()
  .map(e => ({
    id: e,
    label: e,
    checked: false,
  }))
  .toSorted(sortByLabel)
)

export const useStatusFilter = (projects: ProjectInfo[]) => useState<CheckboxState[]>(projects.flatMap(e => e.statuses)
  .distinct()
  .map(e => ({
    id: e,
    label: e,
    checked: false,
  }))
  .toSorted(sortByLabel)
)

export const useLangFilter = (projects: ProjectInfo[]) => useState<CheckboxState[]>(projects.map(e => e.lang)
  .filter((e): e is string => e != null)
  .distinct()
  .map(e => ({
    id: e,
    label: e,
    checked: false,
  }))
  .toSorted(sortByLabel)
)

{/*export const useSiteFilter = (projects: ProjectInfo[]) => useState<CheckboxState[]>(projects.flatMap(e => Object.values(e.sites))
  .distinct()
  .map(e => ({
    id: e,
    label: e,
    checked: false,
  }))
  .toSorted(sortByLabel)
)*/}

export const FilterContext = createContext<{
  sort: string,
  setSort: Dispatch<SetStateAction<string>>,
  authorFilter: CheckboxState[],
  setAuthorFilter: (state: CheckboxState[]) => void,
  tagFilter: CheckboxState[],
  setTagFilter: (state: CheckboxState[]) => void,
  statusFilter: CheckboxState[],
  setStatusFilter: (state: CheckboxState[]) => void,
  langFilter: CheckboxState[],
  setLangFilter: (state: CheckboxState[]) => void,
}>({
  sort: '',
  setSort: () => { throw Error() },
  authorFilter: [],
  setAuthorFilter: () => { throw Error() },
  tagFilter: [],
  setTagFilter: () => { throw Error() },
  statusFilter: [],
  setStatusFilter: () => { throw Error() },
  langFilter: [],
  setLangFilter: () => { throw Error() },
})

interface FilteredProjectListProps {
  projects: ProjectInfo[]
}

export const FilteredProjectList = (props: FilteredProjectListProps) => {
  const {
    projects,
  } = props

  const {
    sort,
    setSort,
    authorFilter,
    setAuthorFilter,
    tagFilter,
    setTagFilter,
    statusFilter,
    setStatusFilter,
    langFilter,
    setLangFilter,
    //siteFilter,
    //setSiteFilter,
  } = useContext(FilterContext)

  const filteredAuthors = authorFilter.filter(e => e.checked).map(e => e.id)
  const filteredTags = tagFilter.filter(e => e.checked).map(e => e.id)
  const filteredStatuses = statusFilter.filter(e => e.checked).map(e => e.id)
  const filteredLangs = langFilter.filter(e => e.checked).map(e => e.id)
  {/*const filteredSites = siteFilter.filter(e => e.checked).map(e => e.id)*/ }
  const filteredProjects = projects.filter(e => {
    const hasSomeAuthors = !filteredAuthors.length || e.authors.some(author => filteredAuthors.includes(author))
    const hasSomeTags = !filteredTags.length || e.tags.some(tag => filteredTags.includes(tag))
    const hasSomeStatuses = !filteredStatuses.length || e.statuses.some(status => filteredStatuses.includes(status))
    const hasSomeLangs = !filteredLangs.length || e.lang == null || filteredLangs.includes(e.lang)
    {/*const hasSomeSites = !filteredSites.length || Object.values(e.sites).some(site => filteredSites.includes(site))*/ }
    return hasSomeAuthors && hasSomeStatuses && hasSomeTags && hasSomeLangs
  }).toSorted(sorts[sort])
  const hasFilteredAuthors = filteredAuthors.length > 0
  const hasFilteredTags = filteredTags.length > 0
  const hasFilteredStatuses = filteredStatuses.length > 0
  const hasFilteredLangs = filteredLangs.length > 0
  const hasFilters = hasFilteredAuthors || hasFilteredTags || hasFilteredStatuses || hasFilteredLangs

  const onAuthorChecked = (id: string, event: React.FormEvent<HTMLInputElement>) => {
    setAuthorFilter(authorFilter.map(e => ({
      ...e,
      checked: e.id == id ? event.currentTarget.checked : e.checked,
    })))
  }

  const onAuthorSelectNone = () => {
    setAuthorFilter(authorFilter.map(e => ({
      ...e,
      checked: false,
    })))
  }

  const onTagChecked = (id: string, event: React.FormEvent<HTMLInputElement>) => {
    setTagFilter(tagFilter.map(e => ({
      ...e,
      checked: e.id == id ? event.currentTarget.checked : e.checked,
    })))
  }

  const onTagSelectNone = () => {
    setTagFilter(tagFilter.map(e => ({
      ...e,
      checked: false,
    })))
  }

  const onStatusChecked = (id: string, event: React.FormEvent<HTMLInputElement>) => {
    setStatusFilter(statusFilter.map(e => ({
      ...e,
      checked: e.id == id ? event.currentTarget.checked : e.checked,
    })))
  }

  const onStatusSelectNone = () => {
    setStatusFilter(statusFilter.map(e => ({
      ...e,
      checked: false,
    })))
  }

  const onLangChecked = (id: string, event: React.FormEvent<HTMLInputElement>) => {
    setLangFilter(langFilter.map(e => ({
      ...e,
      checked: e.id == id ? event.currentTarget.checked : e.checked,
    })))
  }

  const onLangSelectNone = () => {
    setLangFilter(langFilter.map(e => ({
      ...e,
      checked: false,
    })))
  }

  {/*
  const onSiteChecked = (id: string, event: React.FormEvent<HTMLInputElement>) => {
    setSiteFilter(siteFilter.map(e => ({
      ...e,
      checked: e.id == id ? event.currentTarget.checked : e.checked,
    })))
  }

  const onSiteSelectNone = () => setSiteFilter(siteFilter.map(e => ({
    ...e,
    checked: false,
  })))
  */}

  const onSetSort = (id: string) => setSort(id)

  return (
    <Stack gap={2}>
      <Navbar
        className='filters bg-body-tertiary'
        sticky='top'
        expand='md'
        id='filters'
      >
        <Container fluid>
          <Navbar.Brand className='d-md-none d-lg-none'>Sort & Filter</Navbar.Brand>
          <Navbar.Toggle
            aria-controls='responsive-navbar-nav'
            label='Toggle filters'>
            {hasFilters ? <FunnelFill /> : <Funnel />}
          </Navbar.Toggle>
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='d-flex'>
              <Nav.Item className='d-flex'>
                <SortDown
                  className='icon'
                  style={{ margin: '9px 0' }}
                  width='20'
                  height='20'
                />
                <CheckboxDropdown
                  type='radio'
                  label='Sort'
                  items={Object.keys(sorts).map((e) => ({
                    id: e,
                    label: e,
                    checked: e == sort,
                  }))}
                  onChecked={onSetSort}
                />
              </Nav.Item>
              <Nav.Item className='d-flex'>
                {hasFilteredAuthors ? <PersonFill
                  className='icon'
                  style={{ margin: '9px 0' }}
                  width='20'
                  height='20' /> : <Person
                  className='icon'
                  style={{ margin: '9px 0' }}
                  width='20'
                  height='20' />}
                <CheckboxDropdown
                  type='checkbox'
                  label='Authors'
                  items={authorFilter}
                  onChecked={onAuthorChecked}
                  onSelectNone={onAuthorSelectNone}
                />
              </Nav.Item>
              <Nav.Item className='d-flex'>
                {hasFilteredTags ? <TagFill
                  className='icon'
                  style={{ margin: '9px 0' }}
                  width='20'
                  height='20' /> : <Tag
                  className='icon'
                  style={{ margin: '9px 0' }}
                  width='20'
                  height='20' />}
                <CheckboxDropdown
                  type='checkbox'
                  label='Tags'
                  items={tagFilter}
                  onChecked={onTagChecked}
                  onSelectNone={onTagSelectNone}
                />
              </Nav.Item>
              <Nav.Item className='d-flex'>
                {hasFilteredStatuses ? <CheckSquareFill
                  className='icon'
                  style={{ margin: '9px 0' }}
                  width='20'
                  height='20' /> : <CheckSquare
                  className='icon'
                  style={{ margin: '9px 0' }}
                  width='20'
                  height='20' />}
                <CheckboxDropdown
                  type='checkbox'
                  label='Status'
                  items={statusFilter}
                  onChecked={onStatusChecked}
                  onSelectNone={onStatusSelectNone}
                //align={{ sm: 'start' }} @TODO this needs to be on the button, not the dropdown menu, help
                />
              </Nav.Item>
              <Nav.Item className='d-flex'>
                {hasFilteredLangs ? <GeoAltFill
                  className='icon'
                  style={{ margin: '9px 0' }}
                  width='20'
                  height='20' /> : <GeoAlt
                  className='icon'
                  style={{ margin: '9px 0' }}
                  width='20'
                  height='20' />}
                <CheckboxDropdown
                  type='checkbox'
                  label='Languages'
                  items={langFilter}
                  onChecked={onLangChecked}
                  onSelectNone={onLangSelectNone}
                //align={{ sm: 'start' }} @TODO this needs to be on the button, not the dropdown menu, help
                />
              </Nav.Item>
              {/*
                <CheckboxDropdown
                  type='checkbox'
                  label='Sites'
                  items={siteFilter}
                  onChecked={onSiteChecked}
                  onSelectNone={onSiteSelectNone}
                />
                */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar >

      <ProjectList projects={filteredProjects} />
    </Stack >
  )
}

interface FilteredProjectListContainerProps {
  projects: ProjectInfo[]
}

export const FilteredProjectListContainer = ({ projects }: FilteredProjectListContainerProps) => {
  const [sort, setSort] = useSort()
  const [authorFilter, setAuthorFilter] = useAuthorFilter(projects)
  const [tagFilter, setTagFilter] = useTagFilter(projects)
  const [statusFilter, setStatusFilter] = useStatusFilter(projects)
  const [langFilter, setLangFilter] = useLangFilter(projects)
  {/*}const [siteFilter, setSiteFilter] = useSiteFilter(projects)*/ }
  return (
    <FilterContext.Provider value={{
      sort,
      setSort,
      authorFilter,
      setAuthorFilter,
      tagFilter,
      setTagFilter,
      statusFilter,
      setStatusFilter,
      langFilter,
      setLangFilter,
      //siteFilter
      //setSiteFilter
    }}>
      <FilteredProjectList
        projects={projects}
      />
    </FilterContext.Provider>
  )
}
