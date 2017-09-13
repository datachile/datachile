FROM jruby:latest

ARG DATACHILE_MONDRIAN_SRC=/home/hermes/datachile-mondrian

ENV APP_HOME /mondrian-rest/

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY $DATACHILE_MONDRIAN_SRC $APP_HOME
RUN bundle install

ENV JRUBY_OPTS -G

CMD ["rackup", "-o", "0.0.0.0"]
