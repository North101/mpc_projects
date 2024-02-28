import envVar from 'env-var'
import { glob } from 'glob'
import fs from 'node:fs/promises'
import path from 'node:path'
import { PluginOption, ResolvedConfig } from 'vite'
import { ExtensionProjects, WebsiteProjects } from './types'
import { hashJson, isProjectFile, readJson, writeJson } from './util'

interface ProjectWithFilename extends WebsiteProjects.Latest.Project {
  filename: string
  image: string | null
  lang: string
}

const mapProjectInfo = (e: ProjectWithFilename): WebsiteProjects.Info => ({
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
  lang: e.lang,
  created: e.created,
  updated: e.updated,
  options: e.options.map(({ name, parts }) => ({
    name,
    parts: parts.map(({ name, enabled, cards }) => ({
      name,
      count: cards.reduce((count, cards) => count + cards.count, 0),
      enabled: enabled ?? true,
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
    const { code, name, cards, ...rest } = project
    return {
      ...rest,
      version: 4,
      name,
      options: [{
        name,
        parts: [{
          code,
          name,
          cards,
        }]
      }],
    }
  } else if (project.version == 2) {
    const { code, name, parts, ...rest } = project
    return {
      ...rest,
      version: 4,
      name,
      options: [{
        name,
        parts: parts.map(part => ({
          ...part,
          code,
        })),
      }],
    }
  } else if (project.version == 3) {
    const { code, name, options, ...rest } = project
    return {
      ...rest,
      version: 4,
      name,
      options: options.map(option => ({
        ...option,
        parts: option.parts.map(part => ({
          ...part,
          code,
        }))
      })),
    }
  } else if (project.version == 4) {
    return project
  }
  throw Error(project)
}

const convertExtensionProject = (filename: string, project: ExtensionProjects.ProjectUnion): WebsiteProjects.Latest.Project => {
  const { name } = path.parse(filename)
  if (project.version == 1) {
    const { code, cards } = project
    return {
      version: 4,
      projectId: [],
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
        }]
      }],
    }
  } else if (project.version == 2) {
    const { code, parts } = project
    return {
      version: 4,
      projectId: [],
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
        })),
      }],
    }
  } else if (project.version == 3) {
    const { parts } = project
    return {
      version: 4,
      projectId: [],
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
        parts,
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

const getProjectImage = async (filename: string) => {
  const filenameInfo = path.parse(filename)
  const image = path.format({
    ...filenameInfo,
    dir: path.resolve('public/projects/'),
    base: undefined,
    ext: '.png',
  })
  try {
    await fs.access(image, fs.constants.R_OK)
    return path.basename(image)
  } catch (e) {
    return null
  }
}

const readProject = async (projectsDir: string, filename: string, updateProject: boolean): Promise<ProjectWithFilename | null> => {
  const project = await parseProject(filename)
  if (project == null) {
    console.error(`Failed to validate: ${filename}`)
    return null
  }

  const hash = hashJson([
    project.options,
  ])
  const updated = !updateProject || hash == project.hash ? project.updated : new Date().toISOString()
  return {
    ...project,
    filename: path.relative(path.resolve(projectsDir), filename),
    image: await getProjectImage(filename),
    lang: path.basename(path.dirname(filename)),
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
