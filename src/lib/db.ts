import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

// Create a single MongoClient instance
export const client = new MongoClient(uri);

export async function connectDB() {
  // Safe to call multiple times, will reuse the connection
  await client.connect();
  return client;
}
