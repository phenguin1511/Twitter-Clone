import { Request } from 'express';
import { User } from './models/User.js';
import { TokenPayload } from './models/requests/User.requests.js';
declare module 'express' {
  interface Request {
    user?: User;
    refreshToken?: TokenPayload;
    decoded_authorization?: TokenPayload;
    decoded_refresh_token?: TokenPayload;
    decoded_email_verify_token?: TokenPayload;
    decoded_forgot_password_token?: TokenPayload;
  }

  interface Error {
    status?: number;
    message?: string;
    errors?: any;
  }
}

declare module 'lodash' {
  interface LoDashStatic {
    omit: any;
  }
}
