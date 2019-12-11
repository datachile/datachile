FROM node:latest

ENV APP_HOME /datachile
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

ARG canon_api
ENV CANON_CONST_API $canon_api

ADD . $APP_HOME
RUN npm ci && npm run build

EXPOSE 4444
CMD ["node", "index.js"]
