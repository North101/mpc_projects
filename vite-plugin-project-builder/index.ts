import { glob } from 'glob'
import fs from 'node:fs/promises'
//import mpcData from 'mpc_api/data'
import path, { basename, relative, resolve } from 'node:path'
import { PluginOption, ResolvedConfig } from 'vite'
import { ProjectInfo, ProjectLatest, ProjectLatestMeta, ProjectUnionMeta } from './types'
import { hashJson, isProjectFile, readJson, writeJson } from './util'
import projectValidator from './validation'


interface ProjectWithFilename extends ProjectLatestMeta {
  filename: string
}

const mapProjectInfo = (e: ProjectWithFilename): ProjectInfo => ({
  filename: e.filename,
  name: e.name,
  description: e.description,
  image: e.image ?? null,
  artist: e.artist ?? null,
  info: e.info ?? null,
  website: e.website ?? null,
  linktext: e.linktext ?? null,
  authors: e.authors,
  statuses: e.statuses,
  tags: e.tags,
  lang: e.lang,
  created: e.created,
  updated: e.updated,
  parts: e.parts.map(e => ({
    enabled: e.enabled ?? true,
    name: e.name,
    count: e.cards.reduce((value, card) => value + card.count, 0),
  })),
  //sites: Object.fromEntries(
  //  mpcData.sites.flatMap(site => {
  //    const unit = mpcData.units[site.code]?.find(unit => unit.code == e.code)
  //    if (!unit) return []
  //
  //    return site.urls.map(url => [url, unit.name])
  //  })
  //),
})

const mapProjectDownload = ({ version, code, parts }: ProjectWithFilename): ProjectLatest => ({
  version,
  code,
  parts: parts.map(e => ({
    name: e.name,
    cards: e.cards,
  })),
})

const upgradeProject = (project: ProjectUnionMeta): ProjectLatestMeta => {
  if (project.version == 1) {
    const { cards, name, ...rest } = project
    return {
      ...rest,
      name,
      version: 2,
      parts: [{
        name: name,
        cards,
      }]
    }
  }

  return project
}

const parseProject = (project: ProjectUnionMeta): ProjectLatestMeta | null => {
  return projectValidator(project) ? upgradeProject(project) : null
}

const getProjectImage = async (filename: string) => {
  const filenameInfo = path.parse(filename)
  const image = path.format({
    ...filenameInfo,
    dir: resolve('public/projects/'),
    base: undefined,
    ext: '.png'
  })
  try {
    await fs.access(image, fs.constants.R_OK)
    return basename(image)
  } catch (e) {
    return null
  }
}

const readProject = async (filename: string): Promise<ProjectWithFilename | null> => {
  const project = parseProject(await readJson(filename))
  if (project == null) {
    console.log(basename(filename))
    projectValidator.errors
      ?.map(e => `  ${e.instancePath}/ ${e.message}`)
      ?.forEach((e) => console.log(e))
    return null
  }

  const hash = hashJson([
    project.code,
    project.parts,
  ])
  const updated = hash == project.hash ? project.updated : new Date().toISOString()
  return {
    ...project,
    filename: basename(filename),
    image: await getProjectImage(filename),
    hash,
    updated,
  }
}

const readProjectList = async (projectsDir: string) => {
  const allProjects = await glob(resolve(projectsDir, '*.json'))
  return await Promise
    .all(allProjects.map(readProject))
    .then(e => e.filter((e): e is ProjectWithFilename => e != null))
}

interface ProjectsBuilderOptions {
  projectsDir: string
  projectsFilename: string
}

const projectsBuilder = ({ projectsDir, projectsFilename }: ProjectsBuilderOptions): PluginOption => {
  let viteConfig: ResolvedConfig

  return {
    name: 'vite-plugin-build-projects',
    configResolved: (resolvedConfig) => {
      viteConfig = resolvedConfig
    },
    async writeBundle() {
      const outDir = viteConfig.build.outDir
      const projectList = await readProjectList(projectsDir)
      // write projects.json
      await writeJson<ProjectInfo[]>(resolve(outDir, projectsFilename), projectList.map(mapProjectInfo))
      // write all project json files
      await Promise.all(projectList.map(async e => {
        await writeJson<ProjectLatest>(resolve(outDir, projectsDir, e.filename), mapProjectDownload(e))
      }))
      // update project files
      await Promise.all(projectList.map(async ({ filename, ...project }) => {
        await writeJson<ProjectLatestMeta>(resolve(projectsDir, filename), {
          projectId: project.projectId,
          name: project.name,
          description: project.description,
          artist: project.artist,
          info: project.info,
          website: project.website,
          linktext: project.linktext,
          authors: project.authors,
          statuses: project.statuses,
          tags: project.tags,
          lang: project.lang,
          created: project.created,
          updated: project.updated,
          version: project.version,
          code: project.code,
          parts: project.parts,
          hash: project.hash,
        }, 2)
      }))
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url == `/${projectsFilename}`) {
          // /projects.json
          const projectList = await readProjectList(projectsDir)
          const projectsJson = projectList.map(mapProjectInfo)
          return res.writeHead(200, {
            'Content-Type': 'application/json',
          }).end(JSON.stringify(projectsJson))

        } else if (req.url?.startsWith(`/projects/`)) {
          // /projects/*.json
          if (req.url.endsWith('.json')) {
            const filename = decodeURI(req.url.split('/').pop() ?? '')
            const project = await readProject(resolve(projectsDir, filename))
            if (project == undefined) return next()

            return res.writeHead(200, {
              'Content-Type': 'application/json',
            }).end(JSON.stringify(mapProjectDownload(project)))
          }
        }
        return next()
      })
    },
    handleHotUpdate: ({ file, server }) => {
      if (isProjectFile(projectsDir, relative(viteConfig.envDir, file))) {
        console.log(`Project changed: ${file}. Reloading`)
        server.ws.send({
          type: 'full-reload',
          path: '*',
        })
      }
    },
  }
}

export default projectsBuilder
