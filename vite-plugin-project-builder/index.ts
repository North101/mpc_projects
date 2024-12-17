import envVar from 'env-var'
import { glob } from 'glob'
import fs from 'node:fs/promises'
import path from 'node:path'
import { PluginOption, ResolvedConfig } from 'vite'
import { ExtensionProjects, WebsiteProjects } from './types'
import { hashJson, isProjectFile, readJson, writeJson } from './util'
import data from 'mpc_api/data'

const getSize = (code: string) => data.units['mpc'].find(e => e.code == code)?.name ?? 'Unknown'

interface ProjectWithFilename extends WebsiteProjects.Latest.Project {
  filename: string
  lang: string
  image: string | null
  changelog: string | null
}

const mapProjectInfo = (project: ProjectWithFilename): WebsiteProjects.Info => ({
  projectIds: project.projectIds,
  filename: project.filename,
  hidden: project.hidden == true,
  lang: project.lang,
  image: project.image,
  changelog: project.changelog,
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
  options: project.options.map(({ name, parts }) => ({
    name,
    parts: parts.map(({ code, name, enabled, cards }) => ({
      name,
      count: cards.reduce((count, cards) => count + cards.count, 0),
      enabled: enabled ?? true,
      size: getSize(code),
    }))
  })),
})

const mapProjectData = ({ options }: ProjectWithFilename): WebsiteProjects.Data => ({
  options: options.flatMap(({ name, parts }) => ({
    name,
    parts: parts.map(({ code, name, cards }) => ({
      code,
      name,
      cards,
    })),
  })),
})

const convertWebsiteProject = (project: WebsiteProjects.ProjectUnion): WebsiteProjects.Latest.Project => {
  if (project.version == 1) {
    const { projectId, code, name, cards, ...rest } = project
    return {
      ...rest,
      version: 6,
      projectIds: Object.fromEntries(projectId.map(projectId => [projectId, name])),
      name,
      options: [{
        name,
        parts: [{
          code,
          name,
          cards,
          size: getSize(code),
        }]
      }],
    }
  } else if (project.version == 2) {
    const { projectId, code, name, parts, ...rest } = project
    return {
      ...rest,
      version: 6,
      projectIds: Object.fromEntries(projectId.map(projectId => [projectId, name])),
      name,
      options: [{
        name,
        parts: parts.map(part => ({
          ...part,
          code,
          size: data.units['mpc'].find(e => e.code == code)?.name ?? 'Unknown',
        })),
      }],
    }
  } else if (project.version == 3) {
    const { projectId, code, name, options, ...rest } = project
    return {
      ...rest,
      version: 6,
      projectIds: Object.fromEntries(projectId.map(projectId => [projectId, name])),
      name,
      options: options.map(option => ({
        ...option,
        parts: option.parts.map(part => ({
          ...part,
          code,
          size: getSize(code),
        }))
      })),
    }
  } else if (project.version == 4) {
    const { projectId, name, options, ...rest } = project
    return {
      ...rest,
      version: 6,
      projectIds: Object.fromEntries(projectId.map(projectId => [projectId, name])),
      name,
      options: options.map(option => ({
        ...option,
        parts: option.parts.map(part => ({
          ...part,
          size: getSize(part.code),
        }))
      })),
    }
  } else if (project.version == 5) {
    return {
      ...project,
      version: 6,
      options: project.options.map(option => ({
        ...option,
        parts: option.parts.map(part => ({
          ...part,
          size: getSize(part.code),
        })),
      })),
    }
  } else if (project.version == 6) {
    return project
  }
  throw Error(project)
}

const convertExtensionProject = (filename: string, project: ExtensionProjects.ProjectUnion): WebsiteProjects.Latest.Project => {
  const { name } = path.parse(filename)
  if (project.version == 1) {
    const { code, cards } = project
    return {
      version: 6,
      projectIds: {},
      name,
      description: '',
      artist: null,
      info: null,
      website: null,
      cardsLink: null,
      scenarioCount: 0,
      investigatorCount: 0,
      authors: [],
      statuses: [],
      tags: [],
      created: '',
      updated: '',
      hash: '',
      options: [{
        name,
        parts: [{
          code,
          name,
          cards,
          size: getSize(code),
        }]
      }],
    }
  } else if (project.version == 2) {
    const { code, parts } = project
    return {
      version: 6,
      projectIds: {},
      name,
      description: '',
      artist: null,
      info: null,
      website: null,
      cardsLink: null,
      scenarioCount: 0,
      investigatorCount: 0,
      authors: [],
      statuses: [],
      tags: [],
      created: '',
      updated: '',
      hash: '',
      options: [{
        name,
        parts: parts.map(part => ({
          code,
          ...part,
          size: getSize(code),
        })),
      }],
    }
  } else if (project.version == 3) {
    const { parts } = project
    return {
      version: 6,
      projectIds: {},
      name,
      description: '',
      artist: null,
      info: null,
      website: null,
      cardsLink: null,
      scenarioCount: 0,
      investigatorCount: 0,
      authors: [],
      statuses: [],
      tags: [],
      created: '',
      updated: '',
      hash: '',
      options: [{
        name,
        parts: parts.map(part => ({
          ...part,
          size: getSize(part.code),
        })),
      }],
    }
  }
  throw new Error(project)
}

