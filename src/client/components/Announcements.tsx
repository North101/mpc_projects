import { Dispatch, SetStateAction } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/esm/Container'

interface AlertProps {
  showAnnouncements: boolean
  setShowAnnouncements: Dispatch<SetStateAction<boolean>>
}
export const Announcements = ({ showAnnouncements = true, setShowAnnouncements }: AlertProps) => {

  if (showAnnouncements) {
    return (
      <Container>
        <Alert className='announcements' onClose={() => setShowAnnouncements(false)} dismissible>
          <h2>Announcements</h2>
        </Alert>
      </Container>
    )
  }
  return <Button onClick={() => setShowAnnouncements(true)}>Show Alert</Button>;
}
