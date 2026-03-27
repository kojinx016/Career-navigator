import { Router } from "express";
import { Application } from "../models/Application.js";

export const applicationsRouter = Router();

applicationsRouter.get("/", async (_req, res) => {
  const applications = await Application.find().sort({ date: -1, createdAt: -1 });
  res.json(applications);
});

applicationsRouter.post("/", async (req, res) => {
  const { jobRole, company } = req.body;

  if (!jobRole?.trim() || !company?.trim()) {
    return res.status(400).json({ message: "Job role and company are required." });
  }

  const application = await Application.create({
    jobRole: jobRole.trim(),
    company: company.trim(),
    status: "Pending",
    date: new Date().toISOString().slice(0, 10),
  });

  return res.status(201).json(application);
});

applicationsRouter.patch("/:id/status", async (req, res) => {
  const { status } = req.body;

  if (!["Applied", "Pending", "Rejected", "Interview"].includes(status)) {
    return res.status(400).json({ message: "Invalid application status." });
  }

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!application) {
    return res.status(404).json({ message: "Application not found." });
  }

  return res.json(application);
});

applicationsRouter.delete("/:id", async (req, res) => {
  const application = await Application.findByIdAndDelete(req.params.id);

  if (!application) {
    return res.status(404).json({ message: "Application not found." });
  }

  return res.status(204).send();
});