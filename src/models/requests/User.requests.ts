import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { TokenType } from '~/constants/enum.js';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  date_of_birth: string;
}


export interface TokenPayload extends JwtPayload {
  user_id: string;
  token_type: TokenType;
}

export interface LogoutRequest {
  refreshToken: string;
}

