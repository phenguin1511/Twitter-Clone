import { Request, Response } from 'express';
import usersService from '~/services/users.services.js';
import { ParamsDictionary } from 'express-serve-static-core';
import { LogoutRequest, RegisterRequest, TokenPayload, LoginRequest, VerifyEmailRequest, ForgotPasswordRequest } from '~/models/requests/User.requests.js';
import { USERS_MESSAGES } from '~/constants/messages.js';
import databaseService from '~/services/database.services.js';
import { ObjectId } from 'mongodb';
import { UserVerifyStatus } from '~/constants/enum.js';
class UsersController {
  loginController = async (req: Request<ParamsDictionary, any, LoginRequest>, res: Response) => {
    const { email, password } = req.body;
    const result = await usersService.login(email, password);
    return res.status(200).json({
      message: USERS_MESSAGES.LOGIN_SUCCESS,
      result
    });
  };

  registerController = async (req: Request<ParamsDictionary, any, RegisterRequest>, res: Response) => {
    const result = await usersService.registerUser(req.body);
    return res.status(200).json({
      message: USERS_MESSAGES.REGISTER_SUCCESS,
      result
    });
  };

  logoutController = async (req: Request<ParamsDictionary, any, LogoutRequest>, res: Response) => {
    const { refreshToken } = req.body;
    const result = await usersService.logout(refreshToken);
    return res.status(200).json({
      result
    });
  };

  verifyEmailController = async (req: Request<ParamsDictionary, any, VerifyEmailRequest>, res: Response) => {
    const { user_id } = req.decoded_email_verify_token as TokenPayload;
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      return res.status(400).json({
        message: USERS_MESSAGES.USER_NOT_FOUND
      })
    }
    if (user.verify === UserVerifyStatus.Verified) {
      return res.status(400).json({
        message: USERS_MESSAGES.USER_ALREADY_VERIFIED
      })
    }
    const result = await usersService.verifyEmail(user_id);
    return res.status(200).json({
      message: USERS_MESSAGES.VERIFY_EMAIL_SUCCESS,
      result
    });
  };

  resendVerifyEmailController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload;
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      return res.status(400).json({
        message: USERS_MESSAGES.USER_NOT_FOUND
      })
    }
    if (user.verify === UserVerifyStatus.Verified) {
      return res.status(400).json({
        message: USERS_MESSAGES.USER_ALREADY_VERIFIED
      })
    }
    const result = await usersService.resendVerifyEmail(user_id);
    return res.status(200).json({
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS,
      result
    });
  }

  forgotPasswordController = async (req: Request<ParamsDictionary, any, ForgotPasswordRequest>, res: Response) => {
    const { _id } = req.user;
    const result = await usersService.forgotPassword(_id.toString());
    return res.status(200).json({
      message: USERS_MESSAGES.FORGOT_PASSWORD_SUCCESS,
      result
    });
  }
}

const usersController = new UsersController();
export default usersController;
