FROM node:lts-alpine3.19 as base

WORKDIR /app

FROM base as deps

RUN apk add git

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

FROM deps as dev_deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

FROM dev_deps as build

COPY . .

RUN yarn run build

FROM base as dev

ENV NODE_ENV=development

RUN chown node:node .

USER node

COPY bin/ ./bin/
COPY package.json .
COPY projects/ ./projects/
COPY public/ ./public
COPY src/ ./src/
COPY vite-plugin-project-builder/ ./vite-plugin-project-builder/
COPY index.html .
COPY vite.config.ts .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY --from=dev_deps --chown=node /app/node_modules ./node_modules/

CMD yarn build:schemas && yarn dev

FROM base as prod

ENV NODE_ENV=production

USER node

COPY package.json .
COPY --from=deps /app/node_modules ./node_modules/
COPY --from=build /app/dist ./dist/

CMD yarn start
