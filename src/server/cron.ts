import { load } from 'cheerio'
import { glob } from 'glob'
import cron from 'node-cron'
import path from 'node:path'
import nodemailer from 'nodemailer'
import { Agent, fetch, setGlobalDispatcher } from 'undici'
import { v4 as uuidv4 } from 'uuid'
import { WebsiteProjects } from '../client/types/index.ts'
import config from './config.ts'
import { readJson } from './util.ts'

setGlobalDispatcher(new Agent({ connect: { timeout: 120_000 } }))

export const updateEnv = async (values: { [key: string]: string | undefined }) => {
  Object.entries(values).forEach(([key, value]) => {
    if (value == undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  })
}

const readProjectList = async (): Promise<{ [projectId: string]: string }> => {
  if (process.env.NODE_ENV == 'production') {
    const projectData: WebsiteProjects.Info[] = await readJson(path.join('./dist/client', 'projects.json'))
    return Object.fromEntries(projectData.flatMap(project => Object.entries(project.projectIds)))
  } else {
    const allProjects = await glob(path.resolve('./projects', '*/*.json'))
    const projectIds = await Promise.all(allProjects.map(async filename => {
      const project: WebsiteProjects.Latest.Project = await readJson(filename)
      return Object.entries(project.projectIds)
    }))
    return Object.fromEntries(projectIds.flat())
  }
}

const loadProjectPreview = async (baseUrl: string, cookie: string, projectId: string) => {
  const url = new URL(`/design/dn_temporary_parse.aspx`, baseUrl)
  url.searchParams.append('id', projectId)
  url.searchParams.append('edit', 'Y')

  const r = await fetch(url, {
    headers: {
      'Cookie': cookie,
    },
  })
  const responseUrl = new URL(r.url)
  if (responseUrl.pathname == '/design/dn_preview_layout.aspx') await r.text()

  responseUrl.pathname = '/design/dn_preview_layout.aspx'
  const r2 = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Cookie': cookie,
    },
  })
  return await r2.text()
}

const loadProjectImages = async (baseUrl: string, cookie: string, projectId: string): Promise<string[]> => {
  const html = load(await loadProjectPreview(baseUrl, cookie, projectId))
  return html('div[class="m-front"] img,div[class="m-back"] img')
    .toArray()
    .map((e) => e.attribs['src'])
}

const loadImage = async (baseUrl: string, cookie: string, projectId: string, imageId: string) => {
  const url = new URL(imageId, baseUrl)
  try {
    const r = await fetch(url, {
      headers: {
        'Cookie': cookie,
      },
    })
    if (r.ok && r.headers.get('Content-Type') == 'image/jpeg') return true
  } catch (e) {
    console.error(e)
  }

  console.log(`${projectId} Could not load image ${url}`)
  return false
}

export const formatCookie = (cookie: string) => `__pcunck=${cookie}`

export const getCookie = () => process.env.REFRESH_PROJECTS_COOKIE ? formatCookie(process.env.REFRESH_PROJECTS_COOKIE) : null

export const login = async (baseUrl: string, cookie: string) => {
  const r = await fetch(new URL('/design/dn_temporary_designes.aspx', baseUrl), {
    headers: {
      'Cookie': cookie,
    },
  })
  return !r.redirected
}

const refreshProjects = async (baseUrl: string) => {
  try {
    console.log('Refreshing projects')
    const cookie = getCookie()
    if (!cookie || !await login(baseUrl, cookie)) {
      console.log(`Invalid cookie: ${cookie}`)
      return
    }

    const projectIds = await readProjectList()
    const projectsLength = Object.keys(projectIds).length
    if (projectsLength == 0) {
      console.log('No projects found')
      return
    }

    console.log(`Loading ${projectsLength} projects`)
    for (const [projectId, name] of Object.entries(projectIds)) {
      const imageIds = await loadProjectImages(baseUrl, cookie, projectId)
      console.log(`[${projectId}] ${name}: Loading ${imageIds.length} images`)
      await Promise.all(imageIds.map((imageId) => loadImage(baseUrl, cookie, projectId, imageId)))
      await new Promise(r => setTimeout(r, 2000))
    }
    console.log('Done')
  } catch (e) {
    console.error(e)
  }
}

const refreshCookie = async (baseUrl: string) => {
  const cookie = getCookie()
  if (cookie && await login(baseUrl, cookie)) {
    return
  }

  const code = process.env.REFRESH_PROJECTS_CODE ?? uuidv4()
  console.log('setting code', code)
  await updateEnv({
    REFRESH_PROJECTS_CODE: code,
  })

  const mailerConfig = config.refreshProjects?.mailer
  const url = new URL('set_cookie', mailerConfig?.baseUrl)
  url.searchParams.append('code', code)
  console.log(`set_cookie url: ${url.toString()}`)

  if (!mailerConfig) {
    console.log('MAILER not set')
    return
  }

  const mailer = nodemailer.createTransport({
    host: mailerConfig.host,
    port: mailerConfig.port,
    auth: {
      user: mailerConfig.user,
      pass: mailerConfig.pass,
    },
  })
  await mailer.sendMail({
    from: {
      name: 'MPC Projects',
      address: mailerConfig.from
    },
    to: mailerConfig.to,
    subject: 'MPC Projects Cookie Refresh',
    text: url.toString(),
  })
  console.log(`Email sent to: ${mailerConfig.to}`)
  return
}

if (config.refreshProjects) {
  cron.schedule(config.refreshProjects.expression, () => refreshProjects(config.refreshProjects!.baseUrl), {
    name: 'refreshProjects',
    scheduled: config.refreshProjects.scheduled,
    runOnInit: config.refreshProjects.immediatly,
  })
  cron.schedule('0 0 * * *', () => refreshCookie(config.refreshProjects!.baseUrl), {
    name: 'refreshCookie',
    scheduled: config.refreshProjects.scheduled,
    runOnInit: config.refreshProjects.immediatly,
  })
}
