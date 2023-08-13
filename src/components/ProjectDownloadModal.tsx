import { useState } from "react"
import Button from "react-bootstrap/esm/Button"
import Form from "react-bootstrap/esm/Form"
import Modal from "react-bootstrap/esm/Modal"
import { ProjectDownload, ProjectInfo } from "../types"

const downloadProject = async (project: ProjectInfo, checked: boolean[], handleClose: () => void) => {
  const r = await fetch(`/projects/${project.filename}`)
  const file: ProjectDownload = await r.json()
  const download = {
    version: 2,
    code: file.code,
    parts: file.parts.filter((_, index) => checked[index]),
  }

  const handle = await window.showSaveFilePicker({
    suggestedName: project.filename,
    types: [
      {
        description: "Project file",
        accept: {
          "application/json": [".json"],
        },
      },
    ],
  })
  const writable = await handle.createWritable()
  await writable.write(JSON.stringify(download))
  await writable.close()

  handleClose()
}

interface ProjectDownloadModalProps {
  project: ProjectInfo
  handleClose: () => void
}

export const ProjectDownloadModal = ({ project, handleClose }: ProjectDownloadModalProps) => {
  const [checked, setChecked] = useState(project.parts.map(() => true))
  const anyChecked = checked.some(e => e)
  const handleDownload = () => downloadProject(
    project,
    checked,
    handleClose,
  )

  return (
    <Modal show centered scrollable onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{project.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {project.parts.map((e, index) => <Form.Check
          key={index}
          type="checkbox"
          label={`${e.name} (${e.count})`}
          checked={checked[index]}
          onChange={(e) => setChecked(checked.map((v, i) => {
            return index == i ? e.currentTarget.checked : v
          }))}
        />)}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleDownload} disabled={!anyChecked}>Download</Button>
      </Modal.Footer>
    </Modal>
  )
}
