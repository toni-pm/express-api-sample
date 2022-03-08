FROM node:16

MAINTAINER Toni Peraira <toniperairam@gmail.com>

# Environment variables.
ENV PORT=3000

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

# Application source code.
COPY . .

# Expose server port.
EXPOSE ${PORT}

CMD [ "yarn", "start" ]
