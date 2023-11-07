import { useIntro } from './IntroPage'
import { IntroPage } from './IntroPage'
import { ProjectsPage } from './ProjectsPage'

export const HomePage = () => {
  const [showIntro] = useIntro()
  return showIntro ? <IntroPage/> : <ProjectsPage/>
}
