import User from '~/models/schemas/User.schema.js';
import databaseService from '~/services/database.services.js';
import { RegisterRequest } from '~/models/requests/User.requests.js';
import hashPassword from '~/utils/crypto.js';
import { signToken } from '~/utils/jwt.js';
import { TokenType } from '~/constants/enum.js';
import { SignOptions } from 'jsonwebtoken';

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
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
        user_id,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    });
  }

  async registerUser(user: RegisterRequest) {
    try {
      const result = await databaseService.users.insertOne(
        new User({
          ...user,
          date_of_birth: new Date(user.date_of_birth),
          password: hashPassword(user.password)
        })
      );
      const user_id = result.insertedId.toString();
      const [accessToken, refreshToken] = await Promise.all([
        this.signAccessToken(user_id),
        this.signRefreshToken(user_id)
      ]);
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
        refreshToken
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
}

const usersService = new UsersService();
export default usersService;
