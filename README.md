# TPMComponents - API REST <!-- omit in toc -->

API Documentation for TPMComponents store.

# Index <!-- omit in toc -->

- [Installation](#installation)
  - [Database](#database)
  - [Build docker image](#build-docker-image)
  - [Start API](#start-api)
- [Logs](#logs)
- [Endpoints](#endpoints)
  - [Welcome](#welcome)
  - [Users](#users)
    - [Find all users](#find-all-users)
    - [Find user](#find-user)
    - [Create user](#create-user)
    - [Delete user](#delete-user)
  - [Items](#items)
    - [Find all items](#find-all-items)
    - [Find item](#find-item)
    - [Create item](#create-item)
    - [Delete item](#delete-item)

---

# Installation

Set your environment variables in *.env* file.

```
API=/api/
DATABASE_HOST=<your database host>
DATABASE_NAME=<your database name>
DATABASE_USERNAME=<your database username>
DATABASE_PASSWORD=<your database password>
```

## Database

This app creates a Mongo Server in memory for testing mode.

Configuring which mongod binary to use:

```
export MONGOMS_DOWNLOAD_URL=https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-4.2.8.tgz MONGOMS_VERSION=4.2.8
```

```console
$ docker run -d --name my-mongo \
    --restart always \
    -e MONGO_INITDB_ROOT_USERNAME=elsuperadmin \
    -e MONGO_INITDB_ROOT_PASSWORD=Y8bWsdxBgAmRxe2n6VXeL7PtT1kZzJsR \
    mongo:5.0.5
```
```console
$ docker inspect my-mongo

10.10.0.3
```

```console
$ docker exec -it my-mongo bash

root@320681c4d6b7:/# mongosh
Current Mongosh Log ID:	61f039bd67dd285cb02c981f
Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
Using MongoDB:		5.0.5
Using Mongosh:		1.1.7

test> use admin
switched to db admin
admin> db.auth("elsuperadmin", "Y8bWsdxBgAmRxe2n6VXeL7PtT1kZzJsR");
{ ok: 1 }
admin> use tpmcomponents
switched to db tpmcomponents
tpmcomponents> db.user.insertOne({ nickname: "tonipm", firstname: "Toni", lastname: "Peraira", password: "4nhoKtgPuRj1STKTjz7FGIgiS2uEJVar" })
{
  acknowledged: true,
  insertedId: ObjectId("61f0410806feed0b73feda80")
}
tpmcomponents> show dbs
admin           102 kB
config          111 kB
local          73.7 kB
tpmcomponents  8.19 kB
tpmcomponents> db.createUser({user: "app-user", pwd: "eNICAphERSoLespIGnIkeRSIusKokeRiGroLItioneTYpTIony", roles:[{role: "readWrite" , db:"tpmcomponents"}]})
{ ok: 1 }
```

## Build docker image

```console
$ docker build . -t tpmcomponents
```

## Start API

```console
$ ./deploy.sh
```

or

```console
$ docker run \
        --name tpmcomponents \
        --restart always \
        -p 3000:3000 \
        --env-file ./.env \
        -d tpmcomponents
```

# Logs

Read live API logs.

```
docker logs tpmcomponents -f
```

---

# Endpoints

*{{apiUrl}}*: Base URL for all endpoints http://localhost:3000/api.

## Welcome

Welcome message. Used for is alive checks.

```bash
Method: GET

URL: {{apiUrl}}/users

Auth: No

Example:
curl --location -g --request GET 'http://localhost:3000/api/'
```

## Auth

### Login

User login with nickname & password.

```bash
Method: GET

URL: {{apiUrl}}/auth/login

Auth: No

Example:
curl --location --request POST 'http://localhost:3000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "nickname": "tonipm4",
    "password": "test1234"
}'```

## Users

### Find all users

Find all existing users.

```bash
Method: GET

URL: {{apiUrl}}/users

Auth: No

Example:
curl --location -g --request GET 'http://localhost:3000/api/users'
```

### Find user

Find one user by nickname.

```bash
Method: GET

URL: {{apiUrl}}/users/{{nickname}}

Auth: No

Example:
curl --location -g --request GET 'http://localhost:3000/api/users/tonipm'
```

### Create user

Create a new user.

Nickname must be at least 4 characters.

Password must be at least 16 characters and contain at least: 1 number, 1 symbol, 1 capital letter and 1 lower letter.

```bash
Method: POST

URL: {{apiUrl}}/users

Auth: Yes

Example:
curl --location -g --request POST 'http://localhost:3000/api/users' \
--data-raw '{
    "nickname": "tonipm",
    "firstname": "Toni",
    "lastname": "Peraira",
    "password": "test1234"
}'
```

### Delete user

Delete user by nickname.

```bash
Method: DELETE

URL: {{apiUrl}}/users/{{nickname}}

Auth: Yes

Example:
curl --location -g --request DELETE 'http://localhost:3000/api/users/tonipm'
```

## Items

### Find all items

Find all existing items.

```bash
Method: GET

URL: {{apiUrl}}/items

Auth: No

Example:
curl --location -g --request GET 'http://localhost:3000/api/items'
```

### Find item

Find one item by name.

```bash
Method: GET

URL: {{apiUrl}}/items/{{name}}

Auth: No

Example:
curl --location -g --request GET 'http://localhost:3000/api/items/MSI Optix G271'
```

### Create item

Create a new item.

```bash
Method: POST

URL: {{apiUrl}}/items

Auth: Yes

Example:
curl --location -g --request POST 'http://localhost:3000/api/items' \
--data-raw '{
    "name": "Acer KG251Q",
    "description": "Acer KG251QJbmidpx 24.5\" LED FullHD 165Hz FreeSync"
}'
```

### Delete item

Delete existing item.

```bash
Method: DELETE

URL: {{apiUrl}}/items/{{name}}

Auth: Yes

Example:
curl --location -g --request DELETE 'http://localhost:3000/api/items/Acer KG251Q'
```
