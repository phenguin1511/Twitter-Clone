import { NextFunction, Request, Response } from 'express';
import { ErrorWithStatus } from '~/models/Errors.js';
import HTTP_STATUS from '~/constants/httpStatus.js';
import _ from 'lodash';

const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    res.status(err.status).json(_.omit(err, ['status']));
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true });
  });
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errInfo: err
  });
};

export default defaultErrorHandler;
