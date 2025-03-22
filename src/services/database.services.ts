import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";
import User from "../models/schemas/User.schema.js";

dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.7f6io.mongodb.net/twitter-dev?retryWrites=true&w=majority`;
const client = new MongoClient(uri);


class DatabaseService {
      private client: MongoClient;
      private db: Db;

      constructor() {
            this.client = new MongoClient(uri);
            this.db = this.client.db(process.env.DB_NAME);
      }

      async connect() {
            try {
                  await this.client.connect();
            } catch (err) {
                  console.error("Connection failed", err);
            }
      }

      get users(): Collection<User> {
            return this.db.collection(process.env.DB_COLLLECTION_USERS as string);
      }
}

const databaseService = new DatabaseService();
export default databaseService;
