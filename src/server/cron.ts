import { load } from 'cheerio';
import { glob } from 'glob';
import cron from 'node-cron';
import path from 'path';
import config from './config';
import { readJson } from './util';


const readProject = async (filename: string): Promise<string[]> => {
  const project = await readJson(filename)
  return project['projectId']
}

const readProjectList = async (projectsDir: string) => {
  const allProjects = await glob(path.resolve(projectsDir, '*.json'))
  return await Promise.all(allProjects.map(readProject)).then(e => e.flatMap(e => e))
}

const login = async () => {
  const body = new URLSearchParams()
  body.set('__EVENTTARGET', 'btn_submit')
  body.set('__EVENTARGUMENT', '')
  body.set('__VIEWSTATE', '/wEPDwUKMTM3NjI2NzUxMg8WAh4TVmFsaWRhdGVSZXF1ZXN0TW9kZQIBFgICAw9kFgICAQ9kFggCCw8WAh4Hb25jbGljawUnamF2YXNjcmlwdDpyZXR1cm4gYnRuX3N1Ym1pdF9vbmNsaWNrKCk7ZAINDxYCHgRocmVmBRouL3N5c3RlbS9zeXNfcmVnaXN0ZXIuYXNweGQCDw8PFgQeBUFwcElkBQ8xNzQ3NjU5NzU5ODUyNTceCExvZ2luVXJsBQpsb2dpbi5hc3B4ZGQCEQ8PFgQeCENsaWVudElkBUg2NjY1Mjc5MDE0OTAtZWRmMzM1NGFtODh1OGR2cDI2YWQ5NGw1MDY1bGRxNDIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20fBAUKbG9naW4uYXNweGRkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYBBQxja2JfcmVtZW1iZXJAO4PuIRL4YBdOmiolbn9lUmBRRg==')
  body.set('__VIEWSTATEGENERATOR', 'C2EE9ABB')
  body.set('txt_email', config.refreshProjects.email)
  body.set('txt_password', config.refreshProjects.password)
  body.set('g-recaptcha-response', '')
  body.set('hidd_verifyResponse', '')
  body.set('ckb_remember', 'on')

  const r = await fetch(new URL('/login.aspx', config.refreshProjects.url), {
    method: 'POST',
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  return r.headers.get('set-cookie')
    ?.split(',')
    .map(cookie => cookie.split(';')[0])
    .join('; ')
}

const loadProjectPreview = async (cookie: string, projectId: string) => {
  const r = await fetch(new URL(`/design/dn_temporary_parse.aspx?id=${projectId}&edit=Y`, config.refreshProjects.url), {
    headers: {
      'Cookie': cookie,
    },
  })
  const url = new URL(r.url)
  if (url.pathname == '/design/dn_preview_layout.aspx') await r.text()

  url.pathname = '/design/dn_preview_layout.aspx'
  const r2 = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Cookie': cookie,
    },
  })
  return await r2.text()
}

const loadProjectImages = async (cookie: string, projectId: string): Promise<string[]> => {
  const html = load(await loadProjectPreview(cookie, projectId))
  return html('div[class="m-front"] img,div[class="m-back"] img')
    .toArray()
    .map((e) => e.attribs['src'])
}

const loadImage = async (cookie: string, imageId: string) => {
  const r = await fetch(new URL(imageId, config.refreshProjects.url), {
    headers: {
      'Cookie': cookie,
    },
  })
  if (!r.ok || r.headers.get('Content-Type') != 'image/jpeg') {
    console.log(`Could not load image ${imageId}`)
  }
}

const refreshProjects = async () => {
  try {
    console.log('Refreshing projects')
    const projectIds = await readProjectList('./projects')
    if (projectIds.length == 0) {
      console.log('No projects found')
      return
    }

    const cookie = await login()
    if (cookie == undefined) {
      console.log('Failed to login')
      return
    }

    console.log(`Loading ${projectIds.length} projects`)
    const imageIds = await Promise.all(projectIds.map(projectId => loadProjectImages(cookie, projectId)))
      .then(e => e.flat())
    console.log(`Loading ${imageIds.length} images`)
    await Promise.all(imageIds.map((imageId) => loadImage(cookie, imageId)))
    console.log('Done')
  } catch (e) {
    console.error(e)
  }
}

cron.schedule(config.refreshProjects.schedule, refreshProjects, {
  runOnInit: config.refreshProjects.immediatly,
})
