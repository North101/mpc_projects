import './scss/styles.scss'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {Route} from 'wouter'
import {AboutPage} from './components/AboutPage'
import {AuthorPage} from './components/AuthorPage'
import {HelpPage} from './components/HelpPage'
import {HomePage} from './components/HomePage'
import {ProjectPage} from './components/ProjectPage'
{/*import {SitePage} from './components/SitePage'*/}
import {TagPage} from './components/TagPage'
import {StatusPage} from './components/StatusPage'
{/*import {DevSupport} from '@react-buddy/ide-toolbox';
import {ComponentPreviews, useInitial} from './dev';*/}

const App = () => <>
  <Route path="/"><HomePage/></Route>
  <Route path="/project/:project">{({project}) => <ProjectPage name={decodeURI(project)}/>}</Route>
  <Route path="/author/:author">{({author}) => <AuthorPage name={decodeURI(author)}/>}</Route>
  <Route path="/tag/:tag">{({tag}) => <TagPage tag={decodeURI(tag)}/>}</Route>
  <Route path="/status/:status">{({status}) => <StatusPage status={decodeURI(status)}/>}</Route>
  {/*<Route path="/site/:site">{({site}) => <SitePage site={decodeURI(site)}/>}</Route>*/}
  <Route path="/about">{<AboutPage/>}</Route>
  <Route path="/help">{<HelpPage/>}</Route>
</>

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/*<DevSupport ComponentPreviews={ComponentPreviews}
                useInitialHook={useInitial}
    >*/}
      <App/>
    {/*</DevSupport>*/}
  </React.StrictMode>
)