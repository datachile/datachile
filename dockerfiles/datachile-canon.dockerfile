FROM node:latest

ENV APP_HOME /datachile
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY package.json $APP_HOME
RUN npm install

COPY app/ $APP_HOME/app/
COPY locales/ $APP_HOME/locales/
COPY static/ $APP_HOME/static/

RUN npm run build

EXPOSE 4444
CMD ["npm", "run", "start"]
