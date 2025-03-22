import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.7f6io.mongodb.net/twitter-dev?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
      try {
            await client.connect();
            console.log("Connected to the database successfully");
            const database = client.db('twitter-dev');
      } catch (err) {
            console.error("Connection failed", err);
      } finally {
            await client.close();
      }
}

export { run };
