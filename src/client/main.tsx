import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route } from 'wouter'
import '../scss/styles.scss'
import { AboutPage } from './components/AboutPage'
import { CookiePage } from './components/CookiePage'
import { FaqPage } from './components/FaqPage'
import { HelpPage } from './components/HelpPage'
import { HomePage } from './components/HomePage'
import { IntroContext, IntroPage, useIntro } from './components/IntroPage'
import { ProjectsPage } from './components/ProjectsPage'

const queryClient = new QueryClient()

const Router = () => <>
  <Route path='/'><HomePage /></Route>
  <Route path='/intro'><IntroPage /></Route>
  <Route path='/projects'><ProjectsPage /></Route>
  <Route path='/about'>{<AboutPage />}</Route>
  <Route path='/help'>{<HelpPage />}</Route>
  <Route path='/faq'>{<FaqPage />}</Route>
  <Route path='/set_cookie'>{<CookiePage />}</Route>
</>

const App = () => {
  const [showIntro, setShowIntro] = useIntro()
  return (
    <QueryClientProvider client={queryClient}>
      <IntroContext.Provider value={[showIntro, setShowIntro]}>
        <Router />
      </IntroContext.Provider>
    </QueryClientProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
