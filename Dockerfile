FROM node:22-alpine3.19 AS base

WORKDIR /app

FROM base AS deps

RUN apk add git

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

FROM deps AS dev_deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

FROM dev_deps AS build

COPY . .

RUN node --run build

FROM base AS shared

COPY package.json .

FROM shared AS dev

ENV NODE_ENV=development

RUN chown node:node .

USER node

COPY tsconfig.json .
COPY tsconfig.node.json .
COPY --from=dev_deps --chown=node /app/node_modules ./node_modules

VOLUME /bin
VOLUME /app/projects
VOLUME /app/public
VOLUME /app/src
VOLUME /app/vite-plugin-project-builder
VOLUME /app/index.html
VOLUME /app/vite.config.ts
VOLUME /app/vite.config.server.ts

CMD yarn dev

FROM shared AS prod

ENV NODE_ENV=production

USER node

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD node --run start
