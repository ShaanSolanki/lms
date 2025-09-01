import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

// Create a single MongoClient instance
export const client = new MongoClient(uri);

export async function connectDB() {
  // Safe to call multiple times, will reuse the connection
  await client.connect();
  return client;
}
