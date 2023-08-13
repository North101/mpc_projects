import React, { FormEventHandler, useEffect, useRef, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup'
import Dropdown from 'react-bootstrap/esm/Dropdown'
import Form from 'react-bootstrap/esm/Form'

type CheckboxType = 'checkbox' | 'radio'

export interface CheckboxState {
  id: string
  label: string
  checked: boolean
}

interface CheckboxMenuProps {
  children: JSX.Element[]
  style: object
  className: string
  type: CheckboxType
  search: string
  setSearch: (state: string) => void
  'aria-labelledby': string
  onSelectNone?: () => void
}

const CheckboxMenuRenderer = (
  {
    children,
    style,
    className,
    'aria-labelledby': labelledBy,
    onSelectNone,
    type,
    search,
    setSearch
  }: CheckboxMenuProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const innerRef = useRef<HTMLInputElement>(null)

  useEffect(() => innerRef.current?.focus())

  return (
    <div
      ref={ref}
      style={style}
      className={`${className} checkbox-menu`}
      aria-labelledby={labelledBy}
    >
      <div
        className='d-flex flex-column overflow-hidden'
        style={{ maxHeight: 300 }}
      >
        {type == 'checkbox' && <div className='border-bottom pb-2'>
          <Form className='d-flex py-0 px-2'>
            <Form.Control
              ref={innerRef}
              type='search'
              placeholder='Search'
              aria-label='Search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form>
        </div>}
        <ul className='list-unstyled flex-shrink mb-0 overflow-auto'>
          {children}
        </ul>
        {onSelectNone && <div className='dropdown-item border-top pt-2 pb-0'>
          <ButtonGroup size='sm'>
            <Button variant='link' onClick={onSelectNone}>
              Select None
            </Button>
          </ButtonGroup>
        </div>}
      </div>
    </div>
  )
}

const CheckboxMenu = React.forwardRef<HTMLDivElement, CheckboxMenuProps>(CheckboxMenuRenderer)

interface CheckDropdownItemProps {
  children: JSX.Element[]
  type: 'checkbox' | 'radio'
  id: string
  checked: boolean
  onChange: (id: string, event: React.FormEvent<HTMLInputElement>) => void
}

const CheckDropdownItemRenderer = (
  {
    type,
    children,
    id,
    checked,
    onChange,
  }: CheckDropdownItemProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) => (
  <Form.Group ref={ref} className='dropdown-item mb-0' controlId={id}>
    <Form.Check
      type={type}
      label={children}
      checked={checked}
      onChange={onChange.bind(onChange, id)}
    />
  </Form.Group>
)

const CheckDropdownItem = React.forwardRef<HTMLDivElement, CheckDropdownItemProps>(CheckDropdownItemRenderer)

interface CheckboxDropdown {
  type: CheckboxType
  label: string
  items: CheckboxState[]
  onChecked: (id: string, event: React.FormEvent<HTMLInputElement>) => void
  onSelectNone?: () => void
}

const sortChecked = (a: CheckboxState, b: CheckboxState) => a.checked == b.checked ? 0 : a.checked ? -1 : 1

const useItems = (type: CheckboxType, items: CheckboxState[]): {
  filteredItems: CheckboxState[],
  search: string,
  setSearch: (state: string) => void,
  setShown: (state: boolean) => void,
} => {
  const [shown, setShown] = useState(false)
  const [search, setSearch] = useState('')
  const [sortedItems, setSortedItems] = useState(items.toSorted(type == 'checkbox' ? sortChecked : undefined))
  const [filteredItems, setFilteredItems] = useState(sortedItems)

  // when shown, clear search snd sort checked to the top
  useEffect(() => {
    setSearch('')
    setSortedItems(items.toSorted(type == 'checkbox' ? sortChecked : undefined))
  }, [shown])

  // when items change, keep previous sorted position
  useEffect(() => {
    setSortedItems(prevState => items.toSorted((a, b) => {
      const aIndex = prevState.findIndex(e => e.id == a.id)
      const bIndex = prevState.findIndex(e => e.id == b.id)
      return aIndex - bIndex
    }))
  }, [items])

  // when searching or sorted items change, filter them
  useEffect(() => {
    setFilteredItems(sortedItems.filter(item => item.label.toLowerCase().includes(search)))
  }, [search, sortedItems])

  return {
    filteredItems,
    search,
    setSearch,
    setShown,
  }
}

export const CheckboxDropdown = ({ type, label, items, onChecked, onSelectNone }: CheckboxDropdown) => {
  const { filteredItems, search, setSearch, setShown } = useItems(type, items)
  return (
    <Dropdown onToggle={setShown}>
      <Dropdown.Toggle variant='link'>{label}</Dropdown.Toggle>
      <Dropdown.Menu
        as={CheckboxMenu}
        type={type}
        search={search}
        setSearch={setSearch}
        onSelectNone={onSelectNone}
      >
        {filteredItems.map(i => (
          <Dropdown.Item
            key={i.id}
            id={i.id}
            type={type}
            as={CheckDropdownItem}
            checked={i.checked}
            onChange={onChecked as unknown as FormEventHandler<HTMLElement>}
          >
            {i.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
