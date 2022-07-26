# RTech Diagnostics Backend

## Installation

First, you need to install the dependencies.

```bash
$ npm install -g yarn # install yarn globally
$ yarn # install dependencies
```

Secondly, you need to create a `.env` file and copy the `.env.example` file to it.

```bash
$ cp .env.example .env # copy the example file to the .env file
```

Then, you need to run the database and the database migrations.

> Make sure you have [Docker]('https://docs.docker.com/desktop/') installed

```bash
$ yarn db:start # start the database
$ yarn db:migrate:dev # run the database migrations
```

Finally, you need to run the server.

```bash
$ yarn start:dev # run the server
```
