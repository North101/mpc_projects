import { ChangeEvent, createContext, useContext, useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/esm/Form'
import useLocation from 'wouter/use-location'

export const IntroContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([
  false,
  () => {
    throw Error()
  }
])

const initIntro = () => {
  const saved = localStorage.getItem('hideIntro')
  const isHidden = saved !== null ? JSON.parse(saved) : false;
  return !isHidden;
}

export const useIntro = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [location, _setLocation] = useLocation()
  const [show, setShow] = useState(initIntro() && location == '/')
  return [show, setShow]
}

const IntroHide = () => {
  const [show, setChecked] = useState(initIntro)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setChecked(!e.currentTarget.checked)

  useEffect(() => {
    localStorage.setItem('hideIntro', JSON.stringify(!show))
  }, [show])

  return (
    <Form>
      <Form.Check
        type='checkbox'
        label='Don’t show again'
        checked={!show}
        onChange={onChange}
      />
    </Form>
  )
}

export const Intro = () => {
  const [show, setShow] = useContext(IntroContext)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Modal className='intro' show={show} onHide={handleClose} onShow={handleShow}>
      <img className='intro-bg d-none d-lg-block' src='/assets/images/act-1.png' alt='An Arkham Horror Act card with the art from the TCU card Fate of All Fools by Brian Valenzuela, showing a red-robed cultist holding a curved knife to the throat of a limp man.' />
      <Modal.Header closeButton />
      <Modal.Body>
        <p>
          <strong>Arkham Horror: The Card Game</strong>. It seemed so innocuous when it caught your eye. “Perhaps I’ll buy the core set,” you thought. “Maybe an expansion or two; that will be plenty.”
        </p>
        <p>
          But in the blink of an eye, you gaze upon a room piled high with expansions, playmats, and custom tokens.
        </p>
        <p>
          Somehow it’s not enough. You have them all now, every scrap of official content, and still that gnawing, aching hunger curdles your stomach. Your collection mocks you in its infinite finitude.
        </p>
        <p>
          You know what it is you desperately need. Professionally printed copies of all the Arkham Horror community’s home-brewed content and every single FFG card available for print &amp; play. Surely that will sate you. Surely that will be enough.&hellip; Won’t it?</p>
        <p>
          There’s only one way to find out. It’s time to accept your{" "}
          <strong>Inexorable Fate</strong>.
        </p>
        <div className='arkham-choice'>
          <p>
            <em>If “the investigators are uninitiated,”</em> proceed to{" "}
            <a href="/help" title="Instruct me.">Intro&nbsp;1</a>.
          </p>
          <p>
            <em>If “you reject your fate,”</em> proceed to{" "}
            <a href="/help#why" title="Why all this?">Intro&nbsp;2</a>.
          </p>
          <p>
            <em>If “you have been here before,”</em> proceed to{" "}
            <a href="#filters" title="Find projects!" onClick={handleClose}>Intro&nbsp;3</a>.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <IntroHide />
      </Modal.Footer>
    </Modal>
  )
}
