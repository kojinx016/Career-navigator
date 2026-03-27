export const sampleSkills = [
  "Python",
  "React",
  "TypeScript",
  "Machine Learning",
  "SQL",
  "Docker",
  "AWS",
  "Node.js",
  "Git",
  "TensorFlow",
  "Data Analysis",
  "Agile",
];

export const recommendations = {
  Python: "Complete a Python for Data Science course on Coursera",
  TensorFlow: "Take the TensorFlow Developer Certificate program",
  "Machine Learning": "Enroll in Andrew Ng's ML Specialization",
  "Deep Learning": "Study the fast.ai practical deep learning course",
  React: "Build projects with React and follow the official docs",
  TypeScript: "Learn TypeScript through the official handbook",
  "Node.js": "Complete The Odin Project's Node.js path",
  PostgreSQL: "Practice SQL on LeetCode and build a CRUD app",
  AWS: "Get AWS Cloud Practitioner certified",
  Docker: "Follow Docker's getting started tutorial",
  Kubernetes: "Take the CKA certification prep course",
  "CI/CD": "Set up GitHub Actions for a personal project",
};

export const profileSuggestions = [
  {
    title: "Quantify Achievements",
    desc: "Add metrics to your resume bullet points (e.g., 'Increased efficiency by 40%').",
  },
  {
    title: "Add Certifications",
    desc: "Get certified in relevant technologies like AWS, Google Cloud, or specific frameworks.",
  },
  {
    title: "Showcase Projects",
    desc: "Build and showcase 2-3 portfolio projects demonstrating your technical skills.",
  },
  {
    title: "Optimize LinkedIn",
    desc: "Update your LinkedIn headline, summary, and add relevant keywords for recruiter visibility.",
  },
  {
    title: "Learn In-Demand Skills",
    desc: "Focus on emerging skills like AI/ML, cloud computing, and data engineering.",
  },
];

export function normalizeSkills(skills = []) {
  return Array.from(
    new Set(
      skills
        .map((skill) => skill?.trim())
        .filter(Boolean)
    )
  );
}

function buildSkillDemand(jobs = []) {
  const skillDemand = new Map();

  jobs.forEach((job) => {
    normalizeSkills(job.requiredSkills).forEach((skill) => {
      const key = skill.toLowerCase();
      const current = skillDemand.get(key);

      if (current) {
        current.demand += 1;
        current.roles.add(`${job.title} at ${job.company}`);
        return;
      }

      skillDemand.set(key, {
        key,
        skill,
        demand: 1,
        roles: new Set([`${job.title} at ${job.company}`]),
      });
    });
  });

  return Array.from(skillDemand.values())
    .map((entry) => ({
      ...entry,
      roles: Array.from(entry.roles),
    }))
    .sort((left, right) => right.demand - left.demand || left.skill.localeCompare(right.skill));
}

export function calculateMatch(requiredSkills, userSkills) {
  if (!requiredSkills.length || !userSkills.length) {
    return 0;
  }

  const normalizedUserSkills = userSkills.map((skill) => skill.toLowerCase());
  const matched = requiredSkills.filter((requiredSkill) => normalizedUserSkills.includes(requiredSkill.toLowerCase()));
  return Math.round((matched.length / requiredSkills.length) * 100);
}

export function buildSkillGap(requiredSkills, userSkills) {
  const normalizedUserSkills = userSkills.map((skill) => skill.toLowerCase());
  const matchingSkills = requiredSkills.filter((requiredSkill) => normalizedUserSkills.includes(requiredSkill.toLowerCase()));
  const missingSkills = requiredSkills.filter((requiredSkill) => !normalizedUserSkills.includes(requiredSkill.toLowerCase()));

  return {
    matchingSkills,
    missingSkills,
    recommendations: missingSkills.map((skill) => ({
      skill,
      recommendation: recommendations[skill] || `Explore tutorials and courses for ${skill}`,
    })),
  };
}

export function extractSkillsFromResume(resumeText = "") {
  const loweredResume = resumeText.toLowerCase();
  return sampleSkills.filter((skill) => loweredResume.includes(skill.toLowerCase()));
}

export function generateCoverLetter({ jobRole, company, skills }) {
  const skillList = skills.length > 0 ? skills.join(", ") : "various technical and professional competencies";
  const topSkills = skills.slice(0, 3).join(", ") || "modern technologies";
  const leadSkill = skills[0] || "technology";

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobRole} position at ${company}. With my expertise in ${skillList}, I am confident in my ability to make meaningful contributions to your team.

Throughout my career, I have developed a robust skill set that aligns well with the requirements of this role. My experience with ${topSkills} has equipped me to tackle complex challenges and deliver impactful solutions.

I am particularly drawn to ${company}'s commitment to innovation and excellence. I believe my background in ${leadSkill} and my passion for continuous learning make me an ideal candidate for this position.

I would welcome the opportunity to discuss how my skills and experience can contribute to ${company}'s continued success. Thank you for considering my application.

