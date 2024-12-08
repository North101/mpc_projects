import { Dispatch, SetStateAction } from 'react'
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/esm/Container'
import { ChangelogIcon } from './Icons'

interface AlertProps {
  displayAnnouncements: boolean,
  showAnnouncements: boolean,
  setShowAnnouncements: Dispatch<SetStateAction<boolean>>
}
export const Announcements = ({ displayAnnouncements, showAnnouncements, setShowAnnouncements }: AlertProps) => {

  if (showAnnouncements && displayAnnouncements) {
    return (
      <Container>
        <Alert className='announcements' onClose={() => setShowAnnouncements(false)} dismissible>
          <h2>What’s New</h2>
          <div className={'alert-content'}>
            <h3>Recently added:</h3>
            <p>New to Inexorable Fate, we have The Beard’s Team Fortress 2 investigators; Scooby Doo and the gang from Mystery, Inc. by JesterJayJoker, and the classic Stranger Things scenario from the Mythos Busters’ own Ian Martin. Want to always see the most recent additions at the top? Choose “Newest” from the Sort dropdown.</p>
            <h3>Project changes:</h3>
            <p>If you printed Bloodborne before 20 Nov, make sure to check out its changelog as you may want to print at least some of the errata. Also, The Beard updated the chaos bag on a number of his standalones, and we fixed a typo in FFG’s Pathfinder Taboo. Reminder that clicking the changelog icon <ChangelogIcon/> on a project will tell you about any updates and errata you may want to print.</p>
          </div>
        </Alert>
      </Container>
    )
  }
  return;
}
