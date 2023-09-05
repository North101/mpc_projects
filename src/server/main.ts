import express from 'express'
import ViteExpress from 'vite-express'
import config from './config'
import './cron'

const app = express()

ViteExpress.listen(app, config.port, () =>
  console.log(`Server is listening on port ${config.port}...`)
)
