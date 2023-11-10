import { IntroPage, useIntro } from './IntroPage'
import { ProjectsPage } from './ProjectsPage'

export const HomePage = () => {
  const [showIntro] = useIntro()
  return showIntro ? <IntroPage /> : <ProjectsPage />
}
