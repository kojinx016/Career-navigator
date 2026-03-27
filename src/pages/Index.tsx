import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FileText, Briefcase, BarChart3, UserCheck, PenTool, ClipboardList, Sparkles, TrendingUp, Route, ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import { useCareer } from "@/context/CareerContext";
import { Badge } from "@/components/ui/badge";
import { getJobMatches, getJobs } from "@/lib/api";

const features = [
  { title: "Skill Input", desc: "Paste your resume or enter skills manually", icon: FileText, path: "/skills", color: "from-primary to-primary/70" },
  { title: "Job Matching", desc: "Find roles that match your skill set", icon: Briefcase, path: "/jobs", color: "from-accent to-accent/70" },
  { title: "Career Planning Agent", desc: "Build a 90-day roadmap for your next target role", icon: Route, path: "/career-plan", color: "from-success to-primary" },
  { title: "Skill Gap Analysis", desc: "Identify missing skills for your dream job", icon: BarChart3, path: "/skill-gap", color: "from-success to-success/70" },
  { title: "Profile Improvement", desc: "Get suggestions to improve your profile", icon: UserCheck, path: "/profile", color: "from-warning to-warning/70" },
  { title: "Cover Letter", desc: "Generate tailored cover letters with AI", icon: PenTool, path: "/cover-letter", color: "from-primary to-accent" },
  { title: "Application Tracker", desc: "Track your job applications in one place", icon: ClipboardList, path: "/tracker", color: "from-accent to-primary" },
];

export default function Index() {
  const navigate = useNavigate();
  const { skills, applications, isBootstrapping } = useCareer();
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });
  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ["job-matches", skills],
    queryFn: () => getJobMatches(skills),
    enabled: skills.length > 0,
  });

  const topMatches = matches.slice(0, 3);
  const recentApplications = applications.slice(0, 3);
  const activeApplications = applications.filter((application) => application.status === "Applied" || application.status === "Pending").length;
  const interviewApplications = applications.filter((application) => application.status === "Interview").length;
  const strongestMatch = topMatches[0]?.match || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <div className="glass-card p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Career Intelligence</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Navigate Your Career with <span className="gradient-text">Agentic AI</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Extract skills from your resume, match with top job roles, identify skill gaps, and generate tailored cover letters — all in one intelligent platform.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Skills Tracked", value: skills.length, icon: TrendingUp },
          { label: "Job Roles", value: jobsLoading ? "..." : jobs.length, icon: Briefcase },
          { label: "Applications", value: applications.length, icon: ClipboardList },
          { label: "Top Match", value: skills.length > 0 ? `${strongestMatch}%` : "—", icon: BarChart3 },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Live Job Signals</h2>
              <p className="text-sm text-muted-foreground">Pulled from the jobs stored in the database and ranked against your saved skills.</p>
            </div>
            <button
              onClick={() => navigate("/jobs")}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary"
            >
              View all jobs
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {skills.length === 0 ? (
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              Add or extract skills first to see role matches from the database.
            </div>
          ) : matchesLoading ? (
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              Loading role matches from the database...
            </div>
          ) : topMatches.length === 0 ? (
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              No job matches are available yet.
            </div>
          ) : (
            <div className="space-y-3">
              {topMatches.map((match) => (
                <div key={match.id} className="rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{match.title}</h3>
                      <p className="text-sm text-muted-foreground">{match.company}</p>
                    </div>
                    <Badge variant={match.match >= 60 ? "default" : "secondary"}>{match.match}% fit</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {match.requiredSkills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Application Snapshot</h2>
              <p className="text-sm text-muted-foreground">This summary is backed by your saved applications.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-4 w-4 text-primary" />
                  Active
                </div>
                <div className="mt-2 text-2xl font-semibold text-foreground">{activeApplications}</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Interviews
                </div>
                <div className="mt-2 text-2xl font-semibold text-foreground">{interviewApplications}</div>
              </div>
            </div>

            {isBootstrapping ? (
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                Loading application data...
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                No saved applications yet. Start from job matching and track one here.
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((application) => (
                  <div key={application.id} className="rounded-xl border border-border bg-muted/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-foreground">{application.jobRole}</div>
                        <div className="text-sm text-muted-foreground">{application.company}</div>
                      </div>
                      <Badge variant="outline">{application.status}</Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">Saved on {application.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <button
            key={f.title}
            onClick={() => navigate(f.path)}
            className="glass-card p-6 text-left group cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <f.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
