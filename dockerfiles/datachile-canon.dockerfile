FROM node:latest

ENV APP_HOME /datachile
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY package.json $APP_HOME
RUN npm install

COPY app/ $APP_HOME/app/
COPY index.js $APP_HOME
COPY locales/ $APP_HOME/locales/
COPY static/ $APP_HOME/static/

RUN npm run build
RUN cp -R /datachile/static /datachile/static-shared

EXPOSE 4444
CMD ["npm", "run", "start"]
