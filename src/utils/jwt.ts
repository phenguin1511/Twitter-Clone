import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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

export { signToken };
