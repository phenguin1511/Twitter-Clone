import express from 'express';
const usersRouter = express.Router();
import { loginValidator } from '../middlewares/users.midlewares.js';
import usersController from '../controllers/users.controllers.js';

usersRouter.post('/login', loginValidator, usersController.loginController);
usersRouter.post('/register', usersController.registerController);
export default usersRouter;