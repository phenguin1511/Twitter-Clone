import express from 'express';
const usersRouter = express.Router();
import { loginValidator, registerValidator } from '../middlewares/users.midlewares.js';
import usersController from '../controllers/users.controllers.js';

usersRouter.post('/login', loginValidator, usersController.loginController);
usersRouter.post('/register', registerValidator, usersController.registerController);

export default usersRouter;
