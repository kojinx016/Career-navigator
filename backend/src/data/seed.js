import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { Profile } from "../models/Profile.js";

const jobs = [
  {
    title: "AI/ML Engineer",
    company: "TechCorp",
    requiredSkills: ["Python", "TensorFlow", "Machine Learning", "Deep Learning", "SQL", "Docker"],
    description: "Build and deploy ML models at scale.",
    salary: "$140k - $180k",
  },
  {
    title: "Full Stack Developer",
    company: "WebFlow Inc",
    requiredSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Git"],
    description: "Develop end-to-end web applications.",
    salary: "$120k - $160k",
  },
  {
    title: "Data Scientist",
    company: "DataDriven",
    requiredSkills: ["Python", "R", "Statistics", "Machine Learning", "Pandas", "Visualization"],
    description: "Analyze data and build predictive models.",
    salary: "$130k - $170k",
  },
  {
    title: "DevOps Engineer",
    company: "CloudScale",
    requiredSkills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Linux"],
    description: "Manage cloud infrastructure and deployment pipelines.",
    salary: "$125k - $165k",
  },
  {
    title: "Product Manager",
    company: "InnovateTech",
    requiredSkills: ["Product Strategy", "Agile", "Data Analysis", "UX Design", "Communication", "Roadmapping"],
    description: "Lead product vision and cross-functional teams.",
    salary: "$135k - $175k",
  },
  {
    title: "Cybersecurity Analyst",
    company: "SecureNet",
    requiredSkills: ["Network Security", "SIEM", "Penetration Testing", "Firewalls", "Python", "Compliance"],
    description: "Protect digital assets and monitor threats.",
    salary: "$115k - $155k",
  },
  {
    title: "Frontend Engineer",
    company: "FigmaFlow",
    requiredSkills: ["React", "TypeScript", "CSS", "HTML", "Figma", "Testing"],
    description: "Build polished, accessible user interfaces for collaborative design tools.",
    salary: "$118k - $150k",
  },
  {
    title: "Backend Engineer",
    company: "LedgerStack",
    requiredSkills: ["Node.js", "Express.js", "PostgreSQL", "REST API", "Docker", "Git"],
    description: "Design and maintain backend services for financial workflow products.",
    salary: "$125k - $162k",
  },
  {
    title: "Data Engineer",
    company: "Northstar Analytics",
    requiredSkills: ["Python", "SQL", "AWS", "Docker", "CI/CD", "Linux"],
    description: "Build reliable data pipelines and data platform tooling for analytics teams.",
    salary: "$132k - $172k",
  },
  {
    title: "Cloud Engineer",
    company: "SkyGrid Systems",
    requiredSkills: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "Linux"],
    description: "Automate and manage multi-cloud infrastructure for enterprise applications.",
    salary: "$128k - $168k",
  },
  {
    title: "MLOps Engineer",
    company: "VectorHive",
    requiredSkills: ["Python", "Machine Learning", "Docker", "Kubernetes", "CI/CD", "AWS"],
    description: "Operationalize machine learning models and build deployment workflows for AI teams.",
    salary: "$138k - $182k",
  },
  {
    title: "Mobile App Developer",
    company: "PulsePay",
    requiredSkills: ["React", "TypeScript", "REST API", "Git", "Agile", "Testing"],
    description: "Develop and maintain mobile-first product experiences for consumer finance users.",
    salary: "$112k - $148k",
  },
  {
    title: "QA Automation Engineer",
    company: "BrightLayer",
    requiredSkills: ["JavaScript", "TypeScript", "CI/CD", "Git", "Docker", "Problem Solving"],
    description: "Own automated test coverage and improve product release confidence across teams.",
    salary: "$102k - $138k",
  },
  {
    title: "Site Reliability Engineer",
    company: "ScaleForge",
    requiredSkills: ["Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Python"],
    description: "Improve reliability, observability, and incident response for distributed systems.",
    salary: "$135k - $178k",
  },
  {
    title: "Business Intelligence Analyst",
    company: "Meridian Retail",
    requiredSkills: ["SQL", "Power BI", "Excel", "Data Analysis", "Communication", "Problem Solving"],
    description: "Deliver dashboards and insights that support pricing and merchandising decisions.",
    salary: "$88k - $118k",
  },
  {
    title: "AI Research Assistant",
    company: "NovaMind Labs",
    requiredSkills: ["Python", "Machine Learning", "Deep Learning", "NLP", "Pandas", "NumPy"],
    description: "Support applied AI research experiments and evaluate model quality for new initiatives.",
    salary: "$98k - $132k",
  },
  {
    title: "Solutions Architect",
    company: "CloudBridge Consulting",
    requiredSkills: ["AWS", "Azure", "Docker", "Kubernetes", "Communication", "Leadership"],
    description: "Translate customer requirements into scalable cloud architecture and delivery plans.",
    salary: "$145k - $190k",
  },
  {
    title: "Technical Program Manager",
    company: "Orbit Systems",
    requiredSkills: ["Agile", "Communication", "Leadership", "Data Analysis", "Roadmapping", "Problem Solving"],
    description: "Drive cross-functional execution for large software delivery programs.",
    salary: "$140k - $180k",
  },
  {
    title: "Software Engineer Intern",
    company: "LaunchPad AI",
    requiredSkills: ["Python", "Java", "Data Structures", "Algorithms", "Git", "Problem Solving"],
    description: "Work with engineering mentors on production features and internal tools.",
    salary: "$32 - $45/hr",
  },
  {
    title: "Junior Data Analyst",
    company: "Insight Harbor",
    requiredSkills: ["SQL", "Excel", "Power BI", "Data Analysis", "Communication", "Pandas"],
    description: "Analyze business performance metrics and create recurring reports for stakeholders.",
    salary: "$72k - $96k",
  },
  {
    title: "Machine Learning Engineer",
    company: "Asterix Health",
    requiredSkills: ["Python", "TensorFlow", "Machine Learning", "Docker", "SQL", "AWS"],
    description: "Build production ML systems for healthcare prediction and decision support.",
    salary: "$142k - $185k",
  },
  {
    title: "Full Stack Software Engineer",
    company: "Vertex Commerce",
    requiredSkills: ["React", "Node.js", "TypeScript", "MongoDB", "REST API", "Git"],
    description: "Ship customer-facing commerce features across web and backend services.",
    salary: "$122k - $158k",
  },
  {
    title: "Platform Engineer",
    company: "CoreMesh",
    requiredSkills: ["Kubernetes", "Docker", "CI/CD", "Linux", "Terraform", "Git"],
    description: "Build developer platforms and golden paths that improve engineering velocity.",
    salary: "$130k - $170k",
  },
  {
    title: "Security Engineer",
    company: "FortiEdge",
    requiredSkills: ["Network Security", "Python", "Linux", "Compliance", "Firewalls", "Problem Solving"],
    description: "Design preventative security controls and improve detection engineering coverage.",
    salary: "$128k - $165k",
  },
  {
    title: "Analytics Engineer",
    company: "DataSpring",
    requiredSkills: ["SQL", "Python", "Data Analysis", "PostgreSQL", "CI/CD", "Git"],
    description: "Model analytics-ready datasets and partner with product teams on decision support.",
    salary: "$118k - $152k",
  },
  {
    title: "Product Data Scientist",
    company: "Elevate Media",
    requiredSkills: ["Python", "Statistics", "Machine Learning", "Pandas", "SQL", "Communication"],
    description: "Use experimentation and forecasting to guide product growth decisions.",
    salary: "$136k - $176k",
  },
];

const applications = [
  {
    jobRole: "AI/ML Engineer",
    company: "TechCorp",
    status: "Applied",
    date: "2026-03-20",
  },
  {
    jobRole: "Full Stack Developer",
    company: "WebFlow Inc",
    status: "Interview",
    date: "2026-03-18",
  },
];

export async function seedDatabase() {
  await Job.bulkWrite(
    jobs.map((job) => ({
      updateOne: {
        filter: { title: job.title, company: job.company },
        update: { $set: job },
        upsert: true,
      },
    }))
  );

  const applicationCount = await Application.countDocuments();
  if (applicationCount === 0) {
    await Application.insertMany(applications);
  }

  await Profile.updateOne(
    { singletonKey: "default" },
    { $setOnInsert: { singletonKey: "default", skills: [] } },
    { upsert: true }
  );
}