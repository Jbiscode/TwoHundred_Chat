FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g pm2
RUN pwd
RUN ls -al

COPY . .
RUN ls -al

EXPOSE 5000

# CMD [ "npm", "run","start" ]
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]