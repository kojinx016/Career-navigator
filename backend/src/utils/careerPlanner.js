import OpenAI from "openai";
import { buildSkillGap, calculateMatch, recommendations } from "./careerLogic.js";

const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
const DEFAULT_GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";
const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";

function clampArray(value, maxItems) {
  return Array.isArray(value) ? value.slice(0, maxItems) : [];
}

function cleanString(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function getAIProviderConfig() {
  const geminiApiKey = process.env.GEMINIAI_API_KEY?.trim() || process.env.GEMINI_API_KEY?.trim();
  if (geminiApiKey) {
    return {
      provider: "gemini",
      model: process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL,
      client: new OpenAI({
        apiKey: geminiApiKey,
        baseURL: process.env.GEMINI_BASE_URL?.trim() || DEFAULT_GEMINI_BASE_URL,
        timeout: 10000,
      }),
    };
  }

  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  if (openAiKey) {
    return {
      provider: "openai",
      model: process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL,
      client: new OpenAI({
        apiKey: openAiKey,
        baseURL: process.env.OPENAI_BASE_URL?.trim() || undefined,
        timeout: 10000,
      }),
    };
  }

  return null;
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function estimateWeeklyLoad(weeklyHours) {
  if (weeklyHours >= 12) {
    return "aggressive";
  }

  if (weeklyHours >= 6) {
    return "steady";
  }

  return "light";
}

function findTargetJob(jobs, targetRole, skills) {
  const normalizedRole = normalizeText(targetRole);

  if (normalizedRole) {
    const exactMatch = jobs.find((job) => normalizeText(job.title) === normalizedRole);
    if (exactMatch) {
      return exactMatch;
    }

    const partialMatch = jobs.find((job) => normalizeText(job.title).includes(normalizedRole));
    if (partialMatch) {
      return partialMatch;
    }
  }

  return [...jobs]
    .map((job) => ({ job, match: calculateMatch(job.requiredSkills, skills) }))
    .sort((left, right) => right.match - left.match)[0]?.job || jobs[0] || null;
}

function buildRoadmap({ targetJob, missingSkills, experienceLevel, weeklyHours }) {
  const learningLoad = estimateWeeklyLoad(weeklyHours);
  const primarySkills = missingSkills.slice(0, 3);
  const secondarySkills = missingSkills.slice(3, 6);
  const roleName = targetJob?.title || "your next role";
  const experienceLabel = experienceLevel === "student" ? "student/early learner" : experienceLevel;

  return [
    {
      phase: "0-30 days",
      objective: `Build a foundation for ${roleName}`,
      actions: [
        `Review your current profile as a ${experienceLabel} candidate and refine resume bullets around measurable impact.`,
        ...(primarySkills.length > 0
          ? primarySkills.map((skill) => `Study ${skill} fundamentals and complete one guided exercise each week.`)
          : ["Document your strongest skills and map them to target job requirements."]),
        `Maintain a ${learningLoad} learning schedule with ${weeklyHours} hour(s) per week.`,
      ],
    },
    {
      phase: "31-60 days",
      objective: `Turn learning into portfolio proof for ${roleName}`,
      actions: [
        ...(primarySkills.length > 0
          ? [`Build one focused project that demonstrates ${primarySkills.join(", ")}.`]
          : ["Build one focused project that demonstrates your strongest target-role skills."]),
        ...(secondarySkills.length > 0
          ? secondarySkills.map((skill) => `Add ${skill} into your project scope or a mini prototype.`)
          : ["Add deployment, documentation, and testing quality to your project."]),
        `Update LinkedIn and portfolio with concrete outcomes and screenshots.`,
      ],
    },
    {
      phase: "61-90 days",
      objective: `Shift from preparation to applications for ${roleName}`,
      actions: [
        `Apply to roles similar to ${roleName} and tailor each application to the job description.`,
        `Run mock interview prep based on ${targetJob?.requiredSkills?.slice(0, 3).join(", ") || "core role skills"}.`,
        `Track applications weekly and use follow-up outreach within 5-7 business days.`,
      ],
    },
  ];
}

function buildProjectIdeas(targetJob, missingSkills) {
  const title = targetJob?.title || "Target Role";
  const skillsToShow = (missingSkills.length > 0 ? missingSkills : targetJob?.requiredSkills || []).slice(0, 3);

  return [
    {
      title: `${title} Portfolio Project`,
      description: `Create a project that mirrors a real workflow for ${title} and demonstrates business impact, not just technical setup.`,
      skills: skillsToShow,
    },
    {
      title: `${title} Case Study Write-up`,
      description: `Write a short case study describing the problem, your approach, architecture, tradeoffs, and measurable outcome.`,
      skills: skillsToShow.slice(0, 2),
    },
  ];
}

export function buildCareerPlan({ skills, jobs, targetRole, experienceLevel, weeklyHours }) {
  const targetJob = findTargetJob(jobs, targetRole, skills);

  if (!targetJob) {
    return {
      generationMode: "fallback",
      provider: null,
      fallbackReason: "No jobs are available yet to build a plan.",
      summary: "No jobs are available yet to build a plan.",
      profileSkills: skills,
      topMatches: [],
      strengths: [],
      focusAreas: [],
      roadmap: [],
      projectIdeas: [],
      nextSteps: [],
    };
  }

  const topMatches = [...jobs]
    .map((job) => ({
      ...job.toJSON(),
      match: calculateMatch(job.requiredSkills, skills),
    }))
    .sort((left, right) => right.match - left.match)
    .slice(0, 3);

  const { matchingSkills, missingSkills } = buildSkillGap(targetJob.requiredSkills, skills);
  const focusAreas = missingSkills.slice(0, 5).map((skill) => ({
    skill,
    reason: `${skill} appears in the target role requirements for ${targetJob.title}.`,
    recommendation: recommendations[skill] || `Build a mini project or complete a focused course on ${skill}.`,
  }));

  const nextSteps = [
    `Prioritize ${missingSkills[0] || matchingSkills[0] || "one high-value skill"} this week.`,
    `Tailor your resume toward ${targetJob.title} using ${matchingSkills.slice(0, 3).join(", ") || "your strongest skills"}.`,
    `Apply to ${topMatches[0]?.title || targetJob.title} style roles after shipping one proof-of-skill project.`,
  ];

  return {
    generationMode: "fallback",
    provider: null,
    fallbackReason: null,
    summary: `You are currently best aligned with ${targetJob.title}. The plan focuses on closing ${missingSkills.length} skill gap(s) while packaging your current strengths into stronger applications.`,
    profileSkills: skills,
    targetRole: targetJob.toJSON(),
    topMatches,
    strengths: matchingSkills,
    focusAreas,
    roadmap: buildRoadmap({
      targetJob,
      missingSkills,
      experienceLevel,
      weeklyHours,
    }),
    projectIdeas: buildProjectIdeas(targetJob, missingSkills),
    nextSteps,
  };
}

function createEnhancementPrompt({ plan, targetRole, experienceLevel, weeklyHours }) {
  return [
    "You are a career planning agent.",
    "Enhance the provided deterministic career plan without inventing unsupported user skills.",
    "Keep the response practical, concise, and job-focused.",
    "Return valid JSON only with this exact shape:",
    JSON.stringify({
      summary: "string",
      focusAreas: [{ skill: "string", reason: "string", recommendation: "string" }],
      roadmap: [{ phase: "string", objective: "string", actions: ["string"] }],
      projectIdeas: [{ title: "string", description: "string", skills: ["string"] }],
      nextSteps: ["string"],
    }),
    `Target role input: ${targetRole || "best fit role"}`,
    `Experience level: ${experienceLevel}`,
    `Weekly hours: ${weeklyHours}`,
    `Base plan: ${JSON.stringify(plan)}`,
  ].join("\n");
}

function extractMessageContent(completion) {
  const content = completion.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item === "string" ? item : item?.type === "text" ? item.text : ""))
      .join("")
      .trim();
  }

  return "";
}

