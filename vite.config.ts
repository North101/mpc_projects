import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import rewriteAll from 'vite-plugin-rewrite-all'
import projectsBuilder from './vite-plugin-project-builder'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    rewriteAll(),
    projectsBuilder({
      projectsDir: path.join('projects'),
      projectsFilename: 'projects.json',
    }),
  ],
})
