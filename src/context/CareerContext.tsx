import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  Application,
  ApplicationStatus,
  JobRole,
  createApplication as createApplicationRequest,
  deleteApplication as deleteApplicationRequest,
  getApplications,
  getProfile,
  updateApplicationStatus as updateApplicationStatusRequest,
  updateSkills as updateSkillsRequest,
} from "@/lib/api";

export type { Application, ApplicationStatus, JobRole } from "@/lib/api";

interface CareerContextType {
  skills: string[];
  saveSkills: (nextSkills: string[]) => Promise<void>;
  selectedJob: JobRole | null;
  setSelectedJob: React.Dispatch<React.SetStateAction<JobRole | null>>;
  applications: Application[];
  createApplication: (input: { jobRole: string; company: string }) => Promise<Application>;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  removeApplication: (id: string) => Promise<void>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  isBootstrapping: boolean;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export function CareerProvider({ children }: { children: ReactNode }) {
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobRole | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const [profile, applicationList] = await Promise.all([getProfile(), getApplications()]);

        if (!isMounted) {
          return;
        }

        setSkills(profile.skills);
        setApplications(applicationList);
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  async function saveSkills(nextSkills: string[]) {
    const profile = await updateSkillsRequest(nextSkills);
    setSkills(profile.skills);
  }

  async function createApplication(input: { jobRole: string; company: string }) {
    const application = await createApplicationRequest(input);
    setApplications((currentApplications) => [application, ...currentApplications]);
    return application;
  }

  async function updateApplicationStatus(id: string, status: ApplicationStatus) {
    const updatedApplication = await updateApplicationStatusRequest(id, status);
    setApplications((currentApplications) => currentApplications.map((application) => (
      application.id === id ? updatedApplication : application
    )));
  }

  async function removeApplication(id: string) {
    await deleteApplicationRequest(id);
    setApplications((currentApplications) => currentApplications.filter((application) => application.id !== id));
  }

  return (
    <CareerContext.Provider
      value={{
        skills,
        saveSkills,
        selectedJob,
        setSelectedJob,
        applications,
        createApplication,
        updateApplicationStatus,
        removeApplication,
        darkMode,
        setDarkMode,
        isBootstrapping,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer() {
  const ctx = useContext(CareerContext);
  if (!ctx) throw new Error("useCareer must be used within CareerProvider");
  return ctx;
}
