import envVar from 'env-var'
import { glob } from 'glob'
import fs from 'node:fs/promises'
import path, { basename, dirname, relative, resolve } from 'node:path'
import { PluginOption, ResolvedConfig } from 'vite'
import { ExtensionProjects, WebsiteProjects } from './types'
import { hashJson, isProjectFile, readJson, writeJson } from './util'

interface ProjectWithFilename extends WebsiteProjects.Latest.Project {
  filename: string
  image: string | null
}

const mapProjectInfo = (e: ProjectWithFilename): WebsiteProjects.Info => {
  return {
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
    options: e.options.map(({ name, parts }) => ({
      name,
      parts: parts.map(({ name, enabled, cards }) => ({
        name,
        count: cards.reduce((count, cards) => count + cards.count, 0),
        enabled: enabled ?? true,
      }))
    })),
  }
}

const mapProjectData = ({ code, options }: ProjectWithFilename): WebsiteProjects.Data => ({
  code,
  options: options.flatMap(({ name, parts }) => ({
    name,
    parts: parts.map(({ name, cards }) => ({
      name,
      cards,
    })),
  })),
})

const convertWebsiteProject = (project: WebsiteProjects.ProjectUnion): WebsiteProjects.Latest.Project => {
  if (project.version == 1) {
    const { name, cards, ...rest } = project
    return {
      ...rest,
      name,
      version: 3,
      options: [{
        name,
        parts: [{
          name,
          cards,
        }]
      }],
    }
  } else if (project.version == 2) {
    const { name, parts, ...rest } = project
    return {
      ...rest,
      name,
      version: 3,
      options: [{
        name,
        parts,
      }],
    }
  } else if (project.version == 3) {
    return project
  }
  throw Error(project)
}

const convertExtensionProject = (filename: string, project: ExtensionProjects.ProjectUnion): WebsiteProjects.Latest.Project => {
  const name = basename(filename)
  if (project.version == 1) {
    const { code, cards } = project
    return {
      version: 3,
      code,
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
          name,
          cards,
        }]
      }],
    }
  } else if (project.version == 2) {
    const { code, parts } = project
    return {
      version: 3,
      code,
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
  if (await WebsiteProjects.validate(project)) {
    return convertWebsiteProject(project)
  } else if (await ExtensionProjects.validate(project)) {
    return convertExtensionProject(filename, project)
  }
  return null
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
  const project = await parseProject(filename)
  if (project == null) {
    return null
  }

  const hash = hashJson([
    project.code,
    project.options,
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

export const projectsBuilder = ({ projectsDir, projectsFilename }: ProjectsBuilderOptions): PluginOption => {
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
      await writeJson<WebsiteProjects.Info[]>(resolve(outDir, projectsFilename), projectList.map(mapProjectInfo))
      // write all project json files
      await Promise.all(projectList.map(async e => {
        await fs.mkdir(dirname(resolve(outDir, projectsDir, e.filename))).catch(() => { })
        await writeJson<WebsiteProjects.Data>(resolve(outDir, projectsDir, e.filename), mapProjectData(e))
      }))
      // update project files
      await Promise.all(projectList.map(async ({ filename, ...project }) => {
        await writeJson<WebsiteProjects.Latest.Project>(resolve(projectsDir, filename), {
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
          options: project.options,
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
            }).end(JSON.stringify(mapProjectData(project)))
          }
        }
        return next()
      })
    },
    handleHotUpdate: ({ file, server }) => {
      if (isProjectFile(projectsDir, relative(viteConfig.envDir, file))) {
        console.log(`Project changed: ${file}. Reloading`)
        server.hot.send({
          type: 'full-reload',
          path: '*',
        })
      }
    },
  }
}
