import react from '@vitejs/plugin-react-swc'
import { promises as fs } from 'fs'
import { glob } from 'glob'
import { resolve } from 'path'
import { Plugin, defineConfig } from 'vite'

const buildProjectsJson = async () => {
  const allProjects = await glob(['public/projects/*.json']);
  return await Promise.all(allProjects.map(async (e) => {
    const project = JSON.parse(await fs.readFile(e, 'utf8'));
    const {
      name,
      description,
      website,
      content,
      authors,
      tags,
      cards,
      info,
    } = project;

    const stat = await fs.stat(e);
    return {
      filename: e,
      name,
      description,
      website,
      content,
      authors,
      tags,
      cardCount: (cards as any[]).reduce((value, it) => value + it.count, 0),
      info: info ?? null,
      created: stat.birthtime,
      updated: stat.mtime,
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
      console.error('configureServer')
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
      await fs.writeFile(resolve(outDir, 'projects.json'), JSON.stringify(projectJson), 'utf8');
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
