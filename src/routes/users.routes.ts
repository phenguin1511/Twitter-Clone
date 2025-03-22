import express from 'express';
const usersRouter = express.Router();
import { loginValidator } from '../middlewares/users.midlewares.js';
import { loginController } from '../controllers/users.controllers.js';

usersRouter.post('/login', loginValidator, loginController);

usersRouter.get('/test', (req, res) => {
      res.status(200).json({
            message: 'Hello World!',
            errCode: 0
      });
});

export default usersRouter;