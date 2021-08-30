import { response } from 'express';
import { createConnection } from "typeorm";

import createApp from './app';
import { APP_PORT, DB_CONFIG } from './config';

response.ok = function(data) {
  return this.status(200).json(data);
};
response.created = function(data) {
  return this.status(201).json(data);
};
response.noContent = function() {
  return this.sendStatus(204);
};
response.notFound = function(message = 'Not Found') {
  return this.status(404).send(message);
};

// Connect to DB
createConnection(DB_CONFIG).then((connection) => {
  const app = createApp();

  app.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}`);
  });
});