# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.11.0
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

# Stage 1: Install all dependencies including devDependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm i

# Stage 2: Build the app
FROM deps AS build
COPY . .
RUN npm run build

# Stage 3: Copy only what's needed for production
FROM base AS final

ENV NODE_ENV=production
USER node

COPY package.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public
# Optional:
COPY --from=build /usr/src/app/next.config.js ./ 

EXPOSE 3000
CMD ["npm", "start"]
