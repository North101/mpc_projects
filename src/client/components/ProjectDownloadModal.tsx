import { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/esm/Form'
import Modal from 'react-bootstrap/esm/Modal'
import { ExtensionProjects, WebsiteProjects } from '../types'

const downloadProject = async (project: WebsiteProjects.Info, checked: boolean[][], onClose: () => void) => {
  const r = await fetch(`/projects/${project.filename}`)
  const file: WebsiteProjects.Data = await r.json()
  const download: ExtensionProjects.Latest.Project = {
    ...file,
    version: 3,
    parts: file.options.flatMap((option, optionIndex) => {
      return option.parts.filter((_, partIndex) => checked[optionIndex][partIndex]).map(part => ({
        code: part.code,
        name: `${option.name} - ${part.name}`,
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
        return partIndex == j ? checked : v;
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
            <h5>{name}</h5>
            {parts.map((e, partIndex) => <Form.Check
              key={partIndex}
              type='checkbox'
              label={`${e.name} (${e.count})`}
              checked={checked[optionIndex][partIndex]}
              onChange={(e) => onChange(e, optionIndex, partIndex)}
            />)}
            <br />
          </div>
        ))}
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
