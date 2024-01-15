import bodyParser from 'body-parser'
import express from 'express'
import cron from 'node-cron'
import ViteExpress from 'vite-express'
import config from './config.ts'
import { login, updateEnv } from './cron.ts'

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/set_cookie', (req, res) => {
  const { code } = req.query

  if (code != process.env.REFRESH_PROJECTS_CODE) {
    return res.render('set_cookie_failed')
  }
  return res.render('set_cookie', {
    code,
  })
})

app.post('/set_cookie', async (req, res) => {
  const { code, cookie } = req.body
  const task = cron.getTasks().get('refreshProjects')
  if (!task || !code || code != process.env.REFRESH_PROJECTS_CODE) {
    return res.render('set_cookie_failed')
  }

  updateEnv({
    REFRESH_PROJECTS_CODE: undefined,
    REFRESH_PROJECTS_COOKIE: cookie,
  })

  task.now()

  if (await login(config.refreshProjects!.baseUrl, cookie)) {
    return res.render('set_cookie_success')
  } else {
    return res.render('set_cookie_failed')
  }
})

ViteExpress.listen(app, config.port, () =>
  console.log(`Server is listening on port ${config.port}...`)
)
