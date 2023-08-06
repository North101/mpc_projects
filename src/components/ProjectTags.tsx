import Badge from "react-bootstrap/esm/Badge"
import Stack from "react-bootstrap/esm/Stack"


export const ProjectTag = ({ tag }: { tag: string }) => {
  return <a href={`/tag/${tag}`}><Badge pill bg="secondary">{tag}</Badge></a>
}

interface ProjectTagsProps {
  tags: string[]
}

export const ProjectTags = ({ tags }: ProjectTagsProps) => {
  return <Stack direction="horizontal" gap={1}>{tags.map(e => <ProjectTag key={e} tag={e} />)}</Stack>
}
