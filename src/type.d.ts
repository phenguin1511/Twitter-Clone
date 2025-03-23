import { Request } from 'express';
import { User } from './models/User.js';


declare module 'express' {
      interface Request {
            user?: User
      }
}
