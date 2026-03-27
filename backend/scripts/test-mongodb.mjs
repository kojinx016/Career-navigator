import mongoose from "mongoose";
import { loadBackendEnv } from "../src/utils/loadEnv.js";

loadBackendEnv();

const mongoUri = process.env.MONGODB_URI?.trim();

if (!mongoUri) {
  throw new Error("MONGODB_URI is not configured in backend/.env");
}

await mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 15000,
});

console.log(`connected=${mongoose.connection.readyState === 1}`);
console.log(`host=${mongoose.connection.host}`);
console.log(`db=${mongoose.connection.name}`);

await mongoose.disconnect();