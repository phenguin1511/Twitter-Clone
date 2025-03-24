import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TokenPayload } from '~/models/requests/User.requests.js';

dotenv.config();

const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object;
  privateKey?: string;
  options: jwt.SignOptions;
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error);
      } else {
        resolve(token as string);
      }
    });
  });
};

const verifyToken = ({
  token,
  secretKey = process.env.JWT_SECRET as string
}: {
  token: string;
  secretKey?: string;
}) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        throw reject(error);
      } else {
        resolve(decoded as TokenPayload);
      }
    });
  });
};

export { signToken, verifyToken };
