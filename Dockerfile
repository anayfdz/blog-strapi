FROM node:18-alpine
# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git sqlite
ENV NODE_ENV=production

WORKDIR /opt/
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
ENV PATH /opt/node_modules/.bin:$PATH



WORKDIR /opt/app
COPY . .

ENV DATABASE_CLIENT=postgres
ENV DATABASE_FILENAME=/data/postgres/data.db

RUN mkdir -p /data/postgres && \
    chown -R node:node /data && \
    chown -R node:node /opt/app
    
USER node
RUN yarn build
EXPOSE 1337
CMD ["yarn", "start"]