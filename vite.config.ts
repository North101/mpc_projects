import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import projectsBuilder from './vite-plugin-project-builder'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    projectsBuilder({
      projectsDir: path.join('public', 'projects'),
      projectsFilename: 'projects.json',
    }),
  ],
})
