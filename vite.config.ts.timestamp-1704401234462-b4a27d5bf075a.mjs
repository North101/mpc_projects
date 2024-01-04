// vite.config.ts
import react from "file:///Users/kelley/gitweb/mpc-projects/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path3 from "node:path";
import { defineConfig } from "file:///Users/kelley/gitweb/mpc-projects/node_modules/vite/dist/node/index.js";

// vite-plugin-project-builder/index.ts
import { glob } from "file:///Users/kelley/gitweb/mpc-projects/node_modules/glob/dist/esm/index.js";
import fs2 from "node:fs/promises";
import path2, { basename, relative, resolve } from "node:path";

// vite-plugin-project-builder/util.ts
import crypto from "crypto";
import fs from "node:fs/promises";
import path from "node:path";
var readJson = async (filename) => {
  return JSON.parse(await fs.readFile(filename, "utf-8"));
};
var writeJson = async (filename, value, indent) => {
  return fs.writeFile(filename, JSON.stringify(value, void 0, indent), "utf-8");
};
var hashJson = (value) => {
  const hashSum = crypto.createHash("sha256");
  hashSum.update(JSON.stringify(value));
  return hashSum.digest("hex");
};
var isProjectFile = (projectsDir, file) => {
  if (path.extname(file) != ".json")
    return false;
  return file == path.join(projectsDir, path.basename(file));
};

// vite-plugin-project-builder/validation.ts
import Ajv from "file:///Users/kelley/gitweb/mpc-projects/node_modules/ajv/dist/ajv.js";
var cardFaceSchema = {
  type: "object",
  properties: {
    Name: { type: "string" },
    ID: { type: "string" },
    SourceID: { type: "string" },
    Exp: { type: "string" },
    Width: { type: "number" },
    Height: { type: "number" }
  },
  required: [
    "Name",
    "ID",
    "SourceID",
    "Exp",
    "Width",
    "Height"
  ]
};
var cardSchema = {
  type: "object",
  properties: {
    count: { type: "number" },
    front: { ...cardFaceSchema, nullable: true },
    back: { ...cardFaceSchema, nullable: true }
  },
  required: [
    "count"
  ]
};
var partSchema = {
  type: "object",
  properties: {
    key: { type: "number" },
    enabled: { type: "boolean", nullable: true },
    name: { type: "string" },
    cards: { type: "array", items: cardSchema }
  },
  required: [
    "name",
    "cards"
  ]
};
var projectV1Schema = {
  type: "object",
  properties: {
    projectId: { type: "array", items: { type: "string" } },
    name: { type: "string" },
    description: { type: "string" },
    image: { type: "string", nullable: true },
    artist: { type: "string", nullable: true },
    info: { type: "string", nullable: true },
    website: { type: "string", nullable: true },
    cardsLink: { type: "string", nullable: true },
    authors: { type: "array", items: { type: "string" } },
    tags: { type: "array", items: { type: "string" } },
    statuses: { type: "array", items: { type: "string" } },
    lang: { type: "string", nullable: true },
    created: { type: "string" },
    updated: { type: "string" },
    hash: { type: "string" },
    version: { type: "number", const: 1 },
    code: { type: "string" },
    cards: { type: "array", items: cardSchema }
  },
  required: [
    "projectId",
    "name",
    "description",
    "authors",
    "tags",
    "statuses",
    "created",
    "updated",
    "hash",
    "version",
    "code",
    "cards"
  ]
};
var projectV2Schema = {
  type: "object",
  properties: {
    projectId: { type: "array", items: { type: "string" } },
    name: { type: "string" },
    description: { type: "string" },
    image: { type: "string", nullable: true },
    artist: { type: "string", nullable: true },
    info: { type: "string", nullable: true },
    website: { type: "string", nullable: true },
    cardsLink: { type: "string", nullable: true },
    scenarioCount: { type: "number" },
    investigatorCount: { type: "number" },
    authors: { type: "array", items: { type: "string" } },
    tags: { type: "array", items: { type: "string" } },
    statuses: { type: "array", items: { type: "string" } },
    lang: { type: "string", nullable: true },
    created: { type: "string" },
    updated: { type: "string" },
    hash: { type: "string" },
    version: { type: "number", const: 2 },
    code: { type: "string" },
    parts: { type: "array", items: partSchema }
  },
  required: [
    "projectId",
    "name",
    "description",
    "authors",
    "tags",
    "statuses",
    "created",
    "updated",
    "hash",
    "version",
    "code",
    "parts"
  ]
};
var projectSchema = {
  oneOf: [
    projectV1Schema,
    projectV2Schema
  ]
};
var ajv = new Ajv({
  removeAdditional: "all"
});
var projectValidator = ajv.compile(projectSchema);
var validation_default = projectValidator;

// vite-plugin-project-builder/index.ts
var mapProjectInfo = (e) => ({
  filename: e.filename,
  name: e.name,
  description: e.description,
  image: e.image ?? null,
  artist: e.artist ?? null,
  info: e.info ?? null,
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
  parts: e.parts.map((e2) => ({
    enabled: e2.enabled ?? true,
    name: e2.name,
    count: e2.cards.reduce((value, card) => value + card.count, 0)
  }))
  //sites: Object.fromEntries(
  //  mpcData.sites.flatMap(site => {
  //    const unit = mpcData.units[site.code]?.find(unit => unit.code == e.code)
  //    if (!unit) return []
  //
  //    return site.urls.map(url => [url, unit.name])
  //  })
  //),
});
var mapProjectDownload = ({ version, code, parts }) => ({
  version,
  code,
  parts: parts.map((e) => ({
    name: e.name,
    cards: e.cards
  }))
});
var upgradeProject = (project) => {
  if (project.version == 1) {
    const { cards, name, ...rest } = project;
    return {
      ...rest,
      name,
      version: 2,
      parts: [{
        name,
        cards
      }]
    };
  }
  return project;
};
var parseProject = (project) => {
  return validation_default(project) ? upgradeProject(project) : null;
};
var getProjectImage = async (filename) => {
  const filenameInfo = path2.parse(filename);
  const image = path2.format({
    ...filenameInfo,
    dir: resolve("public/projects/"),
    base: void 0,
    ext: ".png"
  });
  try {
    await fs2.access(image, fs2.constants.R_OK);
    return basename(image);
  } catch (e) {
    return null;
  }
};
var readProject = async (filename) => {
  const project = parseProject(await readJson(filename));
  if (project == null) {
    console.log(basename(filename));
    validation_default.errors?.map((e) => `  ${e.instancePath}/ ${e.message}`)?.forEach((e) => console.log(e));
    return null;
  }
  const hash = hashJson([
    project.code,
    project.parts
  ]);
  const updated = hash == project.hash ? project.updated : (/* @__PURE__ */ new Date()).toISOString();
  return {
    ...project,
    filename: basename(filename),
    image: await getProjectImage(filename),
    hash,
    updated
  };
};
var readProjectList = async (projectsDir) => {
  const allProjects = await glob(resolve(projectsDir, "*.json"));
  return await Promise.all(allProjects.map(readProject)).then((e) => e.filter((e2) => e2 != null));
};
var projectsBuilder = ({ projectsDir, projectsFilename }) => {
  let viteConfig;
  return {
    name: "vite-plugin-build-projects",
    configResolved: (resolvedConfig) => {
      viteConfig = resolvedConfig;
    },
    async writeBundle() {
      const outDir = viteConfig.build.outDir;
      const projectList = await readProjectList(projectsDir);
      await writeJson(resolve(outDir, projectsFilename), projectList.map(mapProjectInfo));
      await Promise.all(projectList.map(async (e) => {
        await writeJson(resolve(outDir, projectsDir, e.filename), mapProjectDownload(e));
      }));
      await Promise.all(projectList.map(async ({ filename, ...project }) => {
        await writeJson(resolve(projectsDir, filename), {
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
          lang: project.lang,
          created: project.created,
          updated: project.updated,
          version: project.version,
          code: project.code,
          parts: project.parts,
          hash: project.hash
        }, 2);
      }));
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url == `/${projectsFilename}`) {
          const projectList = await readProjectList(projectsDir);
          const projectsJson = projectList.map(mapProjectInfo);
          return res.writeHead(200, {
            "Content-Type": "application/json"
          }).end(JSON.stringify(projectsJson));
        } else if (req.url?.startsWith(`/projects/`)) {
          if (req.url.endsWith(".json")) {
            const filename = decodeURI(req.url.split("/").pop() ?? "");
            const project = await readProject(resolve(projectsDir, filename));
            if (project == void 0)
              return next();
            return res.writeHead(200, {
              "Content-Type": "application/json"
            }).end(JSON.stringify(mapProjectDownload(project)));
          }
        }
        return next();
      });
    },
    handleHotUpdate: ({ file, server }) => {
      if (isProjectFile(projectsDir, relative(viteConfig.envDir, file))) {
        console.log(`Project changed: ${file}. Reloading`);
        server.ws.send({
          type: "full-reload",
          path: "*"
        });
      }
    }
  };
};
var vite_plugin_project_builder_default = projectsBuilder;

