import User from '~/models/schemas/User.schema.js';
import databaseService from '~/services/database.services.js';
import { RegisterRequest } from '~/models/requests/User.requests.js';

class UsersService {
  async registerUser(user: RegisterRequest) {
    try {
      const result = await databaseService.users.insertOne(
        new User({
          ...user,
          date_of_birth: new Date(user.date_of_birth)
        })
      );
      return {
        message: 'User created',
        errCode: 0,
        data: result
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
