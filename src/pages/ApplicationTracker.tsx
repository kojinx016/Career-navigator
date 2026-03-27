import { useState } from "react";
import { useCareer, Application } from "@/context/CareerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  Applied: "bg-primary/10 text-primary",
  Pending: "bg-warning/10 text-warning",
  Rejected: "bg-destructive/10 text-destructive",
  Interview: "bg-success/10 text-success",
};

export default function ApplicationTracker() {
  const { applications, createApplication, updateApplicationStatus, removeApplication, isBootstrapping } = useCareer();
  const [newRole, setNewRole] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addNewApplication = async () => {
    if (!newRole || !newCompany) {
      toast({ title: "Missing fields", description: "Enter both job role and company." });
      return;
    }

    try {
      setIsSubmitting(true);
      await createApplication({ jobRole: newRole, company: newCompany });
      setNewRole("");
      setNewCompany("");
      toast({ title: "Application added!", description: `${newRole} at ${newCompany}` });
    } catch (error) {
      toast({
        title: "Create failed",
        description: error instanceof Error ? error.message : "Unable to add application.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: Application["status"]) => {
    try {
      await updateApplicationStatus(id, status);
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Unable to update status.",
        variant: "destructive",
      });
    }
  };

  const remove = async (id: string) => {
    try {
      await removeApplication(id);
      toast({ title: "Removed", description: "Application removed." });
    } catch (error) {
      toast({
        title: "Remove failed",
        description: error instanceof Error ? error.message : "Unable to remove application.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">Application Tracker</h2>
        <p className="text-muted-foreground">Keep track of all your job applications.</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-3">
          <Input value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="Job Role" className="bg-muted/50 border-border" />
          <Input value={newCompany} onChange={(e) => setNewCompany(e.target.value)} placeholder="Company" className="bg-muted/50 border-border" />
          <Button onClick={addNewApplication} disabled={isSubmitting || isBootstrapping} className="gradient-bg text-primary-foreground hover:opacity-90 shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {applications.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">No applications yet. Add one above!</div>
        ) : applications.map((app) => (
          <div key={app.id} className="glass-card p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground text-sm truncate">{app.jobRole}</h3>
              <p className="text-xs text-muted-foreground">{app.company} · {app.date}</p>
            </div>
            <Badge className={`${statusColors[app.status]} border-0 shrink-0`}>{app.status}</Badge>
            <Select value={app.status} onValueChange={(v) => updateStatus(app.id, v as Application["status"])}>
              <SelectTrigger className="w-[130px] bg-muted/50 border-border h-8 text-xs shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => remove(app.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
