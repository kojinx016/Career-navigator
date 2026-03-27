export type ApplicationStatus = "Applied" | "Pending" | "Rejected" | "Interview";

export interface Application {
  id: string;
  jobRole: string;
  company: string;
  status: ApplicationStatus;
  date: string;
}

export interface JobRole {
  id: string;
  title: string;
  company: string;
  requiredSkills: string[];
  description: string;
  salary: string;
}

export interface JobMatch extends JobRole {
  match: number;
}

export interface SkillGapResponse {
  job: JobRole;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: Array<{
    skill: string;
    recommendation: string;
  }>;
}

export interface ProfileResponse {
  id: string;
  skills: string[];
}

export interface ProfileSuggestion {
  title: string;
  desc: string;
}

export interface ProfileImprovementSkillSignal {
  skill: string;
  demand: number;
  roles: string[];
}

export interface ProfileImprovementOpportunity extends ProfileImprovementSkillSignal {
  recommendation: string;
}

export interface ProfileImprovementAction {
  title: string;
  desc: string;
  priority: "High" | "Medium" | "Low";
  effort: string;
  category: string;
  reason: string;
}

export interface ProfileImprovementChecklistItem {
  title: string;
  detail: string;
  done: boolean;
}

export interface ProfileImprovementResponse {
  summary: string;
  profileScore: number;
  benchmarkRole: JobMatch | null;
  stats: {
    skillCount: number;
    topMatchScore: number;
    roleReadyCount: number;
    averageTopMatch: number;
  };
  strongestSkills: ProfileImprovementSkillSignal[];
  opportunities: ProfileImprovementOpportunity[];
  topMatches: JobMatch[];
  priorityActions: ProfileImprovementAction[];
  checklist: ProfileImprovementChecklistItem[];
  suggestions: ProfileSuggestion[];
}

export interface CareerPlanFocusArea {
  skill: string;
  reason: string;
  recommendation: string;
}

export interface CareerPlanRoadmapPhase {
  phase: string;
  objective: string;
  actions: string[];
}

export interface CareerPlanProjectIdea {
  title: string;
  description: string;
  skills: string[];
}

export interface CareerPlanResponse {
  generationMode: "ai" | "fallback";
  provider: "gemini" | "openai" | null;
  fallbackReason: string | null;
  summary: string;
  profileSkills: string[];
  targetRole: JobRole;
  topMatches: JobMatch[];
  strengths: string[];
  focusAreas: CareerPlanFocusArea[];
  roadmap: CareerPlanRoadmapPhase[];
  projectIdeas: CareerPlanProjectIdea[];
  nextSteps: string[];
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormDataBody = typeof FormData !== "undefined" && init?.body instanceof FormData;
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: isFormDataBody
      ? init?.headers
      : {
          "Content-Type": "application/json",
          ...(init?.headers || {}),
        },
    ...init,
  });

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getProfile() {
  return apiRequest<ProfileResponse>("/api/profile");
}

export function updateSkills(skills: string[]) {
  return apiRequest<ProfileResponse>("/api/profile/skills", {
    method: "PUT",
    body: JSON.stringify({ skills }),
  });
}

export function extractSkills(resumeText: string) {
  return apiRequest<{ detectedSkills: string[] }>("/api/content/skills/extract", {
    method: "POST",
    body: JSON.stringify({ resumeText }),
  });
}

export function extractSkillsFromResumeFile(file: File) {
  const formData = new FormData();
  formData.append("resume", file);

  return apiRequest<{ detectedSkills: string[]; extractedTextLength: number }>("/api/content/skills/extract", {
    method: "POST",
    body: formData,
  });
}

export function getApplications() {
  return apiRequest<Application[]>("/api/applications");
}

export function createApplication(input: { jobRole: string; company: string }) {
  return apiRequest<Application>("/api/applications", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateApplicationStatus(id: string, status: ApplicationStatus) {
  return apiRequest<Application>(`/api/applications/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteApplication(id: string) {
  return apiRequest<void>(`/api/applications/${id}`, {
    method: "DELETE",
  });
}

export function getJobs() {
  return apiRequest<JobRole[]>("/api/jobs");
}

export function getJobMatches(skills: string[]) {
  const query = new URLSearchParams({ skills: skills.join(",") });
  return apiRequest<JobMatch[]>(`/api/jobs/matches?${query.toString()}`);
}

export function getSkillGap(jobId: string, skills: string[]) {
  const query = new URLSearchParams({ skills: skills.join(",") });
  return apiRequest<SkillGapResponse>(`/api/jobs/${jobId}/skill-gap?${query.toString()}`);
}

export function generateCoverLetter(input: { jobRole: string; company: string; skills: string[] }) {
  return apiRequest<{ letter: string }>("/api/content/cover-letter/generate", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getProfileSuggestions(skills: string[]) {
  const query = new URLSearchParams({ skills: skills.join(",") });
  return apiRequest<ProfileImprovementResponse>(`/api/content/profile-suggestions?${query.toString()}`);
}

export function generateCareerPlan(input: {
  targetRole?: string;
  experienceLevel?: string;
  weeklyHours?: number;
  skills?: string[];
}) {
  return apiRequest<CareerPlanResponse>("/api/agents/career-plan", {
    method: "POST",
    body: JSON.stringify(input),
  });
}