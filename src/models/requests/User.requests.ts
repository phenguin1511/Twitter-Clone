import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { TokenType, UserVerifyStatus } from '~/constants/enum.js';

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email_verify_token: string;
}


export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyForgotPasswordRequest {
  forgot_password_token: string;
}

export interface ResetPasswordRequest {
  forgot_password_token: string;
  new_password: string;
  confirm_new_password: string;
}

export interface UpdateMeRequest {
  name?: string;
  date_of_birth?: string;
  bio?: string;
  location?: string;
  website?: string;
  username?: string;
  avatar?: string;
  cover_photo?: string;
}

export interface GetProfileRequest {
  username: string;
}

export interface FollowRequest {
  user_id_to_follow: string;
}
