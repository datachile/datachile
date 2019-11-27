FROM node:latest

ENV APP_HOME /datachile
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

ADD . $APP_HOME
RUN npm ci && npm run build

EXPOSE 4444
CMD ["npm", "run", "start"]
