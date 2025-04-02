import express from 'express';
const app = express();
import usersRouter from './routes/users.routes.js';
import bodyParser from 'body-parser';
import databaseService from './services/database.services.js';
import defaultErrorHandler from './middlewares/error.middlewares.js';
import mediasRouter from './routes/medias.routes.js';
import { initFolder } from './utils/file.js';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initFolder();

app.use('/users', usersRouter);
app.use('/medias', mediasRouter);

app.use(defaultErrorHandler);

databaseService.connect().then(() => {
  console.log('Connected to the database successfully');
});

app.listen(4000, () => {
  console.log('Example app listening on port 4000!');
});
