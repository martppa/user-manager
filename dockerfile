FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

ENV USING_DOCKER=1
ENV MONGO_DATABASE_URL=mongodb://mongo:27017/user
ENV PORT=2425
ENV BROKER_SERVER_URL=amqp://rabbitmq:5672

RUN npm set registry http://chikchak.ddns.net:4873

COPY ./package.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "npm", "start" ]