FROM node:14

RUN mkdir /root/server
WORKDIR /root/server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENTRYPOINT node dist/main.js
