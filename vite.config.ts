import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import { defineConfig } from 'vite'
import { projectsBuilder } from './vite-plugin-project-builder/projects'
import { schemaBuilder } from './vite-plugin-project-builder/schema'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './dist/client',
    target: 'esnext',
  },
  plugins: [
    react(),
    schemaBuilder({
      paths: [
        './vite-plugin-project-builder/types/extension_projects',
        './vite-plugin-project-builder/types/website_projects',
      ],
    }),
    projectsBuilder({
      projectsDir: path.join('projects'),
      projectsFilename: 'projects.json',
    }),
  ],
})
