import { useQuery } from "@tanstack/react-query"
import Button from "react-bootstrap/esm/Button"
import Modal from "react-bootstrap/esm/Modal"
import Markdown from "react-markdown"
import { WebsiteProjects } from "../types"
import { CircularProgressIndicator } from "./CircularProgressIndicator"


interface ProjectChangelogProps {
  project: WebsiteProjects.Info
}

export const useChangelog = (project: WebsiteProjects.Info) => {
  return useQuery({
    queryKey: ['projects', project.changelog],
    queryFn: () => fetch(`/projects/${project.changelog}`).then((res) => res.text()),
    staleTime: Infinity,
  })
}

export const ProjectChangelog = ({ project }: ProjectChangelogProps) => {
  const { isLoading, data } = useChangelog(project);
  if (isLoading == undefined) {
    return <CircularProgressIndicator />
  }
  return <Markdown>{data}</Markdown>
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
