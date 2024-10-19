## The external provider integration.

I set up a Node.js server with an endpoint (`/webhook`) that listens for POST requests. I implemented a mechanism to secure it by validating incoming requests. The server accepts JSON payloads with the following structure:

```typescript
class Webhook {
  event: string; // The event name you are listening to.
  sentAt: Date; // The timestamp when the webhook was sent.
  data: EventDataType1 | EventDataType2 | EventDataType3; // For simplicity, we are going to define only 3 different types of events that we could listen to.
}
```

I implemented a secure way to generate and verify the signature for incoming requests. I used a secret key to generate the signature and verify it on the server. Only valid requests with the correct signature are accepted.

I create a service that processes each type of event separately. The service is ready to handle thousands of requests and process them in order without affecting our final customers and without losing any piece of information. In the future it will be nice to have a queue system to handle the requests like RabbitMQ or Kafka.

I like to handle the posibility to add services inside the webhook service to handle more events in the future.

## How to run the project

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Run `npm run start` to start the server.
4. Send a POST request to `http://localhost:3000/webhook` with a JSON payload.

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
