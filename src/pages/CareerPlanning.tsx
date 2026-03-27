import { useState } from "react";
import { Sparkles, Target, Clock3, Route, Briefcase, CheckCircle2 } from "lucide-react";
import { useCareer } from "@/context/CareerContext";
import { generateCareerPlan, type CareerPlanResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const experienceOptions = [
  { value: "student", label: "Student" },
  { value: "entry", label: "Entry" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
];

export default function CareerPlanning() {
  const { skills, isBootstrapping } = useCareer();
  const { toast } = useToast();
  const [targetRole, setTargetRole] = useState("AI/ML Engineer");
  const [experienceLevel, setExperienceLevel] = useState("entry");
  const [weeklyHours, setWeeklyHours] = useState(6);
  const [plan, setPlan] = useState<CareerPlanResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleGeneratePlan() {
    if (skills.length === 0) {
      toast({
        title: "Skills required",
        description: "Add or extract your skills first so the planning agent has context.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await generateCareerPlan({
        targetRole,
        experienceLevel,
        weeklyHours,
        skills,
      });
      setPlan(response);
    } catch (error) {
      toast({
        title: "Plan generation failed",
        description: error instanceof Error ? error.message : "Unable to generate a career plan right now.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">Career Planning Agent</h2>
        <p className="text-muted-foreground">Turn your current skills into a focused 90-day roadmap for the role you want next.</p>
      </div>

      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Agent Inputs
          </CardTitle>
          <CardDescription>The agent uses your saved skills and these goals to build the plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target role</label>
              <Input value={targetRole} onChange={(event) => setTargetRole(event.target.value)} placeholder="e.g. AI/ML Engineer" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Experience level</label>
              <select
                value={experienceLevel}
                onChange={(event) => setExperienceLevel(event.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {experienceOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Hours per week</label>
              <Input
                type="number"
                min={1}
                max={40}
                value={weeklyHours}
                onChange={(event) => setWeeklyHours(Number(event.target.value) || 1)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Target className="h-4 w-4 text-primary" />
              Agent context skills ({skills.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? skills.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>) : <span className="text-sm text-muted-foreground">No saved skills yet.</span>}
            </div>
          </div>

          <Button
            onClick={handleGeneratePlan}
            disabled={isSubmitting || isBootstrapping}
            className="gradient-bg text-primary-foreground hover:opacity-90"
          >
            <Route className="mr-2 h-4 w-4" />
            {isSubmitting ? "Planning..." : "Generate Career Plan"}
          </Button>
        </CardContent>
      </Card>

      {plan && (
        <div className="space-y-6">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Agent Summary</CardTitle>
              <CardDescription className="space-y-2">
                <span className="block">{plan.summary}</span>
                <span className="block">
                  <Badge variant={plan.generationMode === "ai" ? "default" : "secondary"}>
                    {plan.generationMode === "ai"
                      ? `AI-assisted${plan.provider ? ` via ${plan.provider}` : ""}`
                      : "Deterministic fallback"}
                  </Badge>
                </span>
                {plan.fallbackReason && (
                  <span className="block text-xs text-muted-foreground">Fallback reason: {plan.fallbackReason}</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Briefcase className="h-4 w-4 text-primary" /> Target Role</div>
                <div className="font-semibold text-foreground">{plan.targetRole.title}</div>
                <div className="text-sm text-muted-foreground">{plan.targetRole.company}</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-primary" /> Strengths</div>
                <div className="font-semibold text-foreground">{plan.strengths.length}</div>
                <div className="text-sm text-muted-foreground">Matched target-role skills</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Sparkles className="h-4 w-4 text-primary" /> Focus Areas</div>
                <div className="font-semibold text-foreground">{plan.focusAreas.length}</div>
                <div className="text-sm text-muted-foreground">Skills to prioritize next</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Clock3 className="h-4 w-4 text-primary" /> Weekly Effort</div>
                <div className="font-semibold text-foreground">{weeklyHours} hrs/week</div>
                <div className="text-sm text-muted-foreground">Used for roadmap pacing</div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-6">
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">90-Day Roadmap</CardTitle>
                  <CardDescription>Phased actions the agent recommends for your next 3 months.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.roadmap.map((phase) => (
                    <div key={phase.phase} className="rounded-xl border border-border bg-muted/20 p-4">
                      <div className="mb-1 text-sm font-medium text-primary">{phase.phase}</div>
                      <div className="mb-3 font-semibold text-foreground">{phase.objective}</div>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {phase.actions.map((action) => <li key={action}>• {action}</li>)}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">Project Ideas</CardTitle>
                  <CardDescription>Portfolio work the agent recommends to prove readiness.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {plan.projectIdeas.map((project) => (
                    <div key={project.title} className="rounded-xl border border-border bg-muted/20 p-4">
                      <div className="mb-2 font-semibold text-foreground">{project.title}</div>
                      <p className="mb-3 text-sm text-muted-foreground">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill) => <Badge key={skill} variant="outline">{skill}</Badge>)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">Focus Areas</CardTitle>
                  <CardDescription>Highest-value gaps to close next.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.focusAreas.map((focusArea) => (
                    <div key={focusArea.skill} className="rounded-xl border border-border bg-muted/20 p-4">
                      <div className="mb-1 font-semibold text-foreground">{focusArea.skill}</div>
                      <p className="mb-2 text-sm text-muted-foreground">{focusArea.reason}</p>
                      <p className="text-sm text-foreground">{focusArea.recommendation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">Top Matches</CardTitle>
                  <CardDescription>Best roles from your current dataset.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {plan.topMatches.map((match) => (
                    <div key={match.id} className="rounded-xl border border-border bg-muted/20 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-foreground">{match.title}</div>
                          <div className="text-sm text-muted-foreground">{match.company}</div>
                        </div>
                        <Badge>{match.match}% match</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">Immediate Next Steps</CardTitle>
                  <CardDescription>Use these to turn the plan into weekly execution.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {plan.nextSteps.map((step) => <li key={step}>• {step}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}