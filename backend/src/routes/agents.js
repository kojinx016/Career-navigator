import { Router } from "express";
import { Job } from "../models/Job.js";
import { Profile } from "../models/Profile.js";
import { normalizeSkills } from "../utils/careerLogic.js";
import { generateCareerPlan } from "../utils/careerPlanner.js";

export const agentsRouter = Router();

async function getProfileSkills() {
  const profile = await Profile.findOne({ singletonKey: "default" });
  return normalizeSkills(profile?.skills || []);
}

agentsRouter.post("/career-plan", async (req, res) => {
  const bodySkills = Array.isArray(req.body.skills) ? normalizeSkills(req.body.skills) : [];
  const skills = bodySkills.length > 0 ? bodySkills : await getProfileSkills();

  if (skills.length === 0) {
    return res.status(400).json({
      message: "Add or extract skills before generating a career plan.",
    });
  }

  const jobs = await Job.find();
  const targetRole = String(req.body.targetRole || "").trim();
  const experienceLevel = String(req.body.experienceLevel || "entry").trim().toLowerCase();
  const weeklyHours = Math.max(1, Number(req.body.weeklyHours || 6));

  return res.json(await generateCareerPlan({
    skills,
    jobs,
    targetRole,
    experienceLevel,
    weeklyHours,
  }));
});