import User from "~/models/schemas/User.schema.js"
import databaseService from "~/services/database.services.js"

class UsersService {
      async registerUser(email: string, password: string) {
            try {
                  const result = await databaseService.users.insertOne(new User({
                        email,
                        password
                  }));
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

}

const usersService = new UsersService();
export default usersService;