function mergeAIEnhancement(plan, enhancement, provider) {
  const mergedFocusAreas = clampArray(enhancement.focusAreas, 5)
    .map((area, index) => ({
      skill: cleanString(area?.skill, plan.focusAreas[index]?.skill || `Focus Area ${index + 1}`),
      reason: cleanString(area?.reason, plan.focusAreas[index]?.reason || "Important for the selected role."),
      recommendation: cleanString(area?.recommendation, plan.focusAreas[index]?.recommendation || "Study and apply this skill in a project."),
    }));

  const mergedRoadmap = clampArray(enhancement.roadmap, 3)
    .map((phase, index) => ({
      phase: cleanString(phase?.phase, plan.roadmap[index]?.phase || `Phase ${index + 1}`),
      objective: cleanString(phase?.objective, plan.roadmap[index]?.objective || "Advance toward the target role."),
      actions: clampArray(phase?.actions, 5).map((action) => cleanString(action)).filter(Boolean),
    }))
    .filter((phase) => phase.actions.length > 0);

  const mergedProjectIdeas = clampArray(enhancement.projectIdeas, 3)
    .map((project, index) => ({
      title: cleanString(project?.title, plan.projectIdeas[index]?.title || `Project Idea ${index + 1}`),
      description: cleanString(project?.description, plan.projectIdeas[index]?.description || "Create a proof-of-skill project."),
      skills: clampArray(project?.skills, 4).map((skill) => cleanString(skill)).filter(Boolean),
    }))
    .filter((project) => project.title && project.description);

  const mergedNextSteps = clampArray(enhancement.nextSteps, 5).map((step) => cleanString(step)).filter(Boolean);

  return {
    ...plan,
    generationMode: "ai",
    provider,
    fallbackReason: null,
    summary: cleanString(enhancement.summary, plan.summary),
    focusAreas: mergedFocusAreas.length > 0 ? mergedFocusAreas : plan.focusAreas,
    roadmap: mergedRoadmap.length > 0 ? mergedRoadmap : plan.roadmap,
    projectIdeas: mergedProjectIdeas.length > 0 ? mergedProjectIdeas : plan.projectIdeas,
    nextSteps: mergedNextSteps.length > 0 ? mergedNextSteps : plan.nextSteps,
  };
}

