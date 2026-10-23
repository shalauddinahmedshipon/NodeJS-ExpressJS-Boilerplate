import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import config from './app/config';

const app: Application = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [`${config.client_url}`, 'http://localhost:5173'],
    credentials: true,
  }),
);
app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.send('doctor-tracker is flying!');
});
app.use(globalErrorHandler);
app.use(notFound);

export default app;
