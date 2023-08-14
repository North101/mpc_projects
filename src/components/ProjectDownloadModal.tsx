import { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/esm/Form'
import Modal from 'react-bootstrap/esm/Modal'
import { ProjectV2, ProjectInfo } from '../types'

const downloadProject = async (project: ProjectInfo, checked: boolean[], onClose: () => void) => {
  const r = await fetch(`/projects/${project.filename}`)
  const file: ProjectV2 = await r.json()
  const download: ProjectV2 = {
    ...file,
    parts: file.parts.filter((_, index) => checked[index]),
  }

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

  onClose()
}

interface ProjectDownloadModalProps {
  project: ProjectInfo
  onClose: () => void
}

export const ProjectDownloadModal = ({ project, onClose }: ProjectDownloadModalProps) => {
  const [checked, setChecked] = useState(project.parts.map((e) => e.enabled))
  const anyChecked = checked.some(e => e)
  const onDownload = () => downloadProject(
    project,
    checked,
    onClose,
  )

  const onChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const checked = event.currentTarget.checked
    setChecked(prevState => prevState.map((v, i) => {
      return index == i ? checked : v
    }))
  }

  return (
    <Modal show centered scrollable onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{project.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {project.parts.map((e, index) => <Form.Check
          key={index}
          type='checkbox'
          label={`${e.name} (${e.count})`}
          checked={checked[index]}
          onChange={(e) => onChange(e, index)}
        />)}
      </Modal.Body>

      <Modal.Footer>
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
