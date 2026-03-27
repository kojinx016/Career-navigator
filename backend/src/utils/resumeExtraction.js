import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";

const supportedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const skillPatterns = [
  { skill: "Python", patterns: [/\bpython\b/i] },
  { skill: "Java", patterns: [/\bjava\b/i] },
  { skill: "JavaScript", patterns: [/\bjavascript\b/i] },
  { skill: "TypeScript", patterns: [/\btypescript\b/i] },
  { skill: "C", patterns: [/\bc language\b/i, /\bc programming\b/i, /\b(?<![+#])c(?![+#])\b/i] },
  { skill: "C++", patterns: [/\bc\+\+\b/i] },
  { skill: "HTML", patterns: [/\bhtml5?\b/i] },
  { skill: "CSS", patterns: [/\bcss3?\b/i] },
  { skill: "SQL", patterns: [/\bsql\b/i] },
  { skill: "MongoDB", patterns: [/\bmongodb\b/i, /\bmongo db\b/i] },
  { skill: "MySQL", patterns: [/\bmysql\b/i] },
  { skill: "PostgreSQL", patterns: [/\bpostgresql\b/i, /\bpostgres\b/i] },
  { skill: "React", patterns: [/\breact(?:\.js|js)?\b/i] },
  { skill: "Node.js", patterns: [/\bnode(?:\.js|js)?\b/i] },
  { skill: "Express.js", patterns: [/\bexpress(?:\.js|js)?\b/i] },
  { skill: "Next.js", patterns: [/\bnext(?:\.js|js)?\b/i] },
  { skill: "Tailwind CSS", patterns: [/\btailwind(?:\s+css)?\b/i] },
  { skill: "Bootstrap", patterns: [/\bbootstrap\b/i] },
  { skill: "REST API", patterns: [/\brest api\b/i, /\brestful api\b/i] },
  { skill: "Git", patterns: [/\bgit\b/i] },
  { skill: "GitHub", patterns: [/\bgithub\b/i] },
  { skill: "Docker", patterns: [/\bdocker\b/i] },
  { skill: "Kubernetes", patterns: [/\bkubernetes\b/i] },
  { skill: "AWS", patterns: [/\baws\b/i, /\bamazon web services\b/i] },
  { skill: "Azure", patterns: [/\bazure\b/i] },
  { skill: "TensorFlow", patterns: [/\btensorflow\b/i] },
  { skill: "Machine Learning", patterns: [/\bmachine learning\b/i] },
  { skill: "Deep Learning", patterns: [/\bdeep learning\b/i] },
  { skill: "Data Analysis", patterns: [/\bdata analysis\b/i] },
  { skill: "Data Structures", patterns: [/\bdata structures?\b/i] },
  { skill: "Algorithms", patterns: [/\balgorithms?\b/i] },
  { skill: "OOP", patterns: [/\boop\b/i, /\bobject oriented programming\b/i] },
  { skill: "DSA", patterns: [/\bdsa\b/i] },
  { skill: "Problem Solving", patterns: [/\bproblem solving\b/i] },
  { skill: "NLP", patterns: [/\bnlp\b/i, /\bnatural language processing\b/i] },
  { skill: "Computer Vision", patterns: [/\bcomputer vision\b/i] },
  { skill: "Pandas", patterns: [/\bpandas\b/i] },
  { skill: "NumPy", patterns: [/\bnumpy\b/i] },
  { skill: "Scikit-learn", patterns: [/\bscikit[-\s]?learn\b/i, /\bsklearn\b/i] },
  { skill: "Linux", patterns: [/\blinux\b/i] },
  { skill: "CI/CD", patterns: [/\bci\/cd\b/i, /\bcontinuous integration\b/i, /\bcontinuous deployment\b/i] },
  { skill: "Agile", patterns: [/\bagile\b/i] },
  { skill: "Figma", patterns: [/\bfigma\b/i] },
  { skill: "Canva", patterns: [/\bcanva\b/i] },
  { skill: "Power BI", patterns: [/\bpower bi\b/i] },
  { skill: "Excel", patterns: [/\bms excel\b/i, /\bmicrosoft excel\b/i, /\bexcel\b/i] },
  { skill: "Communication", patterns: [/\bcommunication\b/i] },
  { skill: "Leadership", patterns: [/\bleadership\b/i] },
  { skill: "Teamwork", patterns: [/\bteamwork\b/i, /\bcollaboration\b/i] },
];

const imageOcrScriptPath = fileURLToPath(new URL("./runImageOcr.js", import.meta.url));

function getResumeFileExtension(mimetype) {
  switch (mimetype) {
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      return ".bin";
  }
}

function buildImageOcrErrorMessage(stderr, signal) {
  const firstUsefulLine = stderr
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("node:") && !line.startsWith("at "));

  if (firstUsefulLine && firstUsefulLine.length < 160) {
    return `${firstUsefulLine} Try a PDF resume or a clearer image.`;
  }

  if (signal) {
    return `Image OCR process exited unexpectedly (${signal}). Try a PDF resume or a clearer image.`;
  }

  return "Image OCR failed. Try a PDF resume or a clearer image.";
}

function runImageOcrProcess(imagePath) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(process.execPath, [imageOcrScriptPath, imagePath], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => {
      childProcess.kill();
      reject(new Error("Image OCR timed out. Try a smaller or clearer image, or upload a PDF instead."));
    }, 45000);

    childProcess.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    childProcess.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    childProcess.on("error", (error) => {
      clearTimeout(timeout);
      reject(new Error(`Image OCR could not be started: ${error.message}`));
    });

    childProcess.on("close", (code, signal) => {
      clearTimeout(timeout);

      if (code === 0) {
        resolve(stdout.trim());
        return;
      }

      reject(new Error(buildImageOcrErrorMessage(stderr, signal)));
    });
  });
}

async function extractImageText(file) {
  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "career-nav-ocr-"));
  const tempImagePath = path.join(tempDirectory, `resume${getResumeFileExtension(file.mimetype)}`);

  try {
    await fs.writeFile(tempImagePath, file.buffer);
    return await runImageOcrProcess(tempImagePath);
  } finally {
    await fs.rm(tempDirectory, { recursive: true, force: true });
  }
}

function normalizeExtractedSkills(skills) {
  return Array.from(
    new Set(
      skills
        .map((skill) => String(skill || "").trim())
        .filter(Boolean)
    )
  );
}

export function validateResumeFile(file) {
  if (!file) {
    throw new Error("Resume file is required.");
  }

  if (!supportedMimeTypes.has(file.mimetype)) {
    throw new Error("Only PDF, JPG, JPEG, PNG, and WEBP resumes are supported.");
  }
}

export async function extractResumeText(file) {
  validateResumeFile(file);

  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: file.buffer });
    const parsedDocument = await parser.getText();
    await parser.destroy();
    return parsedDocument.text?.trim() || "";
  }

  return extractImageText(file);
}

export function extractSkillsFromResumeText(resumeText) {
  if (!resumeText.trim()) {
    return [];
  }

  const detectedSkills = skillPatterns
    .filter(({ patterns }) => patterns.some((pattern) => pattern.test(resumeText)))
    .map(({ skill }) => skill);

  return normalizeExtractedSkills(detectedSkills);
}