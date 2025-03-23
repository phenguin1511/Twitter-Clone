import { NextFunction, Request, Response } from 'express';
import { ErrorWithStatus } from '~/models/Errors.js';
import HTTP_STATUS from '~/constants/httpStatus.js';
import _ from 'lodash';
const defaultErrorHandler = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(_.omit(err, ['status']));
}

export default defaultErrorHandler;
