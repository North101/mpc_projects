import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route } from 'wouter'
import '../scss/styles.scss'
import { AboutPage } from './components/AboutPage'
import { HelpPage } from './components/HelpPage'
import { HomePage } from './components/HomePage'
import { Intro, IntroContext, useIntro } from './components/IntroPage'
{/*import {SitePage} from './components/SitePage'*/ }

const Router = () => <>
  <Route path="/"><HomePage /></Route>
  {/*<Route path="/project/:project">{({ project }) => <ProjectPage name={decodeURI(project)} />}</Route>*/}
  {/*<Route path="/author/:author">{({ author }) => <AuthorPage name={decodeURI(author)} />}</Route>*/}
  {/*<Route path="/tag/:tag">{({ tag }) => <TagPage tag={decodeURI(tag)} />}</Route>*/}
  {/*<Route path="/status/:status">{({ status }) => <StatusPage status={decodeURI(status)} />}</Route>*/}
  {/*<Route path="/site/:site">{({site}) => <SitePage site={decodeURI(site)}/>}</Route>*/}
  <Route path="/about">{<AboutPage />}</Route>
  <Route path="/help">{<HelpPage />}</Route>
</>

const App = () => {
  const [showIntro, setShowIntro] = useIntro()
  return (
    <IntroContext.Provider value={[showIntro, setShowIntro]}>
      <Router />
      <Intro />
    </IntroContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
