import react from '@vitejs/plugin-react-swc'
import { promises as fs } from 'fs'
import { glob } from 'glob'
import path, { resolve } from 'path'
import { Plugin, defineConfig } from 'vite'
import crypto from 'crypto'

const buildProjectsJson = async () => {
  const allProjects = await glob(['public/projects/*.json']);
  return await Promise.all(allProjects.map(async (e) => {
    const filename = path.basename(e);
    const project = JSON.parse(await fs.readFile(e, 'utf-8'));
    const {
      version,
      code,
      name,
      cards,
      description,
      website,
      content,
      authors,
      tags,
      info,
      created,
    } = project;
    let {
      updated,
      hash: oldHash,
    } = project;

    const hashSum = crypto.createHash('sha256');
    hashSum.update(JSON.stringify({
      version,
      code,
      cards,
    }));
    const newHash = hashSum.digest('hex');
    if (oldHash != newHash) {
      updated = (new Date()).toISOString();
      await fs.writeFile(e, JSON.stringify({
        name,
        description,
        website,
        content,
        authors,
        tags,
        info,
        created,
        updated,
        version,
        code,
        cards,
        hash: newHash,
      }, undefined, 2), 'utf-8');
    }

    return {
      filename: filename,
      name,
      description,
      website,
      content,
      authors,
      tags,
      cardCount: (cards as any[]).reduce((value, it) => value + it.count, 0),
      info,
      created,
      updated,
    };
  }));
}

const buildProjects = (): Plugin => {
  let viteConfig: any;
  return {
    name: 'build-projects',
    configResolved: (resolvedConfig: any) => {
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
      const outDir = resolve(viteConfig.build.outDir || 'dist');
      await fs.writeFile(resolve(outDir, 'projects.json'), JSON.stringify(projectJson), 'utf-8');
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
