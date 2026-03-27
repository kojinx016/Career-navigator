import { Router } from "express";
import { Profile } from "../models/Profile.js";
import { normalizeSkills } from "../utils/careerLogic.js";

export const profileRouter = Router();

async function getProfileDocument() {
  const profile = await Profile.findOneAndUpdate(
    { singletonKey: "default" },
    { $setOnInsert: { singletonKey: "default", skills: [] } },
    { upsert: true, new: true }
  );

  return profile;
}

profileRouter.get("/", async (_req, res) => {
  const profile = await getProfileDocument();
  res.json(profile);
});

profileRouter.put("/skills", async (req, res) => {
  const skills = normalizeSkills(req.body.skills || []);
  const profile = await Profile.findOneAndUpdate(
    { singletonKey: "default" },
    { skills },
    { upsert: true, new: true, runValidators: true }
  );

  res.json(profile);
});