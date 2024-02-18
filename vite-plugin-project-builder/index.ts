import { glob } from 'glob'
import fs from 'node:fs/promises'
//import mpcData from 'mpc_api/data'
import envVar from 'env-var'
import path, { basename, dirname, relative, resolve } from 'node:path'
import { PluginOption, ResolvedConfig } from 'vite'
import { ProjectInfo, ProjectLatest, ProjectLatestMeta, ProjectUnionMeta } from './types'
import { hashJson, isProjectFile, readJson, writeJson } from './util'
import projectValidator from './validation'


interface ProjectWithFilename extends ProjectLatestMeta {
  filename: string
  image: string | null
}

const mapProjectInfo = (e: ProjectWithFilename): ProjectInfo => ({
  filename: e.filename,
  name: e.name,
  description: e.description,
  artist: e.artist ?? null,
  info: e.info ?? null,
  image: e.image,
  website: e.website ?? null,
  cardsLink: e.cardsLink ?? null,
  scenarioCount: e.scenarioCount ?? 0,
  investigatorCount: e.investigatorCount ?? 0,
  authors: e.authors,
  statuses: e.statuses,
  tags: e.tags,
  lang: e.filename.split('/')[0],
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

const readProject = async (projectsDir: string, filename: string, updateProject: boolean): Promise<ProjectWithFilename | null> => {
  const project = parseProject(await readJson(filename))
  if (project == null) {
    console.log(relative(resolve(projectsDir), filename))
    projectValidator.errors
      ?.map(e => `  ${e.instancePath}/ ${e.message}`)
      ?.forEach((e) => console.log(e))
    return null
  }

  const hash = hashJson([
    project.code,
    project.parts,
  ])
  const updated = !updateProject || hash == project.hash ? project.updated : new Date().toISOString()
  return {
    ...project,
    filename: relative(resolve(projectsDir), filename),
    image: await getProjectImage(filename),
    hash,
    updated,
  }
}

const readProjectList = async (projectsDir: string, updateProjects: boolean) => {
  const allProjects = await glob(resolve(projectsDir, '*/*.json'))
  return await Promise
    .all(allProjects.map((filename) => readProject(projectsDir, filename, updateProjects)))
    .then(e => e.filter((e): e is ProjectWithFilename => e != null))
}

interface ProjectsBuilderOptions {
  projectsDir: string
  projectsFilename: string
}

const projectsBuilder = ({ projectsDir, projectsFilename }: ProjectsBuilderOptions): PluginOption => {
  let viteConfig: ResolvedConfig
  const updateProjects = envVar.get('UPDATE_PROJECTS').default('true').asBool()

  return {
    name: 'vite-plugin-build-projects',
    configResolved: (resolvedConfig) => {
      viteConfig = resolvedConfig
    },
    async writeBundle() {
      const outDir = viteConfig.build.outDir
      const projectList = await readProjectList(projectsDir, updateProjects)
      // write projects.json
      await writeJson<ProjectInfo[]>(resolve(outDir, projectsFilename), projectList.map(mapProjectInfo))
      // write all project json files
      await Promise.all(projectList.map(async e => {
        await fs.mkdir(dirname(resolve(outDir, projectsDir, e.filename))).catch(() => {})
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
          cardsLink: project.cardsLink,
          scenarioCount: project.scenarioCount,
          investigatorCount: project.investigatorCount,
          authors: project.authors,
          statuses: project.statuses,
          tags: project.tags,
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
          const projectList = await readProjectList(projectsDir, updateProjects)
          const projectsJson = projectList.map(mapProjectInfo)
          return res.writeHead(200, {
            'Content-Type': 'application/json',
          }).end(JSON.stringify(projectsJson))

        } else if (req.url?.startsWith(`/projects/`)) {
          // /projects/*.json
          if (req.url.endsWith('.json')) {
            const filename = path.resolve(projectsDir, path.resolve(decodeURI(req.url).substring(1)))
            const project = await readProject(projectsDir, filename, updateProjects)
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
