import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CareerProvider, useCareer } from "@/context/CareerContext";
import { AppLayout } from "@/components/AppLayout";
import { useEffect } from "react";

import Index from "./pages/Index";
import SkillInput from "./pages/SkillInput";
import JobMatching from "./pages/JobMatching";
import SkillGap from "./pages/SkillGap";
import ProfileImprovement from "./pages/ProfileImprovement";
import CoverLetter from "./pages/CoverLetter";
import ApplicationTracker from "./pages/ApplicationTracker";
import CareerPlanning from "./pages/CareerPlanning";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function DarkModeSync() {
  const { darkMode } = useCareer();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CareerProvider>
        <BrowserRouter>
          <DarkModeSync />
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/skills" element={<SkillInput />} />
              <Route path="/jobs" element={<JobMatching />} />
              <Route path="/career-plan" element={<CareerPlanning />} />
              <Route path="/skill-gap" element={<SkillGap />} />
              <Route path="/profile" element={<ProfileImprovement />} />
              <Route path="/cover-letter" element={<CoverLetter />} />
              <Route path="/tracker" element={<ApplicationTracker />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </CareerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
