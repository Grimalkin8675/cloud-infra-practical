# Containers practical work

*Instructions:*  
In this exercise you are going to set up a development stack infrastructure. This means that you will configure a container as a platform for testing your code, and you will develop your code somewhere else (e.g. your laptop or another container). You are free to chose the tools to install and the development environment, but you must adhere to the following requirements:
* Start from one or multiple existing image(s) in the Dockerhub (e.g. ubuntu, fedora, etc.).
* Use `docker-compose` to customise the image or images.
* The customised image will be the test environment where you will test and debug your code. But it will also become the production environment that you will give to the client, so make sure everything is well configured in the container. Think about everything you need to have installed (Java EE, JRE, Scala, Python, a database, etc.).
* You will develop your code outside the test container, which will mount a volume into the development directory so that you can run and test your code inside the container. The code to develop, as well as the tools you will use (your IDE, for example) can be in installed
in your laptop or in another container.
* Once the code, the `docker-compose.yml` file and everything else you need work perfectly, commit those files to gitLab or gitHub and send your client (that’s me) the link. I will clone the files and will run `docker-compose up`. Then I will grade your work.


## Containers

Details of what the `docker-compose` sets up.

### First things first, we need a database:

Our database is a [MongoDB](https://www.mongodb.com) Replica Set made of 3 `mongo` containers (Primary, Secondary, Arbiter). Their hostnames are: `mongodb1`, `mongodb2`, `mongoArbiter`. They are created without authentication (as it is easier to set up the Replica Set), but they are all in the same private network named `tpdocker`.

(see also: [Deploy New Replica Set With Keyfile Access Control](https://docs.mongodb.com/manual/tutorial/deploy-replica-set-with-keyfile-access-control))


### But the database is empty:

In order to fill the database, there is an other `mongo` container that runs the `./mongodb/insert-datas.sh` (host path) script.

This script:
* waits until all replicas are available
* initiates the replica set
* waits until one of the members becomes the primary
* waits until the primary becomes master (in order to write on it)
* drops the existing database¹ (in the event that the containers were already created and filled)
* runs all the `./mongodb/datas/*.js` (host path) files with mongo using the database¹; these files insert some datas

¹ The name of this database is defined in `./.env` file with the `DB_NAME` variable (here: `pau`).


### We now need a backend to make HTML requests:

We simply use [RESTHeart](https://restheart.org) (and it's [docker image](https://hub.docker.com/r/softinstigate/restheart)).

* Configuration file ([doc](https://restheart.org/learn/configuration-file)): `./restheart/restheart.yml` (host path)
* Security ([doc](https://restheart.org/learn/security)): `./restheart/security.yml` (host path)


### Finally we can build a (beautiful) React frontend:

For this, we have a custom image: `./frontreact/Dockerfile` which contains [Node.js](https://nodejs.org) (but not the `node_modules` needed for the front). The entrypoint is the `./frontreact/entrypoint.sh` script. It always runs `npm install` on container start.

The `./frontreact/app` folder is mounted on the container.

The `docker-compose` command starts the development server which allows to edit the frontend and see the changes live.


## Installation

    docker-compose up [-d]

Wait for the `insert_datas` and `frontreact` images to be ready:
* `insert_datas` should exit with code 0
* `frontreact` should output: "You can now view frontreact in the browser."


## Visualisation

* To see the frontend: http://localhost:63423/  
  Connect to the container:

      docker exec -it cloudinfratp_frontreact_1 bash

* To query the backend: http://localhost:63422/

      username: admin  
      password: changeit

  (You can change it in `./restheart/security.yml` and `./frontreact/app/src/config.ts`.)

* Connect to the database container(s):

      docker exec -it cloudinfratp_mongodb1_1 mongo
      # or: docker exec -it cloudinfratp_mongodb2_1 mongo
      # or: docker exec -it cloudinfratp_mongoArbiter_1 mongo


## Changes

Edit the files inside `./frontreact/app` and see the changes live in the browser. (The main React component is `./frontreact/app/src/components/App.tsx`.)

In the present case, we have a ready to use backend, but if we wanted to make our own, we could have mounted a shared volume on the backend container and edit it from there.


## To conclude: concerning production

The database is obviously not ready for production as it has no authentication. The replicas also have to be on different physical machines.

The current React frontend can't be used in production. The project needs to be built and it can then be served as static files for example by a `nginx` container. We could do this with an other `docker-compose.override.yml` for production.

The RESTHeart container is already provided ready for production so there is nothing special to do about it.