async function enhanceCareerPlanWithAI({ skills, jobs, targetRole, experienceLevel, weeklyHours, basePlan }) {
  const providerConfig = getAIProviderConfig();
  if (!providerConfig) {
    return {
      ...basePlan,
      generationMode: "fallback",
      provider: null,
      fallbackReason: "No Gemini or OpenAI API key is configured for AI plan enhancement.",
    };
  }

  try {
    const completion = await providerConfig.client.chat.completions.create({
      model: providerConfig.model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are an expert career strategist. Return JSON only.",
        },
        {
          role: "user",
          content: createEnhancementPrompt({
            plan: basePlan,
            targetRole,
            experienceLevel,
            weeklyHours,
          }),
        },
      ],
      temperature: 0.4,
    });

    const rawContent = extractMessageContent(completion);
    const parsedContent = JSON.parse(rawContent);
    return mergeAIEnhancement(basePlan, parsedContent, providerConfig.provider);
  } catch (error) {
    return {
      ...basePlan,
      generationMode: "fallback",
      provider: providerConfig.provider,
      fallbackReason: error instanceof Error ? error.message : "AI plan enhancement failed.",
    };
  }
}

export async function generateCareerPlan(input) {
  const basePlan = buildCareerPlan(input);
  return enhanceCareerPlanWithAI({
    ...input,
    basePlan,
  });
}