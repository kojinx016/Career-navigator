import fs from "node:fs";
import path from "node:path";
import { loadBackendEnv } from "../src/utils/loadEnv.js";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend/.env"),
  path.resolve(process.cwd(), "../.env"),
].filter((envPath, index, allPaths) => allPaths.indexOf(envPath) === index);

for (const envPath of envCandidates) {
  console.log(`candidate=${envPath}`);
  console.log(`exists=${fs.existsSync(envPath)}`);
  if (fs.existsSync(envPath)) {
    const text = fs.readFileSync(envPath, "utf8");
    console.log(`length=${text.length}`);
    console.log(`hasGemini=${/GEMINI(AI)?_API_KEY\s*=/.test(text)}`);
  }
}

loadBackendEnv();
console.log(`loadedGemini=${Boolean(process.env.GEMINIAI_API_KEY || process.env.GEMINI_API_KEY)}`);
console.log(`loadedOpenAI=${Boolean(process.env.OPENAI_API_KEY)}`);