import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

export const sha256 = (data: string) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

function hashPassword(password: string) {
  return sha256(password + process.env.PASSWORD_SECRET);
}

export default hashPassword;