// vite.config.ts
var vite_config_default = defineConfig({
  build: {
    outDir: "./dist/client",
    target: "esnext"
  },
  plugins: [
    react(),
    vite_plugin_project_builder_default({
      projectsDir: path3.join("projects"),
      projectsFilename: "projects.json"
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS1wbHVnaW4tcHJvamVjdC1idWlsZGVyL2luZGV4LnRzIiwgInZpdGUtcGx1Z2luLXByb2plY3QtYnVpbGRlci91dGlsLnRzIiwgInZpdGUtcGx1Z2luLXByb2plY3QtYnVpbGRlci92YWxpZGF0aW9uLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2tlbGxleS9naXR3ZWIvbXBjLXByb2plY3RzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMva2VsbGV5L2dpdHdlYi9tcGMtcHJvamVjdHMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2tlbGxleS9naXR3ZWIvbXBjLXByb2plY3RzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcHJvamVjdHNCdWlsZGVyIGZyb20gJy4vdml0ZS1wbHVnaW4tcHJvamVjdC1idWlsZGVyJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICcuL2Rpc3QvY2xpZW50JyxcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBwcm9qZWN0c0J1aWxkZXIoe1xuICAgICAgcHJvamVjdHNEaXI6IHBhdGguam9pbigncHJvamVjdHMnKSxcbiAgICAgIHByb2plY3RzRmlsZW5hbWU6ICdwcm9qZWN0cy5qc29uJyxcbiAgICB9KSxcbiAgXSxcbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9rZWxsZXkvZ2l0d2ViL21wYy1wcm9qZWN0cy92aXRlLXBsdWdpbi1wcm9qZWN0LWJ1aWxkZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9rZWxsZXkvZ2l0d2ViL21wYy1wcm9qZWN0cy92aXRlLXBsdWdpbi1wcm9qZWN0LWJ1aWxkZXIvaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2tlbGxleS9naXR3ZWIvbXBjLXByb2plY3RzL3ZpdGUtcGx1Z2luLXByb2plY3QtYnVpbGRlci9pbmRleC50c1wiO2ltcG9ydCB7IGdsb2IgfSBmcm9tICdnbG9iJ1xuaW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMvcHJvbWlzZXMnXG4vL2ltcG9ydCBtcGNEYXRhIGZyb20gJ21wY19hcGkvZGF0YSdcbmltcG9ydCBwYXRoLCB7IGJhc2VuYW1lLCByZWxhdGl2ZSwgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCB7IFBsdWdpbk9wdGlvbiwgUmVzb2x2ZWRDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgUHJvamVjdEluZm8sIFByb2plY3RMYXRlc3QsIFByb2plY3RMYXRlc3RNZXRhLCBQcm9qZWN0VW5pb25NZXRhIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IGhhc2hKc29uLCBpc1Byb2plY3RGaWxlLCByZWFkSnNvbiwgd3JpdGVKc29uIH0gZnJvbSAnLi91dGlsJ1xuaW1wb3J0IHByb2plY3RWYWxpZGF0b3IgZnJvbSAnLi92YWxpZGF0aW9uJ1xuXG5cbmludGVyZmFjZSBQcm9qZWN0V2l0aEZpbGVuYW1lIGV4dGVuZHMgUHJvamVjdExhdGVzdE1ldGEge1xuICBmaWxlbmFtZTogc3RyaW5nXG59XG5cbmNvbnN0IG1hcFByb2plY3RJbmZvID0gKGU6IFByb2plY3RXaXRoRmlsZW5hbWUpOiBQcm9qZWN0SW5mbyA9PiAoe1xuICBmaWxlbmFtZTogZS5maWxlbmFtZSxcbiAgbmFtZTogZS5uYW1lLFxuICBkZXNjcmlwdGlvbjogZS5kZXNjcmlwdGlvbixcbiAgaW1hZ2U6IGUuaW1hZ2UgPz8gbnVsbCxcbiAgYXJ0aXN0OiBlLmFydGlzdCA/PyBudWxsLFxuICBpbmZvOiBlLmluZm8gPz8gbnVsbCxcbiAgd2Vic2l0ZTogZS53ZWJzaXRlID8/IG51bGwsXG4gIGNhcmRzTGluazogZS5jYXJkc0xpbmsgPz8gbnVsbCxcbiAgc2NlbmFyaW9Db3VudDogZS5zY2VuYXJpb0NvdW50ID8/IDAsXG4gIGludmVzdGlnYXRvckNvdW50OiBlLmludmVzdGlnYXRvckNvdW50ID8/IDAsXG4gIGF1dGhvcnM6IGUuYXV0aG9ycyxcbiAgc3RhdHVzZXM6IGUuc3RhdHVzZXMsXG4gIHRhZ3M6IGUudGFncyxcbiAgbGFuZzogZS5sYW5nLFxuICBjcmVhdGVkOiBlLmNyZWF0ZWQsXG4gIHVwZGF0ZWQ6IGUudXBkYXRlZCxcbiAgcGFydHM6IGUucGFydHMubWFwKGUgPT4gKHtcbiAgICBlbmFibGVkOiBlLmVuYWJsZWQgPz8gdHJ1ZSxcbiAgICBuYW1lOiBlLm5hbWUsXG4gICAgY291bnQ6IGUuY2FyZHMucmVkdWNlKCh2YWx1ZSwgY2FyZCkgPT4gdmFsdWUgKyBjYXJkLmNvdW50LCAwKSxcbiAgfSkpLFxuICAvL3NpdGVzOiBPYmplY3QuZnJvbUVudHJpZXMoXG4gIC8vICBtcGNEYXRhLnNpdGVzLmZsYXRNYXAoc2l0ZSA9PiB7XG4gIC8vICAgIGNvbnN0IHVuaXQgPSBtcGNEYXRhLnVuaXRzW3NpdGUuY29kZV0/LmZpbmQodW5pdCA9PiB1bml0LmNvZGUgPT0gZS5jb2RlKVxuICAvLyAgICBpZiAoIXVuaXQpIHJldHVybiBbXVxuICAvL1xuICAvLyAgICByZXR1cm4gc2l0ZS51cmxzLm1hcCh1cmwgPT4gW3VybCwgdW5pdC5uYW1lXSlcbiAgLy8gIH0pXG4gIC8vKSxcbn0pXG5cbmNvbnN0IG1hcFByb2plY3REb3dubG9hZCA9ICh7IHZlcnNpb24sIGNvZGUsIHBhcnRzIH06IFByb2plY3RXaXRoRmlsZW5hbWUpOiBQcm9qZWN0TGF0ZXN0ID0+ICh7XG4gIHZlcnNpb24sXG4gIGNvZGUsXG4gIHBhcnRzOiBwYXJ0cy5tYXAoZSA9PiAoe1xuICAgIG5hbWU6IGUubmFtZSxcbiAgICBjYXJkczogZS5jYXJkcyxcbiAgfSkpLFxufSlcblxuY29uc3QgdXBncmFkZVByb2plY3QgPSAocHJvamVjdDogUHJvamVjdFVuaW9uTWV0YSk6IFByb2plY3RMYXRlc3RNZXRhID0+IHtcbiAgaWYgKHByb2plY3QudmVyc2lvbiA9PSAxKSB7XG4gICAgY29uc3QgeyBjYXJkcywgbmFtZSwgLi4ucmVzdCB9ID0gcHJvamVjdFxuICAgIHJldHVybiB7XG4gICAgICAuLi5yZXN0LFxuICAgICAgbmFtZSxcbiAgICAgIHZlcnNpb246IDIsXG4gICAgICBwYXJ0czogW3tcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgY2FyZHMsXG4gICAgICB9XVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwcm9qZWN0XG59XG5cbmNvbnN0IHBhcnNlUHJvamVjdCA9IChwcm9qZWN0OiBQcm9qZWN0VW5pb25NZXRhKTogUHJvamVjdExhdGVzdE1ldGEgfCBudWxsID0+IHtcbiAgcmV0dXJuIHByb2plY3RWYWxpZGF0b3IocHJvamVjdCkgPyB1cGdyYWRlUHJvamVjdChwcm9qZWN0KSA6IG51bGxcbn1cblxuY29uc3QgZ2V0UHJvamVjdEltYWdlID0gYXN5bmMgKGZpbGVuYW1lOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgZmlsZW5hbWVJbmZvID0gcGF0aC5wYXJzZShmaWxlbmFtZSlcbiAgY29uc3QgaW1hZ2UgPSBwYXRoLmZvcm1hdCh7XG4gICAgLi4uZmlsZW5hbWVJbmZvLFxuICAgIGRpcjogcmVzb2x2ZSgncHVibGljL3Byb2plY3RzLycpLFxuICAgIGJhc2U6IHVuZGVmaW5lZCxcbiAgICBleHQ6ICcucG5nJ1xuICB9KVxuICB0cnkge1xuICAgIGF3YWl0IGZzLmFjY2VzcyhpbWFnZSwgZnMuY29uc3RhbnRzLlJfT0spXG4gICAgcmV0dXJuIGJhc2VuYW1lKGltYWdlKVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG5jb25zdCByZWFkUHJvamVjdCA9IGFzeW5jIChmaWxlbmFtZTogc3RyaW5nKTogUHJvbWlzZTxQcm9qZWN0V2l0aEZpbGVuYW1lIHwgbnVsbD4gPT4ge1xuICBjb25zdCBwcm9qZWN0ID0gcGFyc2VQcm9qZWN0KGF3YWl0IHJlYWRKc29uKGZpbGVuYW1lKSlcbiAgaWYgKHByb2plY3QgPT0gbnVsbCkge1xuICAgIGNvbnNvbGUubG9nKGJhc2VuYW1lKGZpbGVuYW1lKSlcbiAgICBwcm9qZWN0VmFsaWRhdG9yLmVycm9yc1xuICAgICAgPy5tYXAoZSA9PiBgICAke2UuaW5zdGFuY2VQYXRofS8gJHtlLm1lc3NhZ2V9YClcbiAgICAgID8uZm9yRWFjaCgoZSkgPT4gY29uc29sZS5sb2coZSkpXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGNvbnN0IGhhc2ggPSBoYXNoSnNvbihbXG4gICAgcHJvamVjdC5jb2RlLFxuICAgIHByb2plY3QucGFydHMsXG4gIF0pXG4gIGNvbnN0IHVwZGF0ZWQgPSBoYXNoID09IHByb2plY3QuaGFzaCA/IHByb2plY3QudXBkYXRlZCA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICByZXR1cm4ge1xuICAgIC4uLnByb2plY3QsXG4gICAgZmlsZW5hbWU6IGJhc2VuYW1lKGZpbGVuYW1lKSxcbiAgICBpbWFnZTogYXdhaXQgZ2V0UHJvamVjdEltYWdlKGZpbGVuYW1lKSxcbiAgICBoYXNoLFxuICAgIHVwZGF0ZWQsXG4gIH1cbn1cblxuY29uc3QgcmVhZFByb2plY3RMaXN0ID0gYXN5bmMgKHByb2plY3RzRGlyOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgYWxsUHJvamVjdHMgPSBhd2FpdCBnbG9iKHJlc29sdmUocHJvamVjdHNEaXIsICcqLmpzb24nKSlcbiAgcmV0dXJuIGF3YWl0IFByb21pc2VcbiAgICAuYWxsKGFsbFByb2plY3RzLm1hcChyZWFkUHJvamVjdCkpXG4gICAgLnRoZW4oZSA9PiBlLmZpbHRlcigoZSk6IGUgaXMgUHJvamVjdFdpdGhGaWxlbmFtZSA9PiBlICE9IG51bGwpKVxufVxuXG5pbnRlcmZhY2UgUHJvamVjdHNCdWlsZGVyT3B0aW9ucyB7XG4gIHByb2plY3RzRGlyOiBzdHJpbmdcbiAgcHJvamVjdHNGaWxlbmFtZTogc3RyaW5nXG59XG5cbmNvbnN0IHByb2plY3RzQnVpbGRlciA9ICh7IHByb2plY3RzRGlyLCBwcm9qZWN0c0ZpbGVuYW1lIH06IFByb2plY3RzQnVpbGRlck9wdGlvbnMpOiBQbHVnaW5PcHRpb24gPT4ge1xuICBsZXQgdml0ZUNvbmZpZzogUmVzb2x2ZWRDb25maWdcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2aXRlLXBsdWdpbi1idWlsZC1wcm9qZWN0cycsXG4gICAgY29uZmlnUmVzb2x2ZWQ6IChyZXNvbHZlZENvbmZpZykgPT4ge1xuICAgICAgdml0ZUNvbmZpZyA9IHJlc29sdmVkQ29uZmlnXG4gICAgfSxcbiAgICBhc3luYyB3cml0ZUJ1bmRsZSgpIHtcbiAgICAgIGNvbnN0IG91dERpciA9IHZpdGVDb25maWcuYnVpbGQub3V0RGlyXG4gICAgICBjb25zdCBwcm9qZWN0TGlzdCA9IGF3YWl0IHJlYWRQcm9qZWN0TGlzdChwcm9qZWN0c0RpcilcbiAgICAgIC8vIHdyaXRlIHByb2plY3RzLmpzb25cbiAgICAgIGF3YWl0IHdyaXRlSnNvbjxQcm9qZWN0SW5mb1tdPihyZXNvbHZlKG91dERpciwgcHJvamVjdHNGaWxlbmFtZSksIHByb2plY3RMaXN0Lm1hcChtYXBQcm9qZWN0SW5mbykpXG4gICAgICAvLyB3cml0ZSBhbGwgcHJvamVjdCBqc29uIGZpbGVzXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9qZWN0TGlzdC5tYXAoYXN5bmMgZSA9PiB7XG4gICAgICAgIGF3YWl0IHdyaXRlSnNvbjxQcm9qZWN0TGF0ZXN0PihyZXNvbHZlKG91dERpciwgcHJvamVjdHNEaXIsIGUuZmlsZW5hbWUpLCBtYXBQcm9qZWN0RG93bmxvYWQoZSkpXG4gICAgICB9KSlcbiAgICAgIC8vIHVwZGF0ZSBwcm9qZWN0IGZpbGVzXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9qZWN0TGlzdC5tYXAoYXN5bmMgKHsgZmlsZW5hbWUsIC4uLnByb2plY3QgfSkgPT4ge1xuICAgICAgICBhd2FpdCB3cml0ZUpzb248UHJvamVjdExhdGVzdE1ldGE+KHJlc29sdmUocHJvamVjdHNEaXIsIGZpbGVuYW1lKSwge1xuICAgICAgICAgIHByb2plY3RJZDogcHJvamVjdC5wcm9qZWN0SWQsXG4gICAgICAgICAgbmFtZTogcHJvamVjdC5uYW1lLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBwcm9qZWN0LmRlc2NyaXB0aW9uLFxuICAgICAgICAgIGFydGlzdDogcHJvamVjdC5hcnRpc3QsXG4gICAgICAgICAgaW5mbzogcHJvamVjdC5pbmZvLFxuICAgICAgICAgIHdlYnNpdGU6IHByb2plY3Qud2Vic2l0ZSxcbiAgICAgICAgICBjYXJkc0xpbms6IHByb2plY3QuY2FyZHNMaW5rLFxuICAgICAgICAgIHNjZW5hcmlvQ291bnQ6IHByb2plY3Quc2NlbmFyaW9Db3VudCxcbiAgICAgICAgICBpbnZlc3RpZ2F0b3JDb3VudDogcHJvamVjdC5pbnZlc3RpZ2F0b3JDb3VudCxcbiAgICAgICAgICBhdXRob3JzOiBwcm9qZWN0LmF1dGhvcnMsXG4gICAgICAgICAgc3RhdHVzZXM6IHByb2plY3Quc3RhdHVzZXMsXG4gICAgICAgICAgdGFnczogcHJvamVjdC50YWdzLFxuICAgICAgICAgIGxhbmc6IHByb2plY3QubGFuZyxcbiAgICAgICAgICBjcmVhdGVkOiBwcm9qZWN0LmNyZWF0ZWQsXG4gICAgICAgICAgdXBkYXRlZDogcHJvamVjdC51cGRhdGVkLFxuICAgICAgICAgIHZlcnNpb246IHByb2plY3QudmVyc2lvbixcbiAgICAgICAgICBjb2RlOiBwcm9qZWN0LmNvZGUsXG4gICAgICAgICAgcGFydHM6IHByb2plY3QucGFydHMsXG4gICAgICAgICAgaGFzaDogcHJvamVjdC5oYXNoLFxuICAgICAgICB9LCAyKVxuICAgICAgfSkpXG4gICAgfSxcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICBpZiAocmVxLnVybCA9PSBgLyR7cHJvamVjdHNGaWxlbmFtZX1gKSB7XG4gICAgICAgICAgLy8gL3Byb2plY3RzLmpzb25cbiAgICAgICAgICBjb25zdCBwcm9qZWN0TGlzdCA9IGF3YWl0IHJlYWRQcm9qZWN0TGlzdChwcm9qZWN0c0RpcilcbiAgICAgICAgICBjb25zdCBwcm9qZWN0c0pzb24gPSBwcm9qZWN0TGlzdC5tYXAobWFwUHJvamVjdEluZm8pXG4gICAgICAgICAgcmV0dXJuIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgIH0pLmVuZChKU09OLnN0cmluZ2lmeShwcm9qZWN0c0pzb24pKVxuXG4gICAgICAgIH0gZWxzZSBpZiAocmVxLnVybD8uc3RhcnRzV2l0aChgL3Byb2plY3RzL2ApKSB7XG4gICAgICAgICAgLy8gL3Byb2plY3RzLyouanNvblxuICAgICAgICAgIGlmIChyZXEudXJsLmVuZHNXaXRoKCcuanNvbicpKSB7XG4gICAgICAgICAgICBjb25zdCBmaWxlbmFtZSA9IGRlY29kZVVSSShyZXEudXJsLnNwbGl0KCcvJykucG9wKCkgPz8gJycpXG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0ID0gYXdhaXQgcmVhZFByb2plY3QocmVzb2x2ZShwcm9qZWN0c0RpciwgZmlsZW5hbWUpKVxuICAgICAgICAgICAgaWYgKHByb2plY3QgPT0gdW5kZWZpbmVkKSByZXR1cm4gbmV4dCgpXG5cbiAgICAgICAgICAgIHJldHVybiByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgfSkuZW5kKEpTT04uc3RyaW5naWZ5KG1hcFByb2plY3REb3dubG9hZChwcm9qZWN0KSkpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXh0KClcbiAgICAgIH0pXG4gICAgfSxcbiAgICBoYW5kbGVIb3RVcGRhdGU6ICh7IGZpbGUsIHNlcnZlciB9KSA9PiB7XG4gICAgICBpZiAoaXNQcm9qZWN0RmlsZShwcm9qZWN0c0RpciwgcmVsYXRpdmUodml0ZUNvbmZpZy5lbnZEaXIsIGZpbGUpKSkge1xuICAgICAgICBjb25zb2xlLmxvZyhgUHJvamVjdCBjaGFuZ2VkOiAke2ZpbGV9LiBSZWxvYWRpbmdgKVxuICAgICAgICBzZXJ2ZXIud3Muc2VuZCh7XG4gICAgICAgICAgdHlwZTogJ2Z1bGwtcmVsb2FkJyxcbiAgICAgICAgICBwYXRoOiAnKicsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBwcm9qZWN0c0J1aWxkZXJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2tlbGxleS9naXR3ZWIvbXBjLXByb2plY3RzL3ZpdGUtcGx1Z2luLXByb2plY3QtYnVpbGRlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2tlbGxleS9naXR3ZWIvbXBjLXByb2plY3RzL3ZpdGUtcGx1Z2luLXByb2plY3QtYnVpbGRlci91dGlsLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9rZWxsZXkvZ2l0d2ViL21wYy1wcm9qZWN0cy92aXRlLXBsdWdpbi1wcm9qZWN0LWJ1aWxkZXIvdXRpbC50c1wiO2ltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJ1xuaW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMvcHJvbWlzZXMnXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXG5cblxuZXhwb3J0IGNvbnN0IHJlYWRKc29uID0gYXN5bmMgKGZpbGVuYW1lOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgZnMucmVhZEZpbGUoZmlsZW5hbWUsICd1dGYtOCcpKVxufVxuXG5leHBvcnQgY29uc3Qgd3JpdGVKc29uID0gYXN5bmMgPFQ+KGZpbGVuYW1lOiBzdHJpbmcsIHZhbHVlOiBULCBpbmRlbnQ/OiBudW1iZXIpID0+IHtcbiAgcmV0dXJuIGZzLndyaXRlRmlsZShmaWxlbmFtZSwgSlNPTi5zdHJpbmdpZnkodmFsdWUsIHVuZGVmaW5lZCwgaW5kZW50KSwgJ3V0Zi04Jylcbn1cblxuZXhwb3J0IGNvbnN0IGhhc2hKc29uID0gKHZhbHVlOiB1bmtub3duKSA9PiB7XG4gIGNvbnN0IGhhc2hTdW0gPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2JylcbiAgaGFzaFN1bS51cGRhdGUoSlNPTi5zdHJpbmdpZnkodmFsdWUpKVxuICByZXR1cm4gaGFzaFN1bS5kaWdlc3QoJ2hleCcpXG59XG5cbmV4cG9ydCBjb25zdCBpc1Byb2plY3RGaWxlID0gKHByb2plY3RzRGlyOiBzdHJpbmcsIGZpbGU6IHN0cmluZykgPT4ge1xuICBpZiAocGF0aC5leHRuYW1lKGZpbGUpICE9ICcuanNvbicpIHJldHVybiBmYWxzZVxuXG4gIHJldHVybiBmaWxlID09IHBhdGguam9pbihwcm9qZWN0c0RpciwgcGF0aC5iYXNlbmFtZShmaWxlKSlcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2tlbGxleS9naXR3ZWIvbXBjLXByb2plY3RzL3ZpdGUtcGx1Z2luLXByb2plY3QtYnVpbGRlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2tlbGxleS9naXR3ZWIvbXBjLXByb2plY3RzL3ZpdGUtcGx1Z2luLXByb2plY3QtYnVpbGRlci92YWxpZGF0aW9uLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9rZWxsZXkvZ2l0d2ViL21wYy1wcm9qZWN0cy92aXRlLXBsdWdpbi1wcm9qZWN0LWJ1aWxkZXIvdmFsaWRhdGlvbi50c1wiO2ltcG9ydCBBanYsIHsgSlNPTlNjaGVtYVR5cGUgfSBmcm9tICdhanYnXG5pbXBvcnQgeyBDYXJkLCBDYXJkRmFjZSwgUGFydE1ldGEsIFByb2plY3RWMU1ldGEsIFByb2plY3RWMk1ldGEgfSBmcm9tICcuL3R5cGVzJ1xuXG5cbmNvbnN0IGNhcmRGYWNlU2NoZW1hOiBKU09OU2NoZW1hVHlwZTxDYXJkRmFjZT4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgTmFtZTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgIElEOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgU291cmNlSUQ6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICBFeHA6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICBXaWR0aDogeyB0eXBlOiAnbnVtYmVyJyB9LFxuICAgIEhlaWdodDogeyB0eXBlOiAnbnVtYmVyJyB9LFxuICB9LFxuICByZXF1aXJlZDogW1xuICAgICdOYW1lJyxcbiAgICAnSUQnLFxuICAgICdTb3VyY2VJRCcsXG4gICAgJ0V4cCcsXG4gICAgJ1dpZHRoJyxcbiAgICAnSGVpZ2h0JyxcbiAgXVxufVxuXG5jb25zdCBjYXJkU2NoZW1hOiBKU09OU2NoZW1hVHlwZTxDYXJkPiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBjb3VudDogeyB0eXBlOiAnbnVtYmVyJyB9LFxuICAgIGZyb250OiB7IC4uLmNhcmRGYWNlU2NoZW1hLCBudWxsYWJsZTogdHJ1ZSB9LFxuICAgIGJhY2s6IHsgLi4uY2FyZEZhY2VTY2hlbWEsIG51bGxhYmxlOiB0cnVlIH0sXG4gIH0sXG4gIHJlcXVpcmVkOiBbXG4gICAgJ2NvdW50JyxcbiAgXSxcbn1cblxuY29uc3QgcGFydFNjaGVtYTogSlNPTlNjaGVtYVR5cGU8UGFydE1ldGE+ID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIGtleTogeyB0eXBlOiAnbnVtYmVyJyB9LFxuICAgIGVuYWJsZWQ6IHsgdHlwZTogJ2Jvb2xlYW4nLCBudWxsYWJsZTogdHJ1ZSB9LFxuICAgIG5hbWU6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICBjYXJkczogeyB0eXBlOiAnYXJyYXknLCBpdGVtczogY2FyZFNjaGVtYSB9LFxuICB9LFxuICByZXF1aXJlZDogW1xuICAgICduYW1lJyxcbiAgICAnY2FyZHMnLFxuICBdLFxufVxuXG5jb25zdCBwcm9qZWN0VjFTY2hlbWE6IEpTT05TY2hlbWFUeXBlPFByb2plY3RWMU1ldGE+ID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIHByb2plY3RJZDogeyB0eXBlOiAnYXJyYXknLCBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9IH0sXG4gICAgbmFtZTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgIGRlc2NyaXB0aW9uOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgaW1hZ2U6IHsgdHlwZTogJ3N0cmluZycsIG51bGxhYmxlOiB0cnVlIH0sXG4gICAgYXJ0aXN0OiB7IHR5cGU6ICdzdHJpbmcnLCBudWxsYWJsZTogdHJ1ZSB9LFxuICAgIGluZm86IHsgdHlwZTogJ3N0cmluZycsIG51bGxhYmxlOiB0cnVlIH0sXG4gICAgd2Vic2l0ZTogeyB0eXBlOiAnc3RyaW5nJywgbnVsbGFibGU6IHRydWUgfSxcbiAgICBjYXJkc0xpbms6IHt0eXBlOiAnc3RyaW5nJywgbnVsbGFibGU6IHRydWUgfSxcbiAgICBhdXRob3JzOiB7IHR5cGU6ICdhcnJheScsIGl0ZW1zOiB7IHR5cGU6ICdzdHJpbmcnIH0gfSxcbiAgICB0YWdzOiB7IHR5cGU6ICdhcnJheScsIGl0ZW1zOiB7IHR5cGU6ICdzdHJpbmcnIH0gfSxcbiAgICBzdGF0dXNlczogeyB0eXBlOiAnYXJyYXknLCBpdGVtczogeyB0eXBlOiAnc3RyaW5nJ30gfSxcbiAgICBsYW5nOiB7IHR5cGU6ICdzdHJpbmcnLCBudWxsYWJsZTogdHJ1ZSB9LFxuICAgIGNyZWF0ZWQ6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICB1cGRhdGVkOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgaGFzaDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgIHZlcnNpb246IHsgdHlwZTogJ251bWJlcicsIGNvbnN0OiAxIH0sXG4gICAgY29kZTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgIGNhcmRzOiB7IHR5cGU6ICdhcnJheScsIGl0ZW1zOiBjYXJkU2NoZW1hIH0sXG4gIH0sXG4gIHJlcXVpcmVkOiBbXG4gICAgJ3Byb2plY3RJZCcsXG4gICAgJ25hbWUnLFxuICAgICdkZXNjcmlwdGlvbicsXG4gICAgJ2F1dGhvcnMnLFxuICAgICd0YWdzJyxcbiAgICAnc3RhdHVzZXMnLFxuICAgICdjcmVhdGVkJyxcbiAgICAndXBkYXRlZCcsXG4gICAgJ2hhc2gnLFxuICAgICd2ZXJzaW9uJyxcbiAgICAnY29kZScsXG4gICAgJ2NhcmRzJyxcbiAgXVxufVxuXG5jb25zdCBwcm9qZWN0VjJTY2hlbWE6IEpTT05TY2hlbWFUeXBlPFByb2plY3RWMk1ldGE+ID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIHByb2plY3RJZDogeyB0eXBlOiAnYXJyYXknLCBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9IH0sXG4gICAgbmFtZTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgIGRlc2NyaXB0aW9uOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgaW1hZ2U6IHsgdHlwZTogJ3N0cmluZycsIG51bGxhYmxlOiB0cnVlIH0sXG4gICAgYXJ0aXN0OiB7IHR5cGU6ICdzdHJpbmcnLCBudWxsYWJsZTogdHJ1ZSB9LFxuICAgIGluZm86IHsgdHlwZTogJ3N0cmluZycsIG51bGxhYmxlOiB0cnVlIH0sXG4gICAgd2Vic2l0ZTogeyB0eXBlOiAnc3RyaW5nJywgbnVsbGFibGU6IHRydWUgfSxcbiAgICBjYXJkc0xpbms6IHsgdHlwZTogJ3N0cmluZycsIG51bGxhYmxlOiB0cnVlIH0sXG4gICAgc2NlbmFyaW9Db3VudDogeyB0eXBlOiAnbnVtYmVyJyB9LFxuICAgIGludmVzdGlnYXRvckNvdW50OiB7IHR5cGU6ICdudW1iZXInIH0sXG4gICAgYXV0aG9yczogeyB0eXBlOiAnYXJyYXknLCBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9IH0sXG4gICAgdGFnczogeyB0eXBlOiAnYXJyYXknLCBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9IH0sXG4gICAgc3RhdHVzZXM6IHsgdHlwZTogJ2FycmF5JywgaXRlbXM6IHsgdHlwZTogJ3N0cmluZyd9IH0sXG4gICAgbGFuZzogeyB0eXBlOiAnc3RyaW5nJywgbnVsbGFibGU6IHRydWUgfSxcbiAgICBjcmVhdGVkOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgdXBkYXRlZDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgIGhhc2g6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICB2ZXJzaW9uOiB7IHR5cGU6ICdudW1iZXInLCBjb25zdDogMiB9LFxuICAgIGNvZGU6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICBwYXJ0czogeyB0eXBlOiAnYXJyYXknLCBpdGVtczogcGFydFNjaGVtYSB9LFxuICB9LFxuICByZXF1aXJlZDogW1xuICAgICdwcm9qZWN0SWQnLFxuICAgICduYW1lJyxcbiAgICAnZGVzY3JpcHRpb24nLFxuICAgICdhdXRob3JzJyxcbiAgICAndGFncycsXG4gICAgJ3N0YXR1c2VzJyxcbiAgICAnY3JlYXRlZCcsXG4gICAgJ3VwZGF0ZWQnLFxuICAgICdoYXNoJyxcbiAgICAndmVyc2lvbicsXG4gICAgJ2NvZGUnLFxuICAgICdwYXJ0cycsXG4gIF1cbn1cblxuY29uc3QgcHJvamVjdFNjaGVtYTogSlNPTlNjaGVtYVR5cGU8UHJvamVjdFYxTWV0YSB8IFByb2plY3RWMk1ldGE+ID0ge1xuICBvbmVPZjogW1xuICAgIHByb2plY3RWMVNjaGVtYSxcbiAgICBwcm9qZWN0VjJTY2hlbWEsXG4gIF1cbn1cblxuY29uc3QgYWp2ID0gbmV3IEFqdih7XG4gIHJlbW92ZUFkZGl0aW9uYWw6ICdhbGwnLFxufSlcbmNvbnN0IHByb2plY3RWYWxpZGF0b3IgPSBhanYuY29tcGlsZShwcm9qZWN0U2NoZW1hKVxuZXhwb3J0IGRlZmF1bHQgcHJvamVjdFZhbGlkYXRvclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxUixPQUFPLFdBQVc7QUFDdlMsT0FBT0EsV0FBVTtBQUNqQixTQUFTLG9CQUFvQjs7O0FDRmdVLFNBQVMsWUFBWTtBQUNsWCxPQUFPQyxTQUFRO0FBRWYsT0FBT0MsU0FBUSxVQUFVLFVBQVUsZUFBZTs7O0FDSHlTLE9BQU8sWUFBWTtBQUM5VyxPQUFPLFFBQVE7QUFDZixPQUFPLFVBQVU7QUFHVixJQUFNLFdBQVcsT0FBTyxhQUFxQjtBQUNsRCxTQUFPLEtBQUssTUFBTSxNQUFNLEdBQUcsU0FBUyxVQUFVLE9BQU8sQ0FBQztBQUN4RDtBQUVPLElBQU0sWUFBWSxPQUFVLFVBQWtCLE9BQVUsV0FBb0I7QUFDakYsU0FBTyxHQUFHLFVBQVUsVUFBVSxLQUFLLFVBQVUsT0FBTyxRQUFXLE1BQU0sR0FBRyxPQUFPO0FBQ2pGO0FBRU8sSUFBTSxXQUFXLENBQUMsVUFBbUI7QUFDMUMsUUFBTSxVQUFVLE9BQU8sV0FBVyxRQUFRO0FBQzFDLFVBQVEsT0FBTyxLQUFLLFVBQVUsS0FBSyxDQUFDO0FBQ3BDLFNBQU8sUUFBUSxPQUFPLEtBQUs7QUFDN0I7QUFFTyxJQUFNLGdCQUFnQixDQUFDLGFBQXFCLFNBQWlCO0FBQ2xFLE1BQUksS0FBSyxRQUFRLElBQUksS0FBSztBQUFTLFdBQU87QUFFMUMsU0FBTyxRQUFRLEtBQUssS0FBSyxhQUFhLEtBQUssU0FBUyxJQUFJLENBQUM7QUFDM0Q7OztBQ3ZCdVcsT0FBTyxTQUE2QjtBQUkzWSxJQUFNLGlCQUEyQztBQUFBLEVBQy9DLE1BQU07QUFBQSxFQUNOLFlBQVk7QUFBQSxJQUNWLE1BQU0sRUFBRSxNQUFNLFNBQVM7QUFBQSxJQUN2QixJQUFJLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDckIsVUFBVSxFQUFFLE1BQU0sU0FBUztBQUFBLElBQzNCLEtBQUssRUFBRSxNQUFNLFNBQVM7QUFBQSxJQUN0QixPQUFPLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDeEIsUUFBUSxFQUFFLE1BQU0sU0FBUztBQUFBLEVBQzNCO0FBQUEsRUFDQSxVQUFVO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTSxhQUFtQztBQUFBLEVBQ3ZDLE1BQU07QUFBQSxFQUNOLFlBQVk7QUFBQSxJQUNWLE9BQU8sRUFBRSxNQUFNLFNBQVM7QUFBQSxJQUN4QixPQUFPLEVBQUUsR0FBRyxnQkFBZ0IsVUFBVSxLQUFLO0FBQUEsSUFDM0MsTUFBTSxFQUFFLEdBQUcsZ0JBQWdCLFVBQVUsS0FBSztBQUFBLEVBQzVDO0FBQUEsRUFDQSxVQUFVO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFDRjtBQUVBLElBQU0sYUFBdUM7QUFBQSxFQUMzQyxNQUFNO0FBQUEsRUFDTixZQUFZO0FBQUEsSUFDVixLQUFLLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDdEIsU0FBUyxFQUFFLE1BQU0sV0FBVyxVQUFVLEtBQUs7QUFBQSxJQUMzQyxNQUFNLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDdkIsT0FBTyxFQUFFLE1BQU0sU0FBUyxPQUFPLFdBQVc7QUFBQSxFQUM1QztBQUFBLEVBQ0EsVUFBVTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTSxrQkFBaUQ7QUFBQSxFQUNyRCxNQUFNO0FBQUEsRUFDTixZQUFZO0FBQUEsSUFDVixXQUFXLEVBQUUsTUFBTSxTQUFTLE9BQU8sRUFBRSxNQUFNLFNBQVMsRUFBRTtBQUFBLElBQ3RELE1BQU0sRUFBRSxNQUFNLFNBQVM7QUFBQSxJQUN2QixhQUFhLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDOUIsT0FBTyxFQUFFLE1BQU0sVUFBVSxVQUFVLEtBQUs7QUFBQSxJQUN4QyxRQUFRLEVBQUUsTUFBTSxVQUFVLFVBQVUsS0FBSztBQUFBLElBQ3pDLE1BQU0sRUFBRSxNQUFNLFVBQVUsVUFBVSxLQUFLO0FBQUEsSUFDdkMsU0FBUyxFQUFFLE1BQU0sVUFBVSxVQUFVLEtBQUs7QUFBQSxJQUMxQyxXQUFXLEVBQUMsTUFBTSxVQUFVLFVBQVUsS0FBSztBQUFBLElBQzNDLFNBQVMsRUFBRSxNQUFNLFNBQVMsT0FBTyxFQUFFLE1BQU0sU0FBUyxFQUFFO0FBQUEsSUFDcEQsTUFBTSxFQUFFLE1BQU0sU0FBUyxPQUFPLEVBQUUsTUFBTSxTQUFTLEVBQUU7QUFBQSxJQUNqRCxVQUFVLEVBQUUsTUFBTSxTQUFTLE9BQU8sRUFBRSxNQUFNLFNBQVEsRUFBRTtBQUFBLElBQ3BELE1BQU0sRUFBRSxNQUFNLFVBQVUsVUFBVSxLQUFLO0FBQUEsSUFDdkMsU0FBUyxFQUFFLE1BQU0sU0FBUztBQUFBLElBQzFCLFNBQVMsRUFBRSxNQUFNLFNBQVM7QUFBQSxJQUMxQixNQUFNLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDdkIsU0FBUyxFQUFFLE1BQU0sVUFBVSxPQUFPLEVBQUU7QUFBQSxJQUNwQyxNQUFNLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDdkIsT0FBTyxFQUFFLE1BQU0sU0FBUyxPQUFPLFdBQVc7QUFBQSxFQUM1QztBQUFBLEVBQ0EsVUFBVTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDRjtBQUVBLElBQU0sa0JBQWlEO0FBQUEsRUFDckQsTUFBTTtBQUFBLEVBQ04sWUFBWTtBQUFBLElBQ1YsV0FBVyxFQUFFLE1BQU0sU0FBUyxPQUFPLEVBQUUsTUFBTSxTQUFTLEVBQUU7QUFBQSxJQUN0RCxNQUFNLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDdkIsYUFBYSxFQUFFLE1BQU0sU0FBUztBQUFBLElBQzlCLE9BQU8sRUFBRSxNQUFNLFVBQVUsVUFBVSxLQUFLO0FBQUEsSUFDeEMsUUFBUSxFQUFFLE1BQU0sVUFBVSxVQUFVLEtBQUs7QUFBQSxJQUN6QyxNQUFNLEVBQUUsTUFBTSxVQUFVLFVBQVUsS0FBSztBQUFBLElBQ3ZDLFNBQVMsRUFBRSxNQUFNLFVBQVUsVUFBVSxLQUFLO0FBQUEsSUFDMUMsV0FBVyxFQUFFLE1BQU0sVUFBVSxVQUFVLEtBQUs7QUFBQSxJQUM1QyxlQUFlLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDaEMsbUJBQW1CLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDcEMsU0FBUyxFQUFFLE1BQU0sU0FBUyxPQUFPLEVBQUUsTUFBTSxTQUFTLEVBQUU7QUFBQSxJQUNwRCxNQUFNLEVBQUUsTUFBTSxTQUFTLE9BQU8sRUFBRSxNQUFNLFNBQVMsRUFBRTtBQUFBLElBQ2pELFVBQVUsRUFBRSxNQUFNLFNBQVMsT0FBTyxFQUFFLE1BQU0sU0FBUSxFQUFFO0FBQUEsSUFDcEQsTUFBTSxFQUFFLE1BQU0sVUFBVSxVQUFVLEtBQUs7QUFBQSxJQUN2QyxTQUFTLEVBQUUsTUFBTSxTQUFTO0FBQUEsSUFDMUIsU0FBUyxFQUFFLE1BQU0sU0FBUztBQUFBLElBQzFCLE1BQU0sRUFBRSxNQUFNLFNBQVM7QUFBQSxJQUN2QixTQUFTLEVBQUUsTUFBTSxVQUFVLE9BQU8sRUFBRTtBQUFBLElBQ3BDLE1BQU0sRUFBRSxNQUFNLFNBQVM7QUFBQSxJQUN2QixPQUFPLEVBQUUsTUFBTSxTQUFTLE9BQU8sV0FBVztBQUFBLEVBQzVDO0FBQUEsRUFDQSxVQUFVO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTSxnQkFBK0Q7QUFBQSxFQUNuRSxPQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFNLE1BQU0sSUFBSSxJQUFJO0FBQUEsRUFDbEIsa0JBQWtCO0FBQ3BCLENBQUM7QUFDRCxJQUFNLG1CQUFtQixJQUFJLFFBQVEsYUFBYTtBQUNsRCxJQUFPLHFCQUFROzs7QUY3SGYsSUFBTSxpQkFBaUIsQ0FBQyxPQUF5QztBQUFBLEVBQy9ELFVBQVUsRUFBRTtBQUFBLEVBQ1osTUFBTSxFQUFFO0FBQUEsRUFDUixhQUFhLEVBQUU7QUFBQSxFQUNmLE9BQU8sRUFBRSxTQUFTO0FBQUEsRUFDbEIsUUFBUSxFQUFFLFVBQVU7QUFBQSxFQUNwQixNQUFNLEVBQUUsUUFBUTtBQUFBLEVBQ2hCLFNBQVMsRUFBRSxXQUFXO0FBQUEsRUFDdEIsV0FBVyxFQUFFLGFBQWE7QUFBQSxFQUMxQixlQUFlLEVBQUUsaUJBQWlCO0FBQUEsRUFDbEMsbUJBQW1CLEVBQUUscUJBQXFCO0FBQUEsRUFDMUMsU0FBUyxFQUFFO0FBQUEsRUFDWCxVQUFVLEVBQUU7QUFBQSxFQUNaLE1BQU0sRUFBRTtBQUFBLEVBQ1IsTUFBTSxFQUFFO0FBQUEsRUFDUixTQUFTLEVBQUU7QUFBQSxFQUNYLFNBQVMsRUFBRTtBQUFBLEVBQ1gsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFBQyxRQUFNO0FBQUEsSUFDdkIsU0FBU0EsR0FBRSxXQUFXO0FBQUEsSUFDdEIsTUFBTUEsR0FBRTtBQUFBLElBQ1IsT0FBT0EsR0FBRSxNQUFNLE9BQU8sQ0FBQyxPQUFPLFNBQVMsUUFBUSxLQUFLLE9BQU8sQ0FBQztBQUFBLEVBQzlELEVBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU0o7QUFFQSxJQUFNLHFCQUFxQixDQUFDLEVBQUUsU0FBUyxNQUFNLE1BQU0sT0FBMkM7QUFBQSxFQUM1RjtBQUFBLEVBQ0E7QUFBQSxFQUNBLE9BQU8sTUFBTSxJQUFJLFFBQU07QUFBQSxJQUNyQixNQUFNLEVBQUU7QUFBQSxJQUNSLE9BQU8sRUFBRTtBQUFBLEVBQ1gsRUFBRTtBQUNKO0FBRUEsSUFBTSxpQkFBaUIsQ0FBQyxZQUFpRDtBQUN2RSxNQUFJLFFBQVEsV0FBVyxHQUFHO0FBQ3hCLFVBQU0sRUFBRSxPQUFPLE1BQU0sR0FBRyxLQUFLLElBQUk7QUFDakMsV0FBTztBQUFBLE1BQ0wsR0FBRztBQUFBLE1BQ0g7QUFBQSxNQUNBLFNBQVM7QUFBQSxNQUNULE9BQU8sQ0FBQztBQUFBLFFBQ047QUFBQSxRQUNBO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFFQSxTQUFPO0FBQ1Q7QUFFQSxJQUFNLGVBQWUsQ0FBQyxZQUF3RDtBQUM1RSxTQUFPLG1CQUFpQixPQUFPLElBQUksZUFBZSxPQUFPLElBQUk7QUFDL0Q7QUFFQSxJQUFNLGtCQUFrQixPQUFPLGFBQXFCO0FBQ2xELFFBQU0sZUFBZUMsTUFBSyxNQUFNLFFBQVE7QUFDeEMsUUFBTSxRQUFRQSxNQUFLLE9BQU87QUFBQSxJQUN4QixHQUFHO0FBQUEsSUFDSCxLQUFLLFFBQVEsa0JBQWtCO0FBQUEsSUFDL0IsTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLEVBQ1AsQ0FBQztBQUNELE1BQUk7QUFDRixVQUFNQyxJQUFHLE9BQU8sT0FBT0EsSUFBRyxVQUFVLElBQUk7QUFDeEMsV0FBTyxTQUFTLEtBQUs7QUFBQSxFQUN2QixTQUFTLEdBQUc7QUFDVixXQUFPO0FBQUEsRUFDVDtBQUNGO0FBRUEsSUFBTSxjQUFjLE9BQU8sYUFBMEQ7QUFDbkYsUUFBTSxVQUFVLGFBQWEsTUFBTSxTQUFTLFFBQVEsQ0FBQztBQUNyRCxNQUFJLFdBQVcsTUFBTTtBQUNuQixZQUFRLElBQUksU0FBUyxRQUFRLENBQUM7QUFDOUIsdUJBQWlCLFFBQ2IsSUFBSSxPQUFLLEtBQUssRUFBRSxZQUFZLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FDNUMsUUFBUSxDQUFDLE1BQU0sUUFBUSxJQUFJLENBQUMsQ0FBQztBQUNqQyxXQUFPO0FBQUEsRUFDVDtBQUVBLFFBQU0sT0FBTyxTQUFTO0FBQUEsSUFDcEIsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLEVBQ1YsQ0FBQztBQUNELFFBQU0sVUFBVSxRQUFRLFFBQVEsT0FBTyxRQUFRLFdBQVUsb0JBQUksS0FBSyxHQUFFLFlBQVk7QUFDaEYsU0FBTztBQUFBLElBQ0wsR0FBRztBQUFBLElBQ0gsVUFBVSxTQUFTLFFBQVE7QUFBQSxJQUMzQixPQUFPLE1BQU0sZ0JBQWdCLFFBQVE7QUFBQSxJQUNyQztBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFNLGtCQUFrQixPQUFPLGdCQUF3QjtBQUNyRCxRQUFNLGNBQWMsTUFBTSxLQUFLLFFBQVEsYUFBYSxRQUFRLENBQUM7QUFDN0QsU0FBTyxNQUFNLFFBQ1YsSUFBSSxZQUFZLElBQUksV0FBVyxDQUFDLEVBQ2hDLEtBQUssT0FBSyxFQUFFLE9BQU8sQ0FBQ0YsT0FBZ0NBLE1BQUssSUFBSSxDQUFDO0FBQ25FO0FBT0EsSUFBTSxrQkFBa0IsQ0FBQyxFQUFFLGFBQWEsaUJBQWlCLE1BQTRDO0FBQ25HLE1BQUk7QUFFSixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixnQkFBZ0IsQ0FBQyxtQkFBbUI7QUFDbEMsbUJBQWE7QUFBQSxJQUNmO0FBQUEsSUFDQSxNQUFNLGNBQWM7QUFDbEIsWUFBTSxTQUFTLFdBQVcsTUFBTTtBQUNoQyxZQUFNLGNBQWMsTUFBTSxnQkFBZ0IsV0FBVztBQUVyRCxZQUFNLFVBQXlCLFFBQVEsUUFBUSxnQkFBZ0IsR0FBRyxZQUFZLElBQUksY0FBYyxDQUFDO0FBRWpHLFlBQU0sUUFBUSxJQUFJLFlBQVksSUFBSSxPQUFNLE1BQUs7QUFDM0MsY0FBTSxVQUF5QixRQUFRLFFBQVEsYUFBYSxFQUFFLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO0FBQUEsTUFDaEcsQ0FBQyxDQUFDO0FBRUYsWUFBTSxRQUFRLElBQUksWUFBWSxJQUFJLE9BQU8sRUFBRSxVQUFVLEdBQUcsUUFBUSxNQUFNO0FBQ3BFLGNBQU0sVUFBNkIsUUFBUSxhQUFhLFFBQVEsR0FBRztBQUFBLFVBQ2pFLFdBQVcsUUFBUTtBQUFBLFVBQ25CLE1BQU0sUUFBUTtBQUFBLFVBQ2QsYUFBYSxRQUFRO0FBQUEsVUFDckIsUUFBUSxRQUFRO0FBQUEsVUFDaEIsTUFBTSxRQUFRO0FBQUEsVUFDZCxTQUFTLFFBQVE7QUFBQSxVQUNqQixXQUFXLFFBQVE7QUFBQSxVQUNuQixlQUFlLFFBQVE7QUFBQSxVQUN2QixtQkFBbUIsUUFBUTtBQUFBLFVBQzNCLFNBQVMsUUFBUTtBQUFBLFVBQ2pCLFVBQVUsUUFBUTtBQUFBLFVBQ2xCLE1BQU0sUUFBUTtBQUFBLFVBQ2QsTUFBTSxRQUFRO0FBQUEsVUFDZCxTQUFTLFFBQVE7QUFBQSxVQUNqQixTQUFTLFFBQVE7QUFBQSxVQUNqQixTQUFTLFFBQVE7QUFBQSxVQUNqQixNQUFNLFFBQVE7QUFBQSxVQUNkLE9BQU8sUUFBUTtBQUFBLFVBQ2YsTUFBTSxRQUFRO0FBQUEsUUFDaEIsR0FBRyxDQUFDO0FBQUEsTUFDTixDQUFDLENBQUM7QUFBQSxJQUNKO0FBQUEsSUFDQSxnQkFBZ0IsUUFBUTtBQUN0QixhQUFPLFlBQVksSUFBSSxPQUFPLEtBQUssS0FBSyxTQUFTO0FBQy9DLFlBQUksSUFBSSxPQUFPLElBQUksZ0JBQWdCLElBQUk7QUFFckMsZ0JBQU0sY0FBYyxNQUFNLGdCQUFnQixXQUFXO0FBQ3JELGdCQUFNLGVBQWUsWUFBWSxJQUFJLGNBQWM7QUFDbkQsaUJBQU8sSUFBSSxVQUFVLEtBQUs7QUFBQSxZQUN4QixnQkFBZ0I7QUFBQSxVQUNsQixDQUFDLEVBQUUsSUFBSSxLQUFLLFVBQVUsWUFBWSxDQUFDO0FBQUEsUUFFckMsV0FBVyxJQUFJLEtBQUssV0FBVyxZQUFZLEdBQUc7QUFFNUMsY0FBSSxJQUFJLElBQUksU0FBUyxPQUFPLEdBQUc7QUFDN0Isa0JBQU0sV0FBVyxVQUFVLElBQUksSUFBSSxNQUFNLEdBQUcsRUFBRSxJQUFJLEtBQUssRUFBRTtBQUN6RCxrQkFBTSxVQUFVLE1BQU0sWUFBWSxRQUFRLGFBQWEsUUFBUSxDQUFDO0FBQ2hFLGdCQUFJLFdBQVc7QUFBVyxxQkFBTyxLQUFLO0FBRXRDLG1CQUFPLElBQUksVUFBVSxLQUFLO0FBQUEsY0FDeEIsZ0JBQWdCO0FBQUEsWUFDbEIsQ0FBQyxFQUFFLElBQUksS0FBSyxVQUFVLG1CQUFtQixPQUFPLENBQUMsQ0FBQztBQUFBLFVBQ3BEO0FBQUEsUUFDRjtBQUNBLGVBQU8sS0FBSztBQUFBLE1BQ2QsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLGlCQUFpQixDQUFDLEVBQUUsTUFBTSxPQUFPLE1BQU07QUFDckMsVUFBSSxjQUFjLGFBQWEsU0FBUyxXQUFXLFFBQVEsSUFBSSxDQUFDLEdBQUc7QUFDakUsZ0JBQVEsSUFBSSxvQkFBb0IsSUFBSSxhQUFhO0FBQ2pELGVBQU8sR0FBRyxLQUFLO0FBQUEsVUFDYixNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsUUFDUixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLHNDQUFROzs7QUR6TWYsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLG9DQUFnQjtBQUFBLE1BQ2QsYUFBYUcsTUFBSyxLQUFLLFVBQVU7QUFBQSxNQUNqQyxrQkFBa0I7QUFBQSxJQUNwQixDQUFDO0FBQUEsRUFDSDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiLCAiZnMiLCAicGF0aCIsICJlIiwgInBhdGgiLCAiZnMiLCAicGF0aCJdCn0K
