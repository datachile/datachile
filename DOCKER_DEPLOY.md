# Deploying Datachile with `docker-compose`

This document describes how _Datachile_ is configured as a set of services running in [Docker](http://docker.io) containers, linked together with [`docker-compose`](https://docs.docker.com/compose/). We will assume deployment on an Ubuntu/Debian server.

## Services

The current version of Datachile is comprised of 6 containers:

  - `db`: an instance of PostgreSQL 9.6
  - `datachile-mondrian`: an instance of [`mondrian-rest`](http://github.com/jazzido/mondrian-rest) with [Datachile's OLAP schema](schema.xml)
  - `datachile-canon`: the web application
  - `nginx`: an instance of the [NGINX](http://nginx.org) web server, listening on ports 80 and 443.
  - `nginx-gen`: a service that generates configuration files for NGINX, based on [a template](nginx.tmpl). Based on [`docker-gen`](https://github.com/jwilder/docker-gen).
  - `nginx-letsencrypt`: a companion service for `nginx-gen`, it allows the creation/renewal of Let's Encrypt certificates automatically.
  
## Deployment

### Requirements

Install Docker Community Edition by following [the documentation on the Docker site](https://docs.docker.com/engine/installation/linux/docker-ce/debian/). [`docker-compose`] is also required, install it following [the instructions](https://docs.docker.com/compose/install/).

### Build `datachile-mondrian` image

Get the [source code of the Datachile Cubes server](https://github.com/datawheel/datachile-mondrian), and run `docker build -t datachile-mondrian:x.y.z`, where `x.y.z` is a version number. We will refer to it in the `docker-compose.yml` file.

### Load data into the `db` container

  - `cd` into the directory where the `docker-compose.yml` file is stored
  - Create a [docker volume](https://docs.docker.com/engine/admin/volumes/) on the host: `docker volume create datachile_db-data`
  - Start the `db` container only: `docker-compose start db`
  - Load a dump into the database: `psql -U postgres -p 5434 -h localhost < datachile_dump.sql`. This will take a while, go make coffee.
  
### Adjust variables in `docker-compose.yml`

The main variables of interest in `docker-compose.yml` are `VIRTUAL_HOST` and `LETSENCRYPT_HOST`. The former indicates the hostname of the servers, while the latter is the hostname for which we're going to request a _Let's Encrypt_ certificate. There are other variables in the `environment:` block of each service that may be adjusted.

The location of the cubes' schema definition file `schema.xml` is defined in the `volumes:` section of the `datachile-mondrian` container. Adjust it accordingly.

## Start the docker cluster

Make sure that ports 80 and 443 are not bound to any service in the host, and run `docker-compose up -d`. Logs can be inspected with `docker-compose logs -f --tail==100`.









