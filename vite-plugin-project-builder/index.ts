import { promises as fs } from 'fs'
import { glob } from 'glob'
import mpcData from 'mpc_api/data'
import { basename, relative, resolve } from 'path'
import { PluginOption, ResolvedConfig } from 'vite'
import { ProjectDownload, ProjectInfo, Project } from './types'
import { hashJson, isProjectFile, readJson, writeJson } from './util'
import { projectValidator } from './validation'


interface ProjectWithFilename extends Project {
  filename: string
}

const mapProjectInfo = (e: ProjectWithFilename): ProjectInfo => ({
  name: e.name,
  description: e.description,
  content: e.content,
  website: e.website ?? null,
  authors: e.authors,
  tags: e.tags,
  info: e.info ?? null,
  created: e.created,
  updated: e.updated,
  filename: e.filename,
  parts: e.parts.map(e => ({
    enabled: e.enabled ?? true,
    name: e.name,
    count: e.cards.reduce((value, card) => value + card.count, 0),
  })),
  sites: mpcData.sites
    .filter(site => mpcData.units[site.code]?.find(unit => unit.code == e.code))
    .flatMap(e => e.urls),
})

const mapProjectDownload = (e: ProjectWithFilename): ProjectDownload => ({
  version: 2,
  code: e.code,
  parts: e.parts.map(e => ({
    name: e.name,
    cards: e.cards,
  })),
})

const readProject = async (filename: string): Promise<ProjectWithFilename | null> => {
  const project = await readJson(filename)
  if (!projectValidator(project)) {
    console.log(basename(filename))
    projectValidator.errors
      ?.map(e => `  ${e.instancePath}/ ${e.message}`)
      ?.forEach((e) => console.log(e))
    return null
  }

  const hash = hashJson([
    project.projectId,
    project.code,
    project.parts,
  ])
  const updated = hash == project.hash ? project.updated : new Date().toISOString()
  return {
    ...project,
    filename: basename(filename),
    hash,
    updated,
  }

  throw project.version
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
      await writeJson<ProjectInfo[]>(resolve(outDir, projectsFilename), projectList.map(mapProjectInfo))
      await fs.mkdir(resolve(outDir, projectsDir))
      await Promise.all(projectList.map(async e => {
        await writeJson<ProjectDownload>(resolve(outDir, projectsDir, e.filename), mapProjectDownload(e))
      }))
      await Promise.all(projectList.map(async ({ filename, ...project }) => {
        await writeJson<Project>(resolve(projectsDir, filename), project)
      }))
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url == `/${projectsFilename}`) {
          const projectList = await readProjectList(projectsDir)
          const projectsJson = projectList.map(mapProjectInfo)
          return res.writeHead(200, {
            'Content-Type': 'application/json',
          }).end(JSON.stringify(projectsJson))
        } else if (req.url?.startsWith(`/projects/`)) {
          const filename = decodeURI(req.url.split('/').pop() ?? '')
          const project = await readProject(resolve(projectsDir, filename))
          if (project == undefined) return next()

          return res.writeHead(200, {
            'Content-Type': 'application/json',
          }).end(JSON.stringify(mapProjectDownload(project)))
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
