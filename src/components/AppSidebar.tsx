import {
  LayoutDashboard, FileText, Briefcase, BarChart3, UserCheck, PenTool, ClipboardList, Moon, Sun, Sparkles,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useCareer } from "@/context/CareerContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Skill Input", url: "/skills", icon: FileText },
  { title: "Job Matching", url: "/jobs", icon: Briefcase },
  { title: "Career Planning Agent", url: "/career-plan", icon: Sparkles },
  { title: "Skill Gap Analysis", url: "/skill-gap", icon: BarChart3 },
  { title: "Profile Improvement", url: "/profile", icon: UserCheck },
  { title: "Cover Letter", url: "/cover-letter", icon: PenTool },
  { title: "Application Tracker", url: "/tracker", icon: ClipboardList },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { darkMode, setDarkMode } = useCareer();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-sm text-sidebar-accent-foreground truncate">
              AI Career Navigator
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-sidebar-accent/50 text-sidebar-foreground transition-colors text-sm"
        >
          {darkMode ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
          {!collapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
