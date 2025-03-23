import { Request, Response } from 'express';
import usersService from '~/services/users.services.js';
import { ParamsDictionary } from 'express-serve-static-core';
import { RegisterRequest } from '~/models/requests/User.requests.js';

class UsersController {
  loginController = (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username === 'lehoainguyenphuc@gmail.com' && password === '123456') {
      res.status(200).json({
        message: 'Login successful',
        errCode: 0
      });
    } else {
      res.status(401).json({
        message: 'Login failed',
        errCode: 2
      });
    }
  };

  registerController = async (req: Request<ParamsDictionary, any, RegisterRequest>, res: Response) => {
    try {
      const result = await usersService.registerUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating user', error);
      res.status(500).json({
        message: 'Internal server error',
        errCode: 3
      });
    }
  };
}

const usersController = new UsersController();
export default usersController;
