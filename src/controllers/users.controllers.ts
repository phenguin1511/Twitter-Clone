import { Request, Response } from 'express';
import usersService from '~/services/users.services.js';
import { ParamsDictionary } from 'express-serve-static-core';
import { LogoutRequest, RegisterRequest } from '~/models/requests/User.requests.js';
import { USERS_MESSAGES } from '~/constants/messages.js';

class UsersController {
  loginController = async (req: Request, res: Response) => {
    const { user } = req;
    const { _id } = user;
    const result = await usersService.login(_id);
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
}

const usersController = new UsersController();
export default usersController;
