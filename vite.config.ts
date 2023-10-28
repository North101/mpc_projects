import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import { FilterPattern } from '@rollup/pluginutils'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import rollup from 'rollup'
import { PluginOption, defineConfig } from 'vite'
import projectsBuilder from './vite-plugin-project-builder'

interface ViteExpressBuilder extends rollup.RollupOptions {
  output?: rollup.OutputOptions
  exclude?: FilterPattern
  external?: (string | RegExp)[] | string | RegExp
}

const viteExpressBuilder = ({
  input = './src/server/main.ts',
  output = {
    dir: './dist/server',
    format: 'cjs',
  },
  exclude = './src/client/**',
  external = [],
  plugins = [],
  ...rest
}: ViteExpressBuilder = {}): PluginOption => {
  return {
    name: 'Vite Express Builder',
    async writeBundle() {
      const config = await rollup.rollup({
        input: input,
        external: [
          'express',
          'vite-express',
          ...Array.isArray(external) ? external : [external],
        ],
        plugins: [
          typescript({
            module: 'ESNext',
            exclude: exclude,
          }),
          ...Array.isArray(plugins) ? plugins : [plugins],
        ],
        ...rest,
      })
      await config.write(output)
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './dist/client',
  },
  plugins: [
    react(),
    projectsBuilder({
      projectsDir: path.join('projects'),
      projectsFilename: 'projects.json',
    }),
    viteExpressBuilder({
      external: [
        "cheerio",
        "crypto",
        "dotenv-flow/config",
        "fs",
        "glob",
        "node-cron",
        "path",
        "path",
        "undici"
      ],
      plugins: [
        json(),
      ],
    }),
  ],
})
