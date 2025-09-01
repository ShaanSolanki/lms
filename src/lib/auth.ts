import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, connectDB } from "./db";

await connectDB();

// pick database name (from env or fallback)
const dbName = process.env.MONGODB_DB;

export const auth = betterAuth({
  database: mongodbAdapter(client.db(dbName)), // ✅ pass Db, not MongoClient
});
