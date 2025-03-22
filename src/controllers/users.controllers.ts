import { Request, Response } from 'express';
import User from '~/models/schemas/User.schema.js';
import databaseService from '~/services/database.services.js';
import usersService from '~/services/users.services.js';

class UsersController {
      loginController = (req: Request, res: Response) => {
            const username = req.body.username;
            const password = req.body.password;
            if (username === 'lehoainguyenphuc@gmail.com' && password === '123456') {
                  res.status(200).json({
                        message: 'Login successful',
                        errCode: 0
                  });
            }
            else {
                  res.status(401).json({
                        message: 'Login failed',
                        errCode: 2
                  });
            }
      }

      registerController = async (req: Request, res: Response) => {
            const { email, password } = req.body;
            try {
                  const result = await usersService.registerUser(email, password);
                  res.status(201).json(result);
            } catch (error) {
                  console.error('Error creating user', error);
                  res.status(500).json({
                        message: 'Internal server error',
                        errCode: 3
                  });
            }

      }
}


const usersController = new UsersController();
export default usersController;