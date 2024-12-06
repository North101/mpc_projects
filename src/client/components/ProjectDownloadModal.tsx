import { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/esm/Form'
import Modal from 'react-bootstrap/esm/Modal'
import { ExtensionProjects, WebsiteProjects } from '../types'

const downloadProject = async (project: WebsiteProjects.Info, checked: boolean[][], onClose: () => void) => {
  const r = await fetch(`/projects/${project.filename}`)
  const file: WebsiteProjects.Data = await r.json()
  const download: ExtensionProjects.Latest.Project = {
    version: 3,
    parts: file.options.flatMap((option, optionIndex) => {
      return option.parts.filter((_, partIndex) => checked[optionIndex][partIndex]).map(part => ({
        code: part.code,
        name: option.name ? `${option.name} - ${part.name}` : part.name,
        cards: part.cards,
      }))
    }),
  }

  if (window.showSaveFilePicker) {
    const handle = await window.showSaveFilePicker({
      suggestedName: project.filename,
      types: [
        {
          description: 'Project file',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    })
    const writable = await handle.createWritable()
    await writable.write(JSON.stringify(download))
    await writable.close()
  } else {
    const blob = new Blob([JSON.stringify(download)], { type: 'application/json' })
    const element = document.createElement('a')
    const url = URL.createObjectURL(blob)
    document.body.appendChild(element)
    element.href = url
    element.download = project.filename
    element.click()
    element.remove()
    URL.revokeObjectURL(url)
  }

  onClose()
}

interface PartsHeaderProps {
  name: string
  index: number
  checked: boolean[]
  setChecked: React.Dispatch<React.SetStateAction<boolean[][]>>
}

const PartsHeader = ({ index, name, checked, setChecked }: PartsHeaderProps) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.currentTarget.checked
    setChecked(prevState => prevState.map((v, i) => {
      return index == i ? v.map(() => {
        return checked
      }) : v
    }))
  }
  return <Form.Check
    type='checkbox'
    label={<h5>{name}</h5>}
    checked={checked.every((value) => value == true)}
    onChange={(e) => onChange(e)}
  />
}

interface ProjectDownloadModalProps {
  project: WebsiteProjects.Info
  onClose: () => void
}

export const ProjectDownloadModal = ({ project, onClose }: ProjectDownloadModalProps) => {
  const [checked, setChecked] = useState(project.options.map((e) => e.parts.map(e => e.enabled)))
  const anyChecked = checked.some(e => e)
  const onDownload = () => downloadProject(
    project,
    checked,
    onClose,
  )

  const onChange = (event: React.ChangeEvent<HTMLInputElement>, optionIndex: number, partIndex: number) => {
    const checked = event.currentTarget.checked
    setChecked(prevState => prevState.map((v, i) => {
      return optionIndex == i ? v.map((v, j) => {
        return partIndex == j ? checked : v
      }) : v
    }))
  }

  return (
    <Modal show centered scrollable
      onHide={onClose}
      dialogClassName='download-options'
    >
      <Modal.Header closeButton>
        <Modal.Title>{project.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {project.options.map(({ name, parts }, optionIndex) => (
          <div key={optionIndex}>
            {name && <PartsHeader
              index={optionIndex}
              name={name}
              checked={checked[optionIndex]}
              setChecked={setChecked}
            />}
            <div style={{ marginLeft: name ? 16 : 0 }}>
              {parts.map((e, partIndex) => <Form.Check
                key={partIndex}
                type='checkbox'
                label={`${e.name} (${e.count})`}
                checked={checked[optionIndex][partIndex]}
                onChange={(e) => onChange(e, optionIndex, partIndex)}
              />)}
            </div>
            <br />
          </div>
        ))}
      </Modal.Body>

      <Modal.Footer>
        <Form.Check
          style={{ flex: 1 }}
          type='checkbox'
          label='Select All'
          checked={checked.every((e) => e.every((e) => e == true))}
          onChange={(e) => {
            const checked = e.currentTarget.checked;
            setChecked(prevState => prevState.map((v) => {
              return v.map(() => checked)
            }))
          }}
        />
        <Button
          variant='secondary'
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          variant='primary'
          onClick={onDownload}
          disabled={!anyChecked}
        >
          Download
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
