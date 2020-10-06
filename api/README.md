# Getting started

## Installation

Install dependencies

npm install

---

## Database

The codebase contains example of implementing using TypeORM [TypeORM](http://typeorm.io/) with a postgres database.

Create a new postgres database with the name `upstreamengineering`\
(or the name you specified in the enviroment variables)

Set database settings using an enviroment variable file development.env :

    API_PORT=3000
    TRANSPORT_PORT=4000
    JWT_SECRET_KEY=rxPhglGJWPlOW596
    JWT_EXPIRATION_TIME=3600

    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=dbuser
    DB_PASSWORD=dbpassword
    DB_DATABASE=upstreamengineering

On application start, tables for all entities will be created.

---

## NPM scripts

-   `npm start` - Start application
-   `npm run start:watch` - Start application in watch mode
-   `npm run test` - run Jest test runner
-   `npm run start:prod` - Build application

## Start application

-   `npm start`
-   Test api with `http://localhost:3000/api/articles` in your favourite browser

---

# Authentication

This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token. Please check the following sources to learn more about JWT.

---

# Swagger API docs

The NestJS swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)
