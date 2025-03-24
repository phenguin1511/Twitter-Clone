import { checkSchema } from 'express-validator';
import { validate } from '../utils/validation.js';
import usersService from '../services/users.services.js';
import { USERS_MESSAGES } from '~/constants/messages.js';
import HTTP_STATUS from '~/constants/httpStatus.js';
import databaseService from '~/services/database.services.js';
import hashPassword from '~/utils/crypto.js';
import { verifyToken } from '~/utils/jwt.js';
import { ErrorWithStatus } from '~/models/Errors.js';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { Collection, ObjectId } from 'mongodb';

const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            });
            if (user === null) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT);
            } else {
              req.user = user;
            }
            return true;
          }
        }
      },
      password: {
        isLength: {
          options: { min: 8, max: 50 },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_FROM_8_TO_50_CHARACTERS
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1
          },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        },
        trim: true
      }
    },
    ['body']
  )
);

const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.NAME_MUST_BE_STRING
        },
        isLength: {
          options: { min: 1, max: 100 },
          errorMessage: USERS_MESSAGES.NAME_MUST_BE_FROM_1_TO_100_CHARACTERS
        },
        trim: true
      },
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_INVALID
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExistEmail = await usersService.checkEmailExist(value);
            if (isExistEmail) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS);
            }
            return true;
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isLength: {
          options: { min: 8, max: 50 },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_FROM_8_TO_50_CHARACTERS
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1
          },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        },
        trim: true
      },
      confirmPassword: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isLength: {
          options: { min: 8, max: 50 },
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_FROM_8_TO_50_CHARACTERS
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1
          }
        },
        trim: true,
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_DO_NOT_MATCH);
            }
            return true;
          }
        }
      },
      date_of_birth: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_INVALID
        }
      }
    },
    ['body']
  )
);

const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: { errorMessage: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1];
            if (!access_token) {
              throw new ErrorWithStatus(USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID, HTTP_STATUS.UNAUTHORIZED);
            }
            try {
              const decoded_authorization = await verifyToken({ token: access_token });
              (req as Request).decoded_authorization = decoded_authorization;
              req.user = await databaseService.users.findOne({ _id: new ObjectId(decoded_authorization.user_id) });
              return true;
            } catch (error) {
              if (error instanceof jwt.JsonWebTokenError) {
                throw new ErrorWithStatus(USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID, HTTP_STATUS.UNAUTHORIZED);
              }
              throw error;
            }
          }
        }
      }
    },
    ['headers']
  )
);

const refreshTokenValidator = validate(
  checkSchema(
    {
      refreshToken: {
        notEmpty: { errorMessage: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED },
        isString: {
          errorMessage: USERS_MESSAGES.REFRESH_TOKEN_MUST_BE_STRING
        },
        custom: {
          options: async (value: string, { req }) => {
            try {
              const decoded_refresh_token = await verifyToken({ token: value });
              (req as Request).decoded_refresh_token = decoded_refresh_token;
              const refreshToken = await databaseService.refreshTokens.findOne({ token: value });
              if (refreshToken === null) {
                throw new ErrorWithStatus(USERS_MESSAGES.USER_REFRESH_TOKEN_NOT_EXIST, HTTP_STATUS.UNAUTHORIZED);
              }
              return true;
            } catch (error) {
              if (error instanceof jwt.JsonWebTokenError) {
                throw new ErrorWithStatus(USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID, HTTP_STATUS.UNAUTHORIZED);
              }
              throw error;
            }
          }
        }
      }
    },
    ['body']
  )
);

export { loginValidator, registerValidator, accessTokenValidator, refreshTokenValidator };
