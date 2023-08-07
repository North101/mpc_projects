import React from "react";

import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";

export interface CheckboxState {
  id: string;
  label: string;
  checked: boolean;
}

interface CheckboxMenuProps {
  children: JSX.Element[];
  style: object;
  className: string;
  "aria-labelledby": string;
  onSelectNone?: () => void;
}

const CheckboxMenu = React.forwardRef<any, CheckboxMenuProps>(
  ({ children, style, className, "aria-labelledby": labeledBy, onSelectNone }, ref) => (
    <div
      ref={ref}
      style={style}
      className={`${className} checkbox-menu`}
      aria-labelledby={labeledBy}
    >
      <div
        className="d-flex flex-column"
        style={{ maxHeight: "calc(300px)", overflow: "none" }}
      >
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
  ),
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

export const CheckboxDropdown = ({ type, label, items, onChecked: handleChecked, onSelectNone: handleSelectNone }: CheckboxDropdown) => (
  <Dropdown>
    <Dropdown.Toggle variant="link">{label}</Dropdown.Toggle>

    <Dropdown.Menu
      as={CheckboxMenu}
      onSelectNone={handleSelectNone}
    >
      {items.map(i => (
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
