import { glob } from 'glob'
import mpcData from 'mpc_api/data'
import path from 'path'
import { PluginOption, ResolvedConfig } from 'vite'
import { FullProject, Project } from './types'
import { hashJson, isProjectFile, readJson, writeJson } from './util'
import validateProject from './validation'


const buildProjectJson = async (filename: string) => {
  const project = await readJson(filename)
  if (!validateProject(project)) {
    console.log(`${filename} is not valid`)
    console.log(validateProject.errors)
    return null
  }

  const {
    id,
    name,
    description,
    content,
    info,
    website,
    authors,
    tags,
    created,
    version,
    code,
    cards,
    hash: oldHash,
  } = project
  let { updated } = project

  const newHash = hashJson({
    version,
    code,
    cards,
  })
  if (oldHash != newHash) {
    updated = (new Date()).toISOString()
    await writeJson<FullProject>(filename, {
      id,
      name,
      description,
      content,
      info,
      website,
      authors,
      tags,
      created,
      updated,
      version,
      code,
      cards,
      hash: newHash,
    })
  }

  return {
    filename: path.basename(filename),
    name,
    description,
    content,
    info,
    website,
    authors,
    tags,
    created,
    updated,
    cardCount: cards.reduce((value, it) => value + it.count, 0),
    sites: Object.entries(mpcData.units)
      .map(([site, unit]) => unit.find(e => e.code == code) ? site : null)
      .flatMap(site => mpcData.sites.find(e => e.code == site)?.urls)
      .filter((e): e is string => e != null),
  }
}

const buildProjectsJson = async (projectsDir: string) => {
  const allProjects = await glob(path.resolve(projectsDir, '*.json'))
  return await Promise
    .all(allProjects.map(buildProjectJson))
    .then(e => e.filter((e): e is Project => e != null))
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
      const projectJson = await buildProjectsJson(projectsDir)
      const filename = path.resolve(viteConfig.build.outDir, projectsFilename)
      await writeJson<Project[]>(filename, projectJson)
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url == `/${projectsFilename}`) {
          const projectsJson = await buildProjectsJson(projectsDir)
          return res.writeHead(200, {
            'Content-Type': 'application/json',
          }).end(JSON.stringify(projectsJson))
        }
        return next()
      })
    },
    handleHotUpdate: ({ file, server }) => {
      if (isProjectFile(projectsDir, path.relative(viteConfig.envDir, file))) {
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
