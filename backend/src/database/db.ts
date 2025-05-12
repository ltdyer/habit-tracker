import { MongoClient, Db } from "mongodb";
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.DB_NAME;

if (!uri || !dbName) {
  throw new Error("MONGODB_URI and DB_NAME must be set in environment variables");
}

const client = new MongoClient(uri);
let db: Db | undefined;

export async function connectToMongo(): Promise<void> {
  try {
    console.log("MongoDB URI:", uri);
    console.log("MongoDB DB Name:", dbName);
    mongoose.connect(uri, {
      dbName: "sample_mflix"
    })
    console.log(`✅ Connected to MongoDB: ${dbName}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

export function getDb(): Db {
  if (!db) {
    throw new Error("❗ Call connectToMongo() before calling getDb()");
  }
  return db;
}
