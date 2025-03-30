import { Request, Response } from 'express';
import usersService from '~/services/users.services.js';
import { ParamsDictionary } from 'express-serve-static-core';
import { LogoutRequest, RegisterRequest, TokenPayload, LoginRequest, VerifyEmailRequest, ForgotPasswordRequest, VerifyForgotPasswordRequest, ResetPasswordRequest, UpdateMeRequest, GetProfileRequest, FollowRequest, UnfollowRequest } from '~/models/requests/User.requests.js';
import { USERS_MESSAGES } from '~/constants/messages.js';
import databaseService from '~/services/database.services.js';
import { ObjectId } from 'mongodb';
import { UserVerifyStatus } from '~/constants/enum.js';
import User from '~/models/schemas/User.schema.js';
import _ from 'lodash';
class UsersController {
  loginController = async (req: Request<ParamsDictionary, any, LoginRequest>, res: Response) => {
    const user = req.user as User;
    const user_id = user._id as ObjectId;
    const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify as UserVerifyStatus });
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
    const user = req.user as User;
    if (!user._id || !user.verify) {
      return res.status(400).json({
        message: USERS_MESSAGES.USER_NOT_FOUND
      });
    }
    const result = await usersService.forgotPassword({
      user_id: user._id.toString(),
      verify: user.verify as UserVerifyStatus
    });
    return res.status(200).json({
      message: USERS_MESSAGES.FORGOT_PASSWORD_SUCCESS,
      result
    });
  }

  verifyForgotPasswordController = async (req: Request<ParamsDictionary, any, VerifyForgotPasswordRequest>, res: Response) => {
    return res.status(200).json({
      message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS,
      errCode: 0
    });
  }

  resetPasswordController = async (req: Request<ParamsDictionary, any, ResetPasswordRequest>, res: Response) => {
    const { _id } = req.user;
    const result = await usersService.resetPassword(_id.toString(), req.body);
    return res.status(200).json({
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS,
      result
    });
  }

  getMeController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload;
    const user = await usersService.getMe(user_id);
    return res.status(200).json({
      message: USERS_MESSAGES.GET_ME_SUCCESS,
      user
    });
  }
  updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeRequest>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload;
    const body = req.body;
    const result = await usersService.updateMe(user_id, body);
    return res.status(200).json({
      message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
      result
    });
  }

  getProfileController = async (req: Request<ParamsDictionary, any, GetProfileRequest>, res: Response) => {
    console.log(req.params);
    const { username } = req.params;
    const user = await usersService.getProfile(username);
    if (user.errCode === 1) {
      return res.status(400).json({
        message: user.message
      });
    }
    return res.status(200).json({
      message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
      user: user.data
    });
  }

  followController = async (req: Request<ParamsDictionary, any, FollowRequest>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload;
    const { user_id_to_follow } = req.body;
    const result = await usersService.follow(user_id, user_id_to_follow);
    if (result.errCode === 1) {
      return res.status(400).json({
        message: result.message
      });
    }
    return res.status(200).json({
      message: USERS_MESSAGES.FOLLOW_SUCCESS,
      result
    });
  }

  unfollowController = async (req: Request<ParamsDictionary, any, UnfollowRequest>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload;
    const { user_id_to_follow } = req.params;
    const result = await usersService.unfollow(user_id, user_id_to_follow);
    if (result.errCode === 1) {
      return res.status(400).json({
        message: result.message
      });
    }
    return res.status(200).json({
      message: USERS_MESSAGES.UNFOLLOW_SUCCESS,
      result
    });
  }
}

const usersController = new UsersController();
export default usersController;
