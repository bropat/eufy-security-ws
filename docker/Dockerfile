FROM node:16-alpine as build
WORKDIR /tmp
COPY . .
RUN npm ci && npm run build

FROM node:16-alpine
WORKDIR /usr/src/app
COPY --from=build /tmp/dist ./dist
COPY --from=build /tmp/docker/run.sh ./run.sh
COPY --from=build /tmp/package.json ./package.json
COPY --from=build /tmp/package-lock.json ./package-lock.json
RUN apk add --no-cache jq \
  && npm ci --only=production
EXPOSE 3000
VOLUME ["/data"]
CMD [ "/usr/src/app/run.sh" ]