Best regards,
[Your Name]`;
}

export function generateProfileImprovement(skills = [], jobs = []) {
  const normalizedSkills = normalizeSkills(skills);
  const normalizedSkillSet = new Set(normalizedSkills.map((skill) => skill.toLowerCase()));
  const serializedJobs = jobs.map((job) => (typeof job.toJSON === "function" ? job.toJSON() : job));
  const topMatches = serializedJobs
    .map((job) => ({
      ...job,
      match: calculateMatch(job.requiredSkills || [], normalizedSkills),
    }))
    .sort((left, right) => right.match - left.match)
    .slice(0, 4);
  const benchmarkRole = topMatches[0] || null;
  const roleReadyCount = topMatches.filter((job) => job.match >= 60).length;
  const averageTopMatch = topMatches.length === 0
    ? 0
    : Math.round(topMatches.reduce((total, job) => total + job.match, 0) / topMatches.length);
  const demandSignals = buildSkillDemand(serializedJobs);
  const strongestSkills = demandSignals
    .filter((entry) => normalizedSkillSet.has(entry.key))
    .slice(0, 5)
    .map((entry) => ({
      skill: entry.skill,
      demand: entry.demand,
      roles: entry.roles.slice(0, 3),
    }));
  const opportunities = demandSignals
    .filter((entry) => !normalizedSkillSet.has(entry.key))
    .slice(0, 5)
    .map((entry) => ({
      skill: entry.skill,
      demand: entry.demand,
      recommendation: recommendations[entry.skill] || `Build a focused practice project and complete one guided course for ${entry.skill}.`,
      roles: entry.roles.slice(0, 3),
    }));
  const profileScore = normalizedSkills.length === 0
    ? 15
    : Math.min(
        100,
        Math.round(
          Math.min(normalizedSkills.length * 7, 28)
          + (benchmarkRole?.match || 0) * 0.42
          + Math.min(roleReadyCount * 10, 20)
          + Math.min(strongestSkills.length * 4, 12)
        )
      );
  const summary = normalizedSkills.length === 0
    ? "Your profile needs baseline data first. Add resume skills so the system can score your market fit and prioritize improvements."
    : benchmarkRole
      ? `Your profile is currently strongest for ${benchmarkRole.title} roles, with the best fit at ${benchmarkRole.company}. The next lift comes from closing a few high-demand gaps and making your evidence more specific.`
      : "Your profile has skill data, but more role-aligned evidence and targeted upskilling would improve recruiter visibility.";

  const priorityActions = normalizedSkills.length === 0
    ? [
        {
          title: "Add your resume or core skills",
          desc: "Upload a resume or add your current skills so the platform can generate role-specific guidance.",
          priority: "High",
          effort: "10 min",
          category: "Foundation",
          reason: "Without skill data, the rest of the profile analysis stays generic.",
        },
        {
          title: "Define your target role",
          desc: "Pick one role you want next so your projects, keywords, and learning plan can stay focused.",
          priority: "High",
          effort: "15 min",
          category: "Positioning",
          reason: "Focused profiles convert better than broad 'open to anything' profiles.",
        },
      ]
    : [
        opportunities[0] && {
          title: `Close the ${opportunities[0].skill} gap`,
          desc: opportunities[0].recommendation,
          priority: "High",
          effort: "2-3 weeks",
          category: "Skills",
          reason: `${opportunities[0].skill} appears frequently across your target roles and is missing from your current profile.`,
        },
        benchmarkRole && {
          title: `Tailor your resume for ${benchmarkRole.title}`,
          desc: `Mirror the language used in ${benchmarkRole.company}-style ${benchmarkRole.title} roles and emphasize ${benchmarkRole.requiredSkills.slice(0, 3).join(", ")}.`,
          priority: benchmarkRole.match >= 70 ? "Medium" : "High",
          effort: "45 min",
          category: "Resume",
          reason: `Your top current benchmark is ${benchmarkRole.match}% aligned, so targeted wording can improve recruiter matching quickly.`,
        },
        {
          title: "Quantify 3 recent wins",
          desc: "Rewrite at least three bullet points using numbers, delivery speed, revenue impact, quality improvements, or time saved.",
          priority: "Medium",
          effort: "30 min",
          category: "Evidence",
          reason: "Specific outcomes outperform task-only descriptions in both ATS filters and recruiter review.",
        },
        {
          title: "Publish one portfolio proof point",
          desc: `Create a project that combines ${[...(strongestSkills.slice(0, 2).map((entry) => entry.skill)), ...(opportunities.slice(0, 1).map((entry) => entry.skill))].filter(Boolean).join(", ")} and document the business outcome clearly.`,
          priority: "Medium",
          effort: "1-2 weeks",
          category: "Portfolio",
          reason: "A concrete project gives hiring teams proof beyond the skills list.",
        },
        {
          title: "Refresh LinkedIn and headline keywords",
          desc: `Align your headline, about section, and featured work with roles like ${topMatches.slice(0, 2).map((job) => job.title).join(" and ") || "your target job"}.`,
          priority: "Low",
          effort: "20 min",
          category: "Visibility",
          reason: "Keyword alignment improves recruiter search visibility without requiring new experience first.",
        },
      ].filter(Boolean);

  const checklist = [
    {
      title: "Resume evidence",
      detail: "Show impact with numbers, ownership, and delivery outcomes.",
      done: normalizedSkills.length > 0,
    },
    {
      title: "Role alignment",
      detail: benchmarkRole ? `Anchor your profile toward ${benchmarkRole.title} openings.` : "Choose a target role before rewriting your profile.",
      done: Boolean(benchmarkRole),
    },
    {
      title: "Market gaps",
      detail: opportunities.length > 0 ? `Prioritize ${opportunities.slice(0, 2).map((entry) => entry.skill).join(" and ")}.` : "Your current skills already cover the strongest market keywords in this dataset.",
      done: opportunities.length === 0,
    },
    {
      title: "Proof of work",
      detail: "Add 1-2 public projects, case studies, or demos that match your next role.",
      done: false,
    },
  ];

  return {
    summary,
    profileScore,
    benchmarkRole,
    stats: {
      skillCount: normalizedSkills.length,
      topMatchScore: benchmarkRole?.match || 0,
      roleReadyCount,
      averageTopMatch,
    },
    strongestSkills,
    opportunities,
    topMatches,
    priorityActions,
    checklist,
    suggestions: priorityActions.map(({ title, desc }) => ({ title, desc })),
  };
}