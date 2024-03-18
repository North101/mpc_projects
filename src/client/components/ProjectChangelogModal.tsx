import { useEffect, useState } from "react"
import Button from "react-bootstrap/esm/Button"
import Modal from "react-bootstrap/esm/Modal"
import { WebsiteProjects } from "../types"
import { CircularProgressIndicator } from "./CircularProgressIndicator"
import Markdown from "react-markdown"


interface ProjectChangelogProps {
  project: WebsiteProjects.Info
}

export const useChangelog = (project: WebsiteProjects.Info) => {
  const [data, setData] = useState<string | undefined>()

  useEffect(() => {
    if (!project.changelog) return setData('')
    fetch(`/projects/${project.changelog}`).then(async (r) => setData(await r.text()))
  }, [])

  return data
}

export const ProjectChangelog = ({ project }: ProjectChangelogProps) => {
  const changelog = useChangelog(project);
  if (changelog == undefined) {
    return <CircularProgressIndicator />
  }
  return <Markdown>{changelog}</Markdown>
}


interface ProjectChangelogModalProps {
  project: WebsiteProjects.Info
  onClose: () => void
}

export const ProjectChangelogModal = ({ project, onClose }: ProjectChangelogModalProps) => {
  return (
    <Modal show centered scrollable
      onHide={onClose}
      dialogClassName='download-options'
    >
      <Modal.Header closeButton>
        <Modal.Title>{project.name} Changelog</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p><em>If you printed this project before a change date listed below, you may wish to (re)print the affected card(s).</em></p>
        <ProjectChangelog project={project} />
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={onClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
