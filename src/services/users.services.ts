import User from '~/models/schemas/User.schema.js';
import databaseService from '~/services/database.services.js';
import { RegisterRequest, LogoutRequest } from '~/models/requests/User.requests.js';
import hashPassword from '~/utils/crypto.js';
import { signToken } from '~/utils/jwt.js';
import { TokenType, UserVerifyStatus } from '~/constants/enum.js';
import { SignOptions } from 'jsonwebtoken';
import RefreshToken from '~/models/schemas/RefreshToken.schema.js';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { USERS_MESSAGES } from '~/constants/messages.js';
dotenv.config();
class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id: new ObjectId(user_id),
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    });
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id: new ObjectId(user_id),
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    });
  }

  private async signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: {
        user_id: new ObjectId(user_id),
        token_type: TokenType.EmailVerifyToken
      },
      privateKey: process.env.EMAIL_VERIFY_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    });
  }

  async signAccessTokenAndRefreshToken(user_id: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ]);
    return { accessToken, refreshToken };
  }

  async registerUser(user: RegisterRequest) {
    try {

      const result = await databaseService.users.insertOne(
        new User({
          ...user,
          date_of_birth: new Date(user.date_of_birth),
          password: hashPassword(user.password),
        })
      );
      const user_id = result.insertedId.toString();
      const emailVerifyToken = await this.signEmailVerifyToken(user_id);
      await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
        {
          $set: {
            email_verify_token: emailVerifyToken,
            verify: UserVerifyStatus.Unverified
          }
        }
      ]);
      const { accessToken, refreshToken } = await this.signAccessTokenAndRefreshToken(user_id);
      await databaseService.refreshTokens.insertOne(
        new RefreshToken({
          user_id: new ObjectId(user_id),
          token: refreshToken
        })
      );
      if (!accessToken || !refreshToken) {
        return {
          message: 'Internal server error',
          errCode: 3
        };
      }
      return {
        message: 'User created',
        errCode: 0,
        data: result,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Error creating user', error);
      return {
        message: 'Internal server error',
        errCode: 3
      };
    }
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email });
    return Boolean(user);
  }

  async login(email: string, password: string) {
    const user = await databaseService.users.findOne({ email });
    if (!user) {
      return {
        message: USERS_MESSAGES.USER_NOT_FOUND,
        errCode: 1
      };
    }
    if (user.password !== hashPassword(password)) {
      return {
        message: USERS_MESSAGES.PASSWORD_INCORRECT,
        errCode: 1
      };
    }
    if (user.verify === UserVerifyStatus.Unverified) {
      return {
        message: USERS_MESSAGES.USER_NOT_VERIFIED,
        errCode: 1
      };
    }
    const { accessToken, refreshToken } = await this.signAccessTokenAndRefreshToken(user._id.toString());
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user._id.toString()),
        token: refreshToken
      })
    );
    return {
      message: 'Login successful',
      errCode: 0,
      accessToken,
      refreshToken
    };
  }

  async logout(refreshToken: string) {
    await databaseService.refreshTokens.deleteOne({
      token: refreshToken
    });
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS,
      errCode: 0
    };
  }

  async verifyEmail(user_id: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
    if (!user) {
      return {
        message: USERS_MESSAGES.USER_NOT_FOUND,
        errCode: 1
      };
    }
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          email_verify_token: '',
          verify: UserVerifyStatus.Verified,
          updated_at: "$$NOW"
        }
      }
    ])

    return {
      message: USERS_MESSAGES.VERIFY_EMAIL_SUCCESS,
      errCode: 0,
    };
  }

  async resendVerifyEmail(user_id: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
    if (!user) {
      return {
        message: USERS_MESSAGES.USER_NOT_FOUND,
        errCode: 1
      };
    }
    const emailVerifyToken = await this.signEmailVerifyToken(user_id);
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          email_verify_token: emailVerifyToken,
          updated_at: "$$NOW"
        }
      }
    ])
    return {
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS,
      errCode: 0
    };
  }

  private async signForgotPasswordToken(user_id: string) {
    return signToken({
      payload: {
        user_id: new ObjectId(user_id),
        token_type: TokenType.ForgotPasswordToken
      },
      privateKey: process.env.FORGOT_PASSWORD_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    });
  }

  async forgotPassword(user_id: string) {
    const forgotPasswordToken = await this.signForgotPasswordToken(user_id);
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token: forgotPasswordToken,
          updated_at: "$$NOW"
        }
      }
    ])
    console.log(forgotPasswordToken);
    return {
      message: USERS_MESSAGES.FORGOT_PASSWORD_SUCCESS,
      errCode: 0
    };
  }
}

const usersService = new UsersService();
export default usersService;
