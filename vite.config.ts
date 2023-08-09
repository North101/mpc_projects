import react from '@vitejs/plugin-react-swc'
import crypto from 'crypto'
import { promises as fs } from 'fs'
import { glob } from 'glob'
import mpcData from 'mpc_api/data'
import path from 'path'
import { Plugin, ResolvedConfig, defineConfig } from 'vite'
import { Card, CardFace, FullProject, Project } from './types'

import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
const ajv = new Ajv({});

const cardFaceSchema: JTDSchemaType<CardFace> = {
  properties: {
    Name: { type: 'string' },
    ID: { type: 'string' },
    SourceID: { type: 'string' },
    Exp: { type: 'string' },
    Width: { type: 'int32' },
    Height: { type: 'int32' },
  },
}

const cardSchema: JTDSchemaType<Card> = {
  properties: {
    count: { type: 'int32' }
  },
  optionalProperties: {
    front: cardFaceSchema,
    back: cardFaceSchema,
  },
  additionalProperties: true,
}

const projectSchema: JTDSchemaType<FullProject> = {
  properties: {
    version: { type: 'int32' },
    code: { type: 'string' },
    hash: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    content: { type: 'string' },
    authors: { elements: { type: 'string' } },
    tags: { elements: { type: 'string' } },
    created: { type: 'string' },
    updated: { type: 'string' },
    website: { type: 'string', nullable: true },
    info: { type: 'string', nullable: true },
    cards: { elements: cardSchema },
  },
}

const validateProject = ajv.compile(projectSchema)

const readJson = async <T>(filename: string) => {
  return JSON.parse(await fs.readFile(filename, 'utf-8')) as T;
}

const writeJson = async <T>(filename: string, value: T) => {
  return fs.writeFile(filename, JSON.stringify(value, undefined, 2), 'utf-8');
}

const hashJson = (value: any) => {
  const hashSum = crypto.createHash('sha256');
  hashSum.update(JSON.stringify(value));
  return hashSum.digest('hex');
}

const buildProjectsJson = async (projectsDir: string) => {
  const allProjects = await glob([path.resolve(projectsDir, '*.json')]);
  const projects = await Promise.all(allProjects.map(async (e): Promise<Project|null> => {
    const project = await readJson<FullProject>(e);
    if (!validateProject(project)) {
      console.log(`${e} is not valid`);
      console.log(validateProject.errors);
      return null;
    }

    const {
      version,
      code,
      cards,
      name,
      description,
      content,
      info,
      website,
      authors,
      tags,
      created,
    } = project;
    let {
      updated,
      hash: oldHash,
    } = project;

    const newHash = hashJson({
      version,
      code,
      cards,
    });
    if (oldHash != newHash) {
      updated = (new Date()).toISOString();

      await writeJson<FullProject>(e, {
        name,
        description,
        content,
        info,
        website,
        authors,
        tags,
        created: created ?? updated,
        updated,
        version,
        code,
        cards,
        hash: newHash,
      });
    }

    return {
      filename: path.basename(e),
      name,
      description,
      content,
      info,
      website,
      authors,
      tags,
      created: created ?? updated,
      updated,
      cardCount: cards.reduce((value, it) => value + it.count, 0),
      sites: Object.entries(mpcData.units)
        .map(([site, unit]) => unit.find(e => e.code == code) ? site : null)
        .flatMap(site => mpcData.sites.find(e => e.code == site)?.urls)
        .filter((e): e is string => e != null),
    };
  }));

  return projects.filter((e): e is Project => e != null);
}

interface buildProjectsProps {
  projectsDir: string;
}

const isProjectFile = (projectsDir: string, file: string) => {
  if (path.extname(file) != '.json') return false;

  return path.relative(__dirname, file) == path.join(projectsDir, path.basename(file));
}

const buildProjects = ({ projectsDir }: buildProjectsProps): Plugin => {
  let viteConfig: ResolvedConfig;

  return {
    name: 'build-projects',
    handleHotUpdate: ({ file, server }) => {
      if (isProjectFile(projectsDir, file)) {
        console.log(`Project changed: ${file}. Reloading`)
        server.ws.send({
          type: 'full-reload',
          path: '*'
        });
      }
    },
    configResolved: (resolvedConfig) => {
      viteConfig = resolvedConfig;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url == '/projects.json') {
          const projectsJson = await buildProjectsJson(projectsDir);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(projectsJson));
        } else {
          next();
        }
      })
    },
    async writeBundle() {
      const projectJson = await buildProjectsJson(projectsDir);
      const filename = path.resolve(viteConfig.build.outDir, 'projects.json');
      await writeJson<Project[]>(filename, projectJson);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    buildProjects({
      projectsDir: path.join('public', 'projects'),
    }),
  ],
})
