import { Router } from "express";
import { Job } from "../models/Job.js";
import { buildSkillGap, calculateMatch } from "../utils/careerLogic.js";

export const jobsRouter = Router();

function parseSkills(rawSkills) {
  if (!rawSkills) {
    return [];
  }

  return rawSkills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

jobsRouter.get("/matches", async (req, res) => {
  const skills = parseSkills(req.query.skills);
  const jobs = await Job.find();

  const matches = jobs
    .map((job) => ({
      ...job.toJSON(),
      match: calculateMatch(job.requiredSkills, skills),
    }))
    .sort((left, right) => right.match - left.match);

  res.json(matches);
});

jobsRouter.get("/:id/skill-gap", async (req, res) => {
  const skills = parseSkills(req.query.skills);
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Job not found." });
  }

  return res.json({
    job: job.toJSON(),
    ...buildSkillGap(job.requiredSkills, skills),
  });
});

jobsRouter.get("/", async (_req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});