import { Router } from "express";
import multer from "multer";
import { Job } from "../models/Job.js";
import { generateCoverLetter, generateProfileImprovement } from "../utils/careerLogic.js";
import { extractResumeText, extractSkillsFromResumeText, validateResumeFile } from "../utils/resumeExtraction.js";

export const contentRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

contentRouter.post("/skills/extract", upload.single("resume"), async (req, res) => {
  try {
    validateResumeFile(req.file);
    const extractedText = await extractResumeText(req.file);

    if (!extractedText) {
      return res.status(400).json({ message: "The uploaded resume could not be read. Try a clearer PDF or image." });
    }

    const detectedSkills = extractSkillsFromResumeText(extractedText);
    return res.json({
      detectedSkills,
      extractedTextLength: extractedText.length,
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Unable to extract skills from the uploaded resume.",
    });
  }
});

contentRouter.post("/cover-letter/generate", async (req, res) => {
  const { jobRole, company, skills = [] } = req.body;

  if (!jobRole?.trim() || !company?.trim()) {
    return res.status(400).json({ message: "Job role and company are required." });
  }

  return res.json({
    letter: generateCoverLetter({
      jobRole: jobRole.trim(),
      company: company.trim(),
      skills,
    }),
  });
});

contentRouter.get("/profile-suggestions", async (req, res) => {
  const skills = String(req.query.skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  const jobs = await Job.find();

  res.json(generateProfileImprovement(skills, jobs));
});