# TODO list

## How to run the project

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Run `npm run start` to start the server.

## How to test the project

1. Run `npm run test` to run the tests.
2. Run `npm run test:coverage` to run the tests and generate a coverage report.

## Technologies

- Node.js
- Express
- Jest
- Supertest
- Typescript
- ESLint
- Prettier

## Use Docker

1. Run the following command to build the image and start the container:

  ```bash
    docker-compose --env-file .env up --build
  ```

2. Send a POST request to `http://localhost:3000/webhook` with a JSON payload.
