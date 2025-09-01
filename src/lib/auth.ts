import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, connectDB } from "./db";

await connectDB();

// pick database name (from env or fallback)
const dbName = process.env.MONGODB_DB;

export const auth = betterAuth({
  database: mongodbAdapter(client.db(dbName)), // ✅ pass Db, not MongoClient
   providers: [
    {
      name: "github",
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      // Optional: define scopes if needed
      scope: "read:user user:email",
    },
  ],
});
