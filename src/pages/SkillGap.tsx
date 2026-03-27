import { useCareer } from "@/context/CareerContext";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getJobs, getSkillGap } from "@/lib/api";

export default function SkillGap() {
  const { skills, selectedJob, setSelectedJob } = useCareer();
  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });
  const job = jobs.find((candidate) => candidate.id === selectedJob?.id) || selectedJob || jobs[0];
  const { data, isLoading, isError } = useQuery({
    queryKey: ["skill-gap", job?.id, skills],
    queryFn: () => getSkillGap(job!.id, skills),
    enabled: Boolean(job),
  });

  if (!job) {
    return <div className="glass-card p-8 text-center text-muted-foreground">No job data available.</div>;
  }

  if (isLoading) {
    return <div className="glass-card p-8 text-center text-muted-foreground">Loading skill gap analysis...</div>;
  }

  if (isError || !data) {
    return <div className="glass-card p-8 text-center text-destructive">Unable to load skill gap analysis.</div>;
  }

  const matching = data.matchingSkills;
  const missing = data.missingSkills;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">Skill Gap Analysis</h2>
        <div className="mt-3 space-y-2">
          <label htmlFor="job-gap-selector" className="text-sm font-medium text-foreground">Choose role and company</label>
          <select
            id="job-gap-selector"
            value={job.id}
            onChange={(event) => {
              const nextJob = jobs.find((candidate) => candidate.id === event.target.value);
              if (nextJob) {
                setSelectedJob(nextJob);
              }
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {jobs.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.title} - {candidate.company}
              </option>
            ))}
          </select>
        </div>
        <p className="text-muted-foreground">Analyzing for: <span className="text-foreground font-medium">{job.title}</span> at {job.company}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-6 space-y-3">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" /> Matching Skills ({matching.length})
          </h3>
          <div className="space-y-2">
            {matching.length === 0 ? (
              <p className="text-sm text-muted-foreground">No matching skills yet. Add skills to see matches.</p>
            ) : matching.map((s) => (
              <div key={s} className="flex items-center gap-2 p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-sm text-foreground">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 space-y-3">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <XCircle className="w-4 h-4 text-destructive" /> Missing Skills ({missing.length})
          </h3>
          <div className="space-y-2">
            {missing.length === 0 ? (
              <p className="text-sm text-muted-foreground">You have all the required skills! 🎉</p>
            ) : missing.map((s) => (
              <div key={s} className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10">
                <XCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm text-foreground">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {missing.length > 0 && (
        <div className="glass-card p-6 space-y-3">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-warning" /> Recommended Skills to Learn
          </h3>
          <div className="space-y-2">
            {data.recommendations.map(({ skill, recommendation }) => (
              <div key={skill} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge variant="outline" className="shrink-0 mt-0.5">{skill}</Badge>
                <span className="text-sm text-muted-foreground">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
