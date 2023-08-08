import react from '@vitejs/plugin-react-swc'
import crypto from 'crypto'
import { promises as fs } from 'fs'
import { glob } from 'glob'
import mpcData from 'mpc_api/data'
import path, { resolve } from 'path'
import { Plugin, ResolvedConfig, defineConfig } from 'vite'
import { FullProject, Project } from './types'

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

const buildProjectsJson = async () => {
  const allProjects = await glob(['public/projects/*.json']);
  return await Promise.all(allProjects.map(async (e): Promise<Project> => {
    const project = await readJson<FullProject>(e);

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
        .flatMap(site => mpcData.sites.find(e => e.code == site)?.urls),
    };
  }));
}

const buildProjects = (): Plugin => {
  let viteConfig: ResolvedConfig;

  return {
    name: 'build-projects',
    configResolved: (resolvedConfig) => {
      viteConfig = resolvedConfig;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url == '/projects.json') {
          const projectsJson = await buildProjectsJson();

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(projectsJson));
        } else {
          next();
        }
      })
    },
    async writeBundle() {
      const projectJson = await buildProjectsJson();
      const filename = resolve(viteConfig.build.outDir, 'projects.json');
      await writeJson<Project[]>(filename, projectJson);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    buildProjects(),
  ],
})
