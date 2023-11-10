import { ChangeEvent, createContext, useContext, useEffect, useState } from 'react'
import Form from 'react-bootstrap/esm/Form'
import { AppContainerIntro } from './AppContainer'

const introKey = 'intro'

export const IntroContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([
  false,
  () => { throw Error() },
])

const initIntro = () => {
  const value = localStorage.getItem(introKey)
  const showIntro = value !== null ? JSON.parse(value) : true
  return showIntro
}

export const useIntro = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [intro, setIntro] = useState(initIntro)
  useEffect(() => {
    localStorage.setItem(introKey, JSON.stringify(intro))
  }, [intro])
  return [intro, setIntro]
}

const IntroHide = () => {
  const [intro, setIntro] = useContext(IntroContext)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setIntro(!e.currentTarget.checked)

  return (
    <Form>
      <Form.Check
        type='checkbox'
        label='Don’t show again'
        checked={!intro}
        onChange={onChange}
      />
    </Form>
  )
}

export const IntroPage = () => {
  return (
    <AppContainerIntro>
      <div className='intro w-100 h-100 m-auto d-flex flex-column align-items-stretch'>
        <img className='intro-bg d-none d-md-block' src='/assets/images/act-1.png' alt='An Arkham Horror Act card with the art from the TCU card Fate of All Fools by Brian Valenzuela, showing a red-robed cultist holding a curved knife to the throat of a limp man.' />
        <div className='intro-content h-100 d-flex flex-column justify-content-between'>
          <div className='intro-body'>
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
              There’s only one way to find out. It’s time to accept your{' '}
              <strong>Inexorable Fate</strong>.
            </p>
            <div className='arkham-choice'>
              <p>
                <em>If “the investigators are uninitiated,”</em> proceed to{' '}
                <a href='/help' title='Instruct me.'>Intro&nbsp;1</a>.
              </p>
              <p>
                <em>If “you reject your fate,”</em> proceed to{' '}
                <a href='/help#why' title='Why all this?'>Intro&nbsp;2</a>.
              </p>
              <p>
                <em>If “you have been here before,”</em> proceed to{' '}
                <a href='/projects' title='Find projects!'>Intro&nbsp;3</a>.
              </p>
            </div>
          </div>
          <div className='intro-footer'>
            <IntroHide />
          </div>
        </div>
      </div>
    </AppContainerIntro>
  )
}
