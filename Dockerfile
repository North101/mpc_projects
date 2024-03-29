FROM node:lts-alpine3.19 as base

WORKDIR /app

FROM base as deps

RUN apk add git

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

FROM deps as build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

COPY . .

RUN yarn run build

FROM base as dev

ENV NODE_ENV=development

RUN chown node:node .

USER node

COPY package.json .
COPY --from=build --chown=node /app/node_modules ./node_modules
COPY --from=build /app/projects ./projects
COPY --from=build /app/public ./public
COPY --from=build /app/src ./src
COPY --from=build /app/vite-plugin-project-builder ./vite-plugin-project-builder
COPY --from=build /app/index.html ./index.html
COPY --from=build /app/vite.config.ts ./vite.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/tsconfig.node.json ./tsconfig.node.json

CMD yarn dev

FROM base as prod

ENV NODE_ENV=production

USER node

COPY package.json .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD yarn start
