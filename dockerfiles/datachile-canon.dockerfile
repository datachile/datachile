FROM node:latest

ENV APP_HOME /datachile
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY package.json $APP_HOME
RUN npm install

COPY . $APP_HOME
RUN npm run build

EXPOSE 4444
CMD ["npm", "run", "start"]