const parseProject = async (filename: string): Promise<WebsiteProjects.Latest.Project | null> => {
  const project = await readJson(filename)
  if (WebsiteProjects.validate(project)) {
    return convertWebsiteProject(project)
  } else if (ExtensionProjects.validate(project)) {
    return convertExtensionProject(filename, project)
  }
  return null
}

const getPublicProjectAsset = async (filename: string, ext: string, lang?: string) => {
  const publicProjectsDir = path.resolve('./public/projects/')
  const { name } = path.parse(filename)
  const asset = path.format({
    name,
    dir: lang ? path.join(publicProjectsDir, lang) : publicProjectsDir,
    ext: ext,
  })
  try {
    await fs.access(asset, fs.constants.R_OK)
    return path.relative(publicProjectsDir, asset)
  } catch (e) {
    return null
  }
}

const getProjectImage = async (filename: string, lang: string, ext = '.png') => {
  return await getPublicProjectAsset(filename, ext, lang) ?? await getPublicProjectAsset(filename, ext)
}

const getProjectChangelog = async (filename: string, lang: string, ext = '.md') => {
  return await getPublicProjectAsset(filename, ext, lang)
}

const readProject = async (projectsDir: string, filename: string, updateProject: boolean): Promise<ProjectWithFilename | null> => {
  const project = await parseProject(filename)
  if (project == null) {
    console.error(`Failed to validate: ${filename}`)
    return null
  }

  const projectFilename = path.relative(path.resolve(projectsDir), filename)
  const lang = path.basename(path.dirname(projectFilename))
  const hash = hashJson([
    project.options,
  ])
  const updated = !updateProject || hash == project.hash ? project.updated : new Date().toISOString()
  return {
    ...project,
    filename: projectFilename,
    lang,
    image: await getProjectImage(projectFilename, lang),
    changelog: await getProjectChangelog(projectFilename, lang),
    hash,
    updated,
  }
}

const readProjectList = async (projectsDir: string, updateProject: boolean) => {
  const allProjects = await glob(path.resolve(projectsDir, '*/*.json'))
  return await Promise
    .all(allProjects.map((filename) => readProject(projectsDir, filename, updateProject)))
    .then(e => e.filter((e): e is ProjectWithFilename => e != null))
}

interface ProjectsBuilderOptions {
  projectsDir: string
  projectsFilename: string
}

export const projectsBuilder = ({ projectsDir, projectsFilename }: ProjectsBuilderOptions): PluginOption => {
  let viteConfig: ResolvedConfig
  const updateProject = envVar.get('UPDATE_PROJECTS').default('false').asBool()

  return {
    name: 'vite-plugin-build-projects',
    configResolved: (resolvedConfig) => {
      viteConfig = resolvedConfig
    },
    async writeBundle() {
      const outDir = viteConfig.build.outDir
      const projectList = await readProjectList(projectsDir, updateProject)
      // write projects.json
      await writeJson<WebsiteProjects.Info[]>(path.resolve(outDir, projectsFilename), projectList.map(mapProjectInfo))
      // write all project json files
      await Promise.all(projectList.map(async e => {
        await fs.mkdir(path.dirname(path.resolve(outDir, projectsDir, e.filename))).catch(() => { })
        await writeJson<WebsiteProjects.Data>(path.resolve(outDir, projectsDir, e.filename), mapProjectData(e))
      }))
      // update project files
      await Promise.all(projectList.map(async ({ filename, ...project }) => {
        await writeJson<WebsiteProjects.Latest.Project>(path.resolve(projectsDir, filename), {
          version: project.version,
          projectIds: project.projectIds,
          hidden: project.hidden,
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
          options: project.options,
          created: project.created,
          updated: project.updated,
          hash: project.hash,
        }, 2)
      }))
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url == `/${projectsFilename}`) {
          // /projects.json
          const projectList = await readProjectList(projectsDir, updateProject)
          const projectsJson = projectList.map(mapProjectInfo)
          return res.writeHead(200, {
            'Content-Type': 'application/json',
          }).end(JSON.stringify(projectsJson))

        } else if (req.url?.startsWith(`/projects/`)) {
          // /projects/*.json
          if (req.url.endsWith('.json')) {
            const filename = path.resolve(projectsDir, path.resolve(path.join('.', decodeURI(req.url))))
            const project = await readProject(projectsDir, filename, updateProject)
            if (project == undefined) return next()

            return res.writeHead(200, {
              'Content-Type': 'application/json',
            }).end(JSON.stringify(mapProjectData(project)))
          }
        }
        return next()
      })
    },
    handleHotUpdate: async ({ file, server }) => {
      if (isProjectFile(projectsDir, path.relative(viteConfig.envDir, file))) {
        console.log(`Project changed: ${file}. Reloading`)
        server.hot.send({
          type: 'full-reload',
          path: '*',
        })
      }
    },
  }
}
