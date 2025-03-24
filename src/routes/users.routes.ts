import express from 'express';
const usersRouter = express.Router();
import { loginValidator, registerValidator, accessTokenValidator, refreshTokenValidator } from '../middlewares/users.midlewares.js';
import usersController from '../controllers/users.controllers.js';
import wrapRequestHandler from '../utils/handlers.js';
import { Request, Response } from 'express';

/**
 * Description: Login
 * Path: /users/login
 * Method: POST
 * Body: { email: string, password: string,}
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(usersController.loginController));

/**
 * Description: Register
 * Path: /users/register
 * Method: POST
 * Body: { email: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(usersController.registerController));

/**
 * Description: Logout  
 * Path: /users/logout
 * Method: POST
 * Headers: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post(
      '/logout',
      accessTokenValidator,
      refreshTokenValidator,
      wrapRequestHandler(usersController.logoutController)
);

export default usersRouter;
