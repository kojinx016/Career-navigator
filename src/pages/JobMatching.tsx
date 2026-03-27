import { useCareer } from "@/context/CareerContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getJobMatches } from "@/lib/api";

export default function JobMatching() {
  const { skills, setSelectedJob } = useCareer();
  const navigate = useNavigate();
  const { data: jobs = [], isLoading, isError } = useQuery({
    queryKey: ["job-matches", skills],
    queryFn: () => getJobMatches(skills),
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">Job Matching</h2>
        <p className="text-muted-foreground">
          {skills.length > 0
            ? `Matching against your ${skills.length} skill(s).`
            : "Add skills first for personalized matching."}
        </p>
      </div>

      {isLoading ? (
        <div className="glass-card p-8 text-center text-muted-foreground">Loading job matches...</div>
      ) : isError ? (
        <div className="glass-card p-8 text-center text-destructive">Unable to load jobs right now.</div>
      ) : (
      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((job) => {
          const match = job.match;
          return (
            <div key={job.id} className="glass-card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold text-foreground">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                </div>
                <Badge variant={match >= 70 ? "default" : "secondary"} className={match >= 70 ? "gradient-bg text-primary-foreground" : ""}>
                  {match}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{job.description}</p>
              <p className="text-xs font-medium text-primary">{job.salary}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Match</span>
                  <span>{match}%</span>
                </div>
                <Progress value={match} className="h-2" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {job.requiredSkills.map((s) => (
                  <Badge key={s} variant="outline" className={`text-xs ${skills.some((sk) => sk.toLowerCase() === s.toLowerCase()) ? "border-primary/50 text-primary" : ""}`}>
                    {s}
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => { setSelectedJob(job); navigate("/skill-gap"); }}
              >
                View Details <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
