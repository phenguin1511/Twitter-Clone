import User from '~/models/schemas/User.schema.js';
import databaseService from '~/services/database.services.js';
import { RegisterRequest, LogoutRequest, ResetPasswordRequest, UpdateMeRequest, ChangePasswordRequest } from '~/models/requests/User.requests.js';
import hashPassword from '~/utils/crypto.js';
import { signToken } from '~/utils/jwt.js';
import { TokenType, UserVerifyStatus } from '~/constants/enum.js';
import { SignOptions } from 'jsonwebtoken';
import RefreshToken from '~/models/schemas/RefreshToken.schema.js';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { USERS_MESSAGES } from '~/constants/messages.js';
import Follower from '~/models/schemas/Follower.schema.js';
dotenv.config();
class UsersService {
  private signAccessToken({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id: new ObjectId(user_id),
        token_type: TokenType.AccessToken,
        verify
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    });
  }
  private signRefreshToken({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id: new ObjectId(user_id),
        token_type: TokenType.RefreshToken,
        verify
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    });
  }

  private async signEmailVerifyToken({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id: new ObjectId(user_id),
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privateKey: process.env.EMAIL_VERIFY_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    });
  }

  async signAccessTokenAndRefreshToken({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify })
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
      const emailVerifyToken = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified });
      await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
        {
          $set: {
            email_verify_token: emailVerifyToken,
            verify: UserVerifyStatus.Unverified
          }
        }
      ]);
      const { accessToken, refreshToken } = await this.signAccessTokenAndRefreshToken({ user_id, verify: UserVerifyStatus.Unverified });
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

  async login({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
    if (!user) {
      return {
        message: USERS_MESSAGES.USER_NOT_FOUND,
        errCode: 1
      };
    }
    const { accessToken, refreshToken } = await this.signAccessTokenAndRefreshToken({ user_id: user._id.toString(), verify });
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user._id.toString()),
        token: refreshToken
      })
    );
    return {
      message: USERS_MESSAGES.LOGIN_SUCCESS,
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
          updatedAt: "$$NOW"
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
    const emailVerifyToken = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified });
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          email_verify_token: emailVerifyToken,
          updatedAt: "$$NOW"
        }
      }
    ])
    return {
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS,
      errCode: 0
    };
  }

  private async signForgotPasswordToken({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id: new ObjectId(user_id),
        token_type: TokenType.ForgotPasswordToken,
        verify
      },
      privateKey: process.env.FORGOT_PASSWORD_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    });
  }

  async forgotPassword({ user_id, verify }: { user_id: string, verify: UserVerifyStatus }) {
    const forgotPasswordToken = await this.signForgotPasswordToken({ user_id, verify });
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token: forgotPasswordToken,
          updateAt: "$$NOW"
        }
      }
    ])
    console.log(forgotPasswordToken);
    return {
      message: USERS_MESSAGES.FORGOT_PASSWORD_SUCCESS,
      errCode: 0
    };
  }

  async resetPassword(user_id: string, { new_password }: ResetPasswordRequest) {
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          password: hashPassword(new_password),
          updateAt: "$$NOW"
        }
      }
    ])
    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS,
      errCode: 0
    };
  }

  async getMe(user_id: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
        }
      });
    if (!user) {
      return {
        message: USERS_MESSAGES.USER_NOT_FOUND,
        errCode: 1
      };
    }
    return {
      message: USERS_MESSAGES.GET_ME_SUCCESS,
      errCode: 0,
      data: user
    };
  }

  async updateMe(user_id: string, body: UpdateMeRequest) {
    const _body = body.date_of_birth ? { ...body, date_of_birth: new Date(body.date_of_birth) } : body;
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
          ..._body,
          updatedAt: "$$NOW"
        }
      }
    ])
    const user_updated = await databaseService.users.findOne({ _id: new ObjectId(user_id) }, {
      projection: {
        password: 0,
        email_verify_token: 0,
        forgot_password_token: 0,
      }
    });
    return {
      message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
      errCode: 0,
      data: user_updated
    };
  }

  async getProfile(username: string) {
    const user = await databaseService.users.findOne({ username },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
        }
      }
    );
    if (!user) {
      return {
        message: USERS_MESSAGES.USER_NOT_FOUND,
        errCode: 1
      };
    }
    return {
      message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
      errCode: 0,
      data: user
    };
  }

  async follow(user_id: string, user_id_to_follow: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id_to_follow) });
    if (!user) {
      return {
        message: USERS_MESSAGES.USER_TO_FOLLOW_NOT_FOUND,
        errCode: 1
      };
    }
    const follower = await databaseService.followers.findOne({ user_id: new ObjectId(user_id), user_id_to_follow: new ObjectId(user_id_to_follow) });
    if (follower) {
      return {
        message: USERS_MESSAGES.FOLLOW_ALREADY_EXIST,
        errCode: 1
      };
    } else {
      await databaseService.followers.insertOne(
        new Follower({
          user_id: new ObjectId(user_id),
          user_id_to_follow: new ObjectId(user_id_to_follow),
          createdAt: new Date()
        })
      );
    }
    return {
      message: USERS_MESSAGES.FOLLOW_SUCCESS,
      errCode: 0
    };
  }

  async unfollow(user_id: string, user_id_to_follow: string) {
    const follower = await databaseService.followers.findOne({ user_id: new ObjectId(user_id), user_id_to_follow: new ObjectId(user_id_to_follow) });
    if (!follower) {
      return {
        message: USERS_MESSAGES.FOLLOW_NOT_FOUND,
        errCode: 1
      };
    }
    await databaseService.followers.deleteOne({ user_id: new ObjectId(user_id), user_id_to_follow: new ObjectId(user_id_to_follow) });
    return {
      message: USERS_MESSAGES.UNFOLLOW_SUCCESS,
      errCode: 0
    };

  }

  async changePassword(user_id: string, body: ChangePasswordRequest) {
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          password: hashPassword(body.new_password),
          updatedAt: "$$NOW"
        }
      }
    ])
    return {
      message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS,
      errCode: 0
    };
  }
}

const usersService = new UsersService();
export default usersService;
