import _ from 'lodash';
import { Request, Response, NextFunction } from 'express';


export const filterMiddleware = <T>(fields: (keyof T)[]) => (req: Request, res: Response, next: NextFunction) => {
      const result = _.pick(req.body, fields);
      req.body = result;
      next();
}
