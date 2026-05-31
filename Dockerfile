FROM 559104660845.dkr.ecr.eu-west-1.amazonaws.com/node:24-alpine-patched AS build

WORKDIR /app

# Copy package files first so Docker can cache dependency installs.
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM 559104660845.dkr.ecr.eu-west-1.amazonaws.com/node:24-alpine-patched AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/dist ./dist
COPY --from=build /app/server.mjs ./server.mjs

USER node

EXPOSE 3000

CMD ["node", "server.mjs"]
