import fs from "node:fs";
import path from "node:path";
import { loadBackendEnv } from "../src/utils/loadEnv.js";
import { extractResumeText, extractSkillsFromResumeText } from "../src/utils/resumeExtraction.js";

loadBackendEnv();

const resumePath = process.argv[2];

if (!resumePath) {
  throw new Error("Resume path argument is required.");
}

const absolutePath = path.resolve(resumePath);
const buffer = fs.readFileSync(absolutePath);

const extractedText = await extractResumeText({
  buffer,
  mimetype: "application/pdf",
});

console.log(`resume=${absolutePath}`);
console.log(`textLength=${extractedText.length}`);

const detectedSkills = extractSkillsFromResumeText(extractedText);
console.log(JSON.stringify({ detectedSkills }, null, 2));