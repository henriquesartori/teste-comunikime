FROM node:16-alpine

WORKDIR /app
COPY package*.json /app

RUN npm install --legacy-peer-deps

COPY . /app

RUN npm run build

EXPOSE 3000

CMD npm run migrate:prod && npm run start