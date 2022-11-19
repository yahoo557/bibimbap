FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80 443
ENV NODE_ENV docker
ENTRYPOINT ["node", "client.js"]
