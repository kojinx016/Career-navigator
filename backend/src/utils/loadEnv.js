import fs from "node:fs";
import path from "node:path";

function parseEnvLine(line) {
  const trimmedLine = line.trim();

  if (!trimmedLine || trimmedLine.startsWith("#")) {
    return null;
  }

  const separatorIndex = trimmedLine.indexOf("=");
  if (separatorIndex === -1) {
    return null;
  }

  const key = trimmedLine.slice(0, separatorIndex).trim().replace(/^\uFEFF/, "");
  const value = trimmedLine.slice(separatorIndex + 1).trim();

  if (!key) {
    return null;
  }

  return [key, value];
}

export function loadBackendEnv() {
  const envCandidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "backend/.env"),
    path.resolve(process.cwd(), "../.env"),
  ].filter((envPath, index, allPaths) => allPaths.indexOf(envPath) === index);

  for (const envPath of envCandidates) {
    if (!fs.existsSync(envPath)) {
      continue;
    }

    const fileContents = fs.readFileSync(envPath, "utf8");
    for (const line of fileContents.split(/\r?\n/)) {
      const parsedLine = parseEnvLine(line);
      if (!parsedLine) {
        continue;
      }

      const [key, value] = parsedLine;
      if (process.env[key] === undefined || process.env[key] === "") {
        process.env[key] = value;
      }
    }
  }
}