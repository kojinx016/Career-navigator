import { connectToDatabase, disconnectDatabase } from "../src/config/db.js";
import { loadBackendEnv } from "../src/utils/loadEnv.js";
import { Application } from "../src/models/Application.js";

loadBackendEnv();

const marker = `atlas-test-${Date.now()}`;

try {
  const databaseConnection = await connectToDatabase();

  const created = await Application.create({
    jobRole: "Atlas Connectivity Test",
    company: marker,
    status: "Pending",
    date: new Date().toISOString().slice(0, 10),
  });

  const loaded = await Application.findById(created._id);

  console.log(`mode=${databaseConnection.mode}`);
  console.log(`created=${Boolean(created)}`);
  console.log(`loaded=${Boolean(loaded)}`);
  console.log(`loadedCompany=${loaded?.company || ""}`);

  await Application.deleteOne({ _id: created._id });
  const deleted = await Application.findById(created._id);
  console.log(`deleted=${deleted === null}`);
} finally {
  await disconnectDatabase();
}