import { useState } from "react";
import { useCareer } from "@/context/CareerContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Plus, FileUp, FileText, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { extractSkillsFromResumeFile } from "@/lib/api";

const MAX_RESUME_SIZE_BYTES = 8 * 1024 * 1024;

export default function SkillInput() {
  const { skills, saveSkills, isBootstrapping } = useCareer();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [manualSkill, setManualSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const extractSkills = async () => {
    if (!resumeFile) {
      toast({ title: "Resume required", description: "Upload a PDF or image resume first." });
      return;
    }

    try {
      setIsSubmitting(true);
      const { detectedSkills } = await extractSkillsFromResumeFile(resumeFile);

      if (detectedSkills.length === 0) {
        toast({ title: "No skills detected", description: "Try a clearer resume file or add skills manually." });
        return;
      }

      const merged = Array.from(new Set([...skills, ...detectedSkills]));
      await saveSkills(merged);
      toast({ title: "Skills Extracted!", description: `Found ${detectedSkills.length} skill(s) from your resume.` });
    } catch (error) {
      toast({
        title: "Extraction failed",
        description: error instanceof Error ? error.message : "Unable to extract skills right now.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResumeSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file && file.size > MAX_RESUME_SIZE_BYTES) {
      setResumeFile(null);
      event.target.value = "";
      toast({
        title: "File too large",
        description: "Resume file must be 8 MB or smaller.",
        variant: "destructive",
      });
      return;
    }

    setResumeFile(file);
  };

  const addManualSkill = async () => {
    const s = manualSkill.trim();
    if (!s) return;
    if (skills.includes(s)) {
      toast({ title: "Duplicate", description: "This skill is already added." });
      return;
    }

    try {
      setIsSubmitting(true);
      await saveSkills([...skills, s]);
      setManualSkill("");
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save this skill.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeSkill = async (skill: string) => {
    try {
      setIsSubmitting(true);
      await saveSkills(skills.filter((s) => s !== skill));
    } catch (error) {
      toast({
        title: "Remove failed",
        description: error instanceof Error ? error.message : "Unable to remove this skill.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">Skill Input</h2>
        <p className="text-muted-foreground">Upload your resume as a PDF or image to extract skills automatically.</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <label className="text-sm font-medium text-foreground">Upload Resume</label>
        <label className="block cursor-pointer">
          <input
            type="file"
            accept="application/pdf,image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={onResumeSelected}
          />
          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/60">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileUp className="h-6 w-6" />
            </div>
            <p className="font-medium text-foreground">Choose a resume file</p>
            <p className="mt-1 text-sm text-muted-foreground">Supported formats: PDF, JPG, PNG, WEBP</p>
            <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> PDF</span>
              <span className="inline-flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5" /> Image</span>
            </div>
          </div>
        </label>
        {resumeFile && (
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
            <div className="font-medium">Selected file</div>
            <div className="mt-1 text-muted-foreground">{resumeFile.name} • {(resumeFile.size / 1024 / 1024).toFixed(2)} MB</div>
          </div>
        )}
        <Button onClick={extractSkills} disabled={isSubmitting || isBootstrapping} className="gradient-bg text-primary-foreground hover:opacity-90">
          <Sparkles className="w-4 h-4 mr-2" />
          {isSubmitting ? "Extracting..." : "Extract Skills"}
        </Button>
      </div>

      <div className="glass-card p-6 space-y-4">
        <label className="text-sm font-medium text-foreground">Add Skill Manually</label>
        <div className="flex gap-2">
          <Input
            value={manualSkill}
            onChange={(e) => setManualSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addManualSkill()}
            placeholder="e.g. Python, React..."
            className="bg-muted/50 border-border"
          />
          <Button onClick={addManualSkill} disabled={isSubmitting || isBootstrapping} variant="outline" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="glass-card p-6 space-y-3">
          <h3 className="text-sm font-medium text-foreground">Your Skills ({skills.length})</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="pl-3 pr-1 py-1.5 text-sm gap-1">
                {skill}
                <button disabled={isSubmitting} onClick={() => void removeSkill(skill)} className="ml-1 hover:bg-muted rounded-full p-0.5 disabled:opacity-50">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
