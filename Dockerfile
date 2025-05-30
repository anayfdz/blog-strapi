FROM node:18-alpine

# Instalar dependencias necesarias para Strapi y SQLite
RUN apk update && apk add --no-cache \
    build-base gcc autoconf automake zlib-dev \
    libpng-dev nasm bash vips-dev git sqlite

ENV NODE_ENV=production

# Instalar dependencias en /opt
WORKDIR /opt/
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
ENV PATH /opt/node_modules/.bin:$PATH

# Copiar el resto del proyecto a /opt/app
WORKDIR /opt/app
COPY . .

# Configuración de la base de datos SQLite
ENV DATABASE_CLIENT=sqlite
ENV DATABASE_FILENAME=/data/strapi.db

RUN mkdir -p /data && \
    chown -R node:node /data && \
    chown -R node:node /opt/app

USER node
RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]
