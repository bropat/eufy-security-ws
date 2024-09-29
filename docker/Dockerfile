FROM node:20-alpine3.18 AS build
WORKDIR /tmp
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine3.18 AS prod
WORKDIR /tmp_prod
COPY --from=build /tmp/dist ./dist
COPY --from=build /tmp/docker/run.sh ./run.sh
COPY --from=build /tmp/package.json ./package.json
COPY --from=build /tmp/package-lock.json ./package-lock.json
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=prod /tmp_prod ./
RUN apk add --no-cache jq
RUN apk add --no-cache bash
EXPOSE 3000
VOLUME ["/data"]
CMD [ "/usr/src/app/run.sh" ]
