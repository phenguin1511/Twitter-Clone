import express from 'express';
const app = express();
import usersRouter from './routes/users.routes.js';
import bodyParser from 'body-parser';
import databaseService from './services/database.services.js';
import defaultErrorHandler from './middlewares/error.middlewares.js';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/users', usersRouter);

app.use(defaultErrorHandler);

databaseService.connect().then(() => {
  console.log('Connected to the database successfully');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
