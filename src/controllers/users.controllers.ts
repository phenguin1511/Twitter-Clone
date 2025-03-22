import { Request, Response } from 'express';

const loginController = (req: Request, res: Response) => {
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

export { loginController };