import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { github } from "better-auth/providers";
import { client, connectDB } from "./db";

await connectDB();

// pick database name (from env or fallback)
const dbName = process.env.MONGODB_DB;

export const auth = betterAuth({
  database: mongodbAdapter(client.db(dbName)),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
