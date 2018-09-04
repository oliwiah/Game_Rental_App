import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Mongoose from 'mongoose';
import { config } from './config/app-config';
import { userRouter } from './routes/users.routes';
import { gamesRouter } from './routes/games.routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.dataBaseConnectorInit();
  }

  private dataBaseConnectorInit(): void {
    Mongoose.connect(
      config.db,
      {
        useNewUrlParser: true
      }
    ).then(() => {
      console.log('connect to MongoDB successfully');
    });

    const db = Mongoose.connection;

    db.on('error', error => {
      console.log('Error while attempting to connect to MongoDB', error);
      process.exit(1);
    });

    db.once('open', () => {
      // Routes
      this.app.use('/user', userRouter);
      this.app.use('/games', gamesRouter);
    });
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().app;
