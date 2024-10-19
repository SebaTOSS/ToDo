import { registerAs } from '@nestjs/config';

export default registerAs('getBrokerConfig', () => ({
  url: process.env.BROKER_URL,
  queue: process.env.BROKER_QUEUE,
}));