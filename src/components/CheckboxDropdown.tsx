import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import Dropdown from "react-bootstrap/esm/Dropdown";
import Form from "react-bootstrap/esm/Form";

export interface CheckboxState {
  id: string;
  label: string;
  checked: boolean;
}

interface CheckboxMenuProps {
  children: JSX.Element[];
  style: object;
  className: string;
  search: string;
  setSearch: (state: string) => void;
  "aria-labelledby": string;
  onSelectNone?: () => void;
}

const CheckboxMenu = React.forwardRef<any, CheckboxMenuProps>(
  ({ children, style, className, "aria-labelledby": labelledBy, onSelectNone, search, setSearch }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null);
    useEffect(() => innerRef.current?.focus());

    return (
      <div
        ref={ref}
        style={style}
        className={`${className} checkbox-menu`}
        aria-labelledby={labelledBy}
      >
        <div
          className="d-flex flex-column"
          style={{ maxHeight: "calc(300px)", overflow: "none" }}
        >
          <div className="border-bottom" style={{ paddingBottom: 8 }}>
            <Form className="d-flex" style={{ padding: "0 8px" }}>
              <Form.Control
                ref={innerRef}
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form>
          </div>
          <ul
            className="list-unstyled flex-shrink mb-0"
            style={{ overflow: "auto" }}
          >
            {children}
          </ul>
          {onSelectNone && <div className="dropdown-item border-top pt-2 pb-0">
            <ButtonGroup size="sm">
              <Button variant="link" onClick={onSelectNone}>
                Select None
              </Button>
            </ButtonGroup>
          </div>}
        </div>
      </div>
    );
  },
);

interface CheckDropdownItemProps {
  children: JSX.Element[];
  type: "checkbox" | "radio";
  id: string;
  checked: boolean;
  onChange: (id: string, event: React.FormEvent<HTMLInputElement>) => void;
}

const CheckDropdownItem = React.forwardRef<any, CheckDropdownItemProps>(
  ({ type, children, id, checked, onChange }, ref) => (
    <Form.Group ref={ref} className="dropdown-item mb-0" controlId={id}>
      <Form.Check
        type={type}
        label={children}
        checked={checked}
        onChange={onChange && onChange.bind(onChange, id)}
      />
    </Form.Group>
  ),
);

interface CheckboxDropdown {
  type: "checkbox" | "radio";
  label: string;
  items: CheckboxState[];
  onChecked: (id: string, event: React.FormEvent<HTMLInputElement>) => void;
  onSelectNone?: () => void;
}

const useItems = (items: CheckboxState[]): [CheckboxState[], string, (state: string) => void] => {
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(items.filter(item => item.label.toLowerCase().includes(search)));
  }, [items, search]);

  return [filteredItems, search, setSearch];
}

export const CheckboxDropdown = ({ type, label, items, onChecked: handleChecked, onSelectNone: handleSelectNone }: CheckboxDropdown) => {
  const [filteredItems, search, setSearch] = useItems(items);
  return (
    <Dropdown onToggle={() => setSearch("")}>
      <Dropdown.Toggle variant="link">{label}</Dropdown.Toggle>
      <Dropdown.Menu
        as={CheckboxMenu}
        onSelectNone={handleSelectNone}
        search={search}
        setSearch={setSearch}
      >
        {filteredItems.map(i => (
          <Dropdown.Item
            key={i.id}
            id={i.id}
            type={type}
            as={CheckDropdownItem}
            checked={i.checked}
            onChange={handleChecked as any}
          >
            {i.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
