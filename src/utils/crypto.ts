import crypto from 'crypto';

export const sha256 = (data: string) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

function hashPassword(password: string) {
  return sha256(password + process.env.PASSWORD_SECRET);
}

export default hashPassword;
