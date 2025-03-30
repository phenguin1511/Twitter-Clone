import express from 'express';
const usersRouter = express.Router();
import { emailVerifyTokenValidator, loginValidator, registerValidator, accessTokenValidator, refreshTokenValidator, emailValidator, forgotPasswordTokenValidator, resetPasswordValidator, verifiedUserValidator, updateMeValidator } from '../middlewares/users.midlewares.js';
import usersController from '../controllers/users.controllers.js';
import wrapRequestHandler from '../utils/handlers.js';
import { filterMiddleware } from '~/middlewares/common.middleware.js';
import { UpdateMeRequest } from '~/models/requests/User.requests.js';
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

/**
 * Description: Verify email
 * Path: /users/verify-email
 * Method: POST
 * Body: { email_verify_token: string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(usersController.verifyEmailController));

/**
 * Description: Resend verify email
 * Path: /users/resend-verify-email
 * Method: POST
 * Headers: { Authorization: Bearer <access_token> }
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(usersController.resendVerifyEmailController));

/**
 * Description: Forgot password
 * Path: /users/forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', emailValidator, wrapRequestHandler(usersController.forgotPasswordController));

/**
 * Description: verify link in email to reset password
 * Path: /users/verify-forgot-password
 * Method: POST
 * Body: { forgot_password_token: string }
 */
usersRouter.post('/verify-forgot-password', forgotPasswordTokenValidator, wrapRequestHandler(usersController.verifyForgotPasswordController));

/**
 * Description: Reset password
 * Path: /users/reset-password
 * Method: POST
 * Body: { forgot_password_token: string, new_password: string, confirm_new_password: string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(usersController.resetPasswordController));

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Headers: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(usersController.getMeController));

/**
 * Description:
 * Path: /me
 * Method: GET
 * Headers: { Authorization: Bearer <access_token> }
 * Body: new User
 */
usersRouter.patch('/me',
      accessTokenValidator,
      verifiedUserValidator,
      updateMeValidator,
      filterMiddleware<UpdateMeRequest>(['name', 'date_of_birth', 'bio', 'location', 'website', 'username', 'avatar', 'cover_photo']),
      wrapRequestHandler(usersController.updateMeController));
export default usersRouter;
