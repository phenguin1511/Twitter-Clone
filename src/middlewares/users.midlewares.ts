import { Request, Response, NextFunction } from 'express';



const loginValidator = (req: Request, res: Response, next: NextFunction) => {
      const { username, password } = req.body;
      if (!username || !password) {
            res.status(400).json({
                  message: 'Invalid input',
                  errCode: 1
            });
      }
      else {
            next();
      }
};


export { loginValidator };