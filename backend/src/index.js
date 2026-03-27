import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import { agentsRouter } from "./routes/agents.js";
import { connectToDatabase, disconnectDatabase } from "./config/db.js";
import { seedDatabase } from "./data/seed.js";
import { applicationsRouter } from "./routes/applications.js";
import { contentRouter } from "./routes/content.js";
import { jobsRouter } from "./routes/jobs.js";
import { profileRouter } from "./routes/profile.js";
import { loadBackendEnv } from "./utils/loadEnv.js";

dotenv.config();
loadBackendEnv();

const app = express();
const port = Number(process.env.PORT || 5050);
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";

app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const allowedOrigins = [frontendUrl, "http://localhost:8080", "http://localhost:8081", "http://127.0.0.1:8080", "http://127.0.0.1:8081"];
    const isLocalhostOrigin = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

    if (allowedOrigins.includes(origin) || isLocalhostOrigin) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/agents", agentsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/content", contentRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/profile", profileRouter);

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Resume file must be 8 MB or smaller." });
    }

    return res.status(400).json({ message: err.message || "Invalid file upload." });
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

const server = await bootstrap();

async function bootstrap() {
  const databaseConnection = await connectToDatabase();
  await seedDatabase();
  console.log(`Database ready (${databaseConnection.mode})`);

  return app.listen(port, () => {
    console.log(`Backend API listening on http://localhost:${port}`);
  });
}

async function shutdown() {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  await disconnectDatabase();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);