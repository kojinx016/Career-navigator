import { useCareer } from "@/context/CareerContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, Briefcase, CheckCircle2, Gauge, Lightbulb, Sparkles, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProfileSuggestions } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const priorityTone = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-primary/10 text-primary border-primary/20",
} as const;

export default function ProfileImprovement() {
  const navigate = useNavigate();
  const { skills } = useCareer();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile-suggestions", skills],
    queryFn: () => getProfileSuggestions(skills),
  });
  const maxDemand = Math.max(
    ...(data?.opportunities.map((entry) => entry.demand) || []),
    ...(data?.strongestSkills.map((entry) => entry.demand) || []),
    1,
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">Profile Improvement</h2>
        <p className="text-muted-foreground">Turn your saved skills into a sharper market-facing profile with clear next actions.</p>
      </div>

      {isLoading ? (
        <div className="glass-card p-8 text-center text-muted-foreground">Loading profile suggestions...</div>
      ) : isError ? (
        <div className="glass-card p-8 text-center text-destructive">Unable to load profile suggestions.</div>
      ) : (
        data && (
          <div className="space-y-6">
            <Card className="glass-card border-border/50 overflow-hidden">
              <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Sparkles className="h-4 w-4" />
                    Profile health snapshot
                  </div>
                  <div>
                    <h3 className="font-display text-3xl font-bold text-foreground">{data.profileScore}/100</h3>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{data.summary}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Profile readiness score</span>
                      <span className="font-medium text-foreground">{data.profileScore}%</span>
                    </div>
                    <Progress value={data.profileScore} className="h-2 bg-muted/60" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.strongestSkills.length > 0 ? data.strongestSkills.map((entry) => (
                      <Badge key={entry.skill} variant="secondary">{entry.skill}</Badge>
                    )) : <Badge variant="outline">Add skills to unlock personalized guidance</Badge>}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/25 p-5 space-y-4">
                  <div>
                    <div className="text-sm font-medium text-primary">Best current benchmark</div>
                    {data.benchmarkRole ? (
                      <>
                        <div className="mt-2 font-display text-xl font-semibold text-foreground">{data.benchmarkRole.title}</div>
                        <div className="text-sm text-muted-foreground">{data.benchmarkRole.company}</div>
                        <div className="mt-3 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                          {data.benchmarkRole.match}% aligned
                        </div>
                      </>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">Add skills so the app can determine your best-fit role.</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                      <div className="text-xs text-muted-foreground">Tracked skills</div>
                      <div className="mt-1 text-2xl font-semibold text-foreground">{data.stats.skillCount}</div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                      <div className="text-xs text-muted-foreground">Roles 60%+ fit</div>
                      <div className="mt-1 text-2xl font-semibold text-foreground">{data.stats.roleReadyCount}</div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                      <div className="text-xs text-muted-foreground">Top match</div>
                      <div className="mt-1 text-2xl font-semibold text-foreground">{data.stats.topMatchScore}%</div>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                      <div className="text-xs text-muted-foreground">Avg top fit</div>
                      <div className="mt-1 text-2xl font-semibold text-foreground">{data.stats.averageTopMatch}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {skills.length === 0 && (
              <Card className="glass-card border-warning/30 bg-warning/5">
                <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold text-foreground">Add your resume or core skills first</div>
                    <p className="text-sm text-muted-foreground">The profile tab becomes much more useful once it can analyze your actual skill set against the jobs dataset.</p>
                  </div>
                  <Button onClick={() => navigate("/skills")} className="gradient-bg text-primary-foreground hover:opacity-90">
                    Go to Skill Input
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Target className="h-5 w-5 text-primary" />
                      Priority Actions
                    </CardTitle>
                    <CardDescription>Start with the highest-leverage improvements for recruiter fit and role readiness.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.priorityActions.map((action) => (
                      <div key={action.title} className="rounded-2xl border border-border bg-muted/20 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-foreground">{action.title}</h3>
                          <Badge variant="outline" className={priorityTone[action.priority]}>{action.priority}</Badge>
                          <Badge variant="secondary">{action.category}</Badge>
                          <Badge variant="outline">{action.effort}</Badge>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{action.desc}</p>
                        <div className="mt-3 rounded-xl border border-border/60 bg-background/70 p-3 text-sm text-foreground">
                          <span className="font-medium">Why this matters:</span> {action.reason}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      High-Impact Skills To Add
                    </CardTitle>
                    <CardDescription>These missing skills appear repeatedly across the current job dataset.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.opportunities.length > 0 ? data.opportunities.map((entry) => (
                      <div key={entry.skill} className="rounded-2xl border border-border bg-muted/20 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold text-foreground">{entry.skill}</div>
                            <div className="text-sm text-muted-foreground">Appears in {entry.demand} roles</div>
                          </div>
                          <Badge variant="outline">Market gap</Badge>
                        </div>
                        <div className="mt-3 space-y-2">
                          <Progress value={(entry.demand / maxDemand) * 100} className="h-2 bg-muted/60" />
                          <p className="text-sm text-muted-foreground">{entry.recommendation}</p>
                          <p className="text-xs text-muted-foreground">Relevant roles: {entry.roles.join(" • ")}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-sm text-foreground">
                        Your current skill set already covers the strongest recurring skills in this dataset.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Gauge className="h-5 w-5 text-primary" />
                      Strongest Signals
                    </CardTitle>
                    <CardDescription>Your most market-relevant current skills based on the jobs in this app.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.strongestSkills.length > 0 ? data.strongestSkills.map((entry) => (
                      <div key={entry.skill} className="rounded-xl border border-border bg-muted/20 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold text-foreground">{entry.skill}</div>
                          <Badge>{entry.demand} roles</Badge>
                        </div>
                        <div className="mt-3 space-y-2">
                          <Progress value={(entry.demand / maxDemand) * 100} className="h-2 bg-muted/60" />
                          <div className="text-xs text-muted-foreground">Relevant roles: {entry.roles.join(" • ")}</div>
                        </div>
                      </div>
                    )) : (
                      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">No signal yet. Add skills to see which ones already help your market fit.</div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Best-Fit Roles
                    </CardTitle>
                    <CardDescription>Use these as the benchmark when rewriting your profile.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.topMatches.map((match) => (
                      <div key={match.id} className="rounded-xl border border-border bg-muted/20 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-foreground">{match.title}</div>
                            <div className="text-sm text-muted-foreground">{match.company}</div>
                          </div>
                          <Badge variant={match.match >= 60 ? "default" : "secondary"}>{match.match}% fit</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                      Improvement Checklist
                    </CardTitle>
                    <CardDescription>A short operating checklist for your next profile update session.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.checklist.map((item) => (
                      <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-4">
                        <div className={`mt-0.5 rounded-full p-1 ${item.done ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.detail}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
