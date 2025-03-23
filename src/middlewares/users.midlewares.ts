import { Request, Response, NextFunction } from 'express';
import { checkSchema } from 'express-validator';
import { validate } from '../utils/validation.js';
const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      message: 'Invalid input',
      errCode: 1
    });
  } else {
    next();
  }
};

const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isLength: {
        options: { min: 1, max: 100 },
        errorMessage: 'Name is required'
      },
      trim: true
    },
    email: {
      notEmpty: true,
      isEmail: {
        errorMessage: 'Invalid email'
      },
      trim: true
    },
    password: {
      notEmpty: true,
      isLength: {
        options: { min: 8, max: 50 },
        errorMessage: 'Password must be at least 8 characters long'
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1
        }
      },
      trim: true
    },
    confirmPassword: {
      notEmpty: true,
      isLength: {
        options: { min: 8, max: 50 },
        errorMessage: 'Password must be at least 8 characters long'
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
            throw new Error('Passwords do not match');
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
        errorMessage: 'Invalid date of birth'
      }
    }
  })
);
export { loginValidator, registerValidator };
