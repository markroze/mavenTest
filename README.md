# mavenTest

## How to Install?

- Make sure you have a running postgress instance running [Docker](https://hub.docker.com/_/postgres) or [Local](https://www.postgresql.org/download/).
- Make sure you have npx installed globaly.
- add an .env file to `/server` folder with postgress db connection string in the following format:
  DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public".
- run `npm run install`.

## How to Run?

- Run both `npm run start:server` && `npm run start:client`
- PlaY!
