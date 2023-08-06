import Button from "react-bootstrap/esm/Button"

interface ProjectAuthorsProps {
  authors: string[];
}

export const ProjectAuthors = ({ authors }: ProjectAuthorsProps) => {
  return <>
    {authors.map((e, i) => <span key={i}>
      {i > 0 && ", "}
      <Button style={{ padding: 0 }} variant='link' href={`/author/${e}`}>{e}</Button>
    </span>)}
  </>
}
