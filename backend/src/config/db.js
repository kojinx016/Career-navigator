import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

async function connectToMemoryDatabase() {
  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri();
  await mongoose.connect(memoryUri);
  return { mode: "memory" };
}

export async function connectToDatabase() {
  const externalUri = process.env.MONGODB_URI?.trim();

  if (externalUri) {
    try {
      await mongoose.connect(externalUri);
      return { mode: "atlas" };
    } catch (error) {
      console.warn("MongoDB connection failed, falling back to in-memory database.");
      console.warn(error instanceof Error ? error.message : error);
    }
  }

  return connectToMemoryDatabase();
}

export async function disconnectDatabase() {
  await mongoose.connection.close();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = undefined;
  }
}