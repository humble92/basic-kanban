import express from 'express';
import cors from 'cors';
import { notFound, serverError } from './middleware/error';
import listRouter from './routes/list';
import cardRouter from './routes/card';
import userRouter from './routes/user';
import { Events } from "./constants";

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use((req, res, next) => {
    // this code is executed for every request
    const start = new Date();
    res.on(Events.FINISH, function () {
      console.log(res.req.method, ' ', res.req.originalUrl, ' ', res.statusCode, ' ', new Date() - start, 'ms');
    });
    // transfer the request to the next matching route
    next();
  });

  // Error Handling
  // sycnhronous code
  app.get('/err/sync', (req, res) => {
    throw new Error('Error thrown from sychronous code');
  });

  app.get('/err/async', async (req, res, next) => {
    next(new Error('Error thrown from asynchronous code'));
  });

  // routes
  app.use('/list', listRouter);
  app.use('/card', cardRouter);
  app.use('/user', userRouter)

  // handling 404
  app.use(notFound);

  app.use((req, res, next) => {
    // this code is executed for every request
    res.emit(Events.FINISH);
    // transfer the request to the next matching route
    next();
  });

  // handling error thrown
  app.use(serverError);

  // default error handling
  // we will dig into this in the last session
  // app.use((error, req, res, next) => {
  //   console.error(error);

  //   res.status(500).json({ error: { message: error.message || 'Internal Server Error' } });
  // });

  return app;
};

export default createApp;
