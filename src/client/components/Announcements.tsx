import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

function Announcements() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant='info' className='announcements' onClose={() => setShow(false)} dismissible>
        <h2>Announcements</h2>
      </Alert>
    )
  }
  return <Button onClick={() => setShow(true)}>Show Alert</Button>;
}


export default Announcements
