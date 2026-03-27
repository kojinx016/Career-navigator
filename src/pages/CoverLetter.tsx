import { useState } from "react";
import { useCareer } from "@/context/CareerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PenTool, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateCoverLetter as generateCoverLetterRequest } from "@/lib/api";

export default function CoverLetter() {
  const { skills } = useCareer();
  const [jobRole, setJobRole] = useState("");
  const [company, setCompany] = useState("");
  const [letter, setLetter] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generate = async () => {
    if (!jobRole || !company) {
      toast({ title: "Missing fields", description: "Please enter both job role and company name." });
      return;
    }

    try {
      setIsGenerating(true);
      const response = await generateCoverLetterRequest({ jobRole, company, skills });
      setLetter(response.letter);
      toast({ title: "Cover letter generated!", description: "You can now edit and copy your cover letter." });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Unable to generate a cover letter.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Cover letter copied to clipboard." });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">Cover Letter Generator</h2>
        <p className="text-muted-foreground">Generate a tailored cover letter using your skills.</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Job Role</label>
            <Input value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="e.g. AI/ML Engineer" className="bg-muted/50 border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Company Name</label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Google" className="bg-muted/50 border-border" />
          </div>
        </div>
        <Button onClick={generate} disabled={isGenerating} className="gradient-bg text-primary-foreground hover:opacity-90">
          <PenTool className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Cover Letter"}
        </Button>
      </div>

      {letter && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Generated Cover Letter</h3>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <Textarea
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            className="min-h-[320px] bg-muted/50 border-border font-body text-sm leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}
