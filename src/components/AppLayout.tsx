import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Bell, Settings, Menu, X, Sprout, Leaf, Sun, Download } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAlerts } from "@/hooks/useIrrigation";

const navItems = [
  { to: "/", icon: Sprout, label: "Dashboard" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/alerts", icon: Bell, label: "Alerts" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/install", icon: Download, label: "Install App" },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: alerts } = useAlerts(true);
  const unreadCount = alerts?.length ?? 0;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[260px] flex-col bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-30">
        {/* Logo area with organic shape */}
        <div className="px-6 pt-7 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sidebar-primary/30 to-sidebar-primary/10 flex items-center justify-center border border-sidebar-primary/20">
              <Leaf className="w-6 h-6 text-sidebar-primary" />
            </div>
            <div>
              <h1 className="font-display text-[1.15rem] font-bold leading-tight tracking-tight">AquaFarm</h1>
              <p className="text-[0.68rem] text-sidebar-foreground/50 font-medium tracking-wide uppercase">Smart Irrigation</p>
            </div>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="mx-5 mb-2">
          <div className="h-px bg-gradient-to-r from-sidebar-border via-sidebar-primary/20 to-transparent" />
        </div>

        <nav className="flex-1 px-3 space-y-0.5 mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.84rem] font-medium transition-all duration-200 relative group",
                  isActive
                    ? "bg-sidebar-primary/15 text-sidebar-primary shadow-sm"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground/90"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-sidebar-primary" />
                  )}
                  <item.icon className={cn("w-[18px] h-[18px] transition-transform", isActive && "scale-110")} />
                  {item.label}
                  {item.label === "Alerts" && unreadCount > 0 && (
                    <span className="absolute right-3 bg-status-critical text-white text-[0.65rem] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer with illustration hint */}
        <div className="p-5">
          <div className="rounded-2xl bg-sidebar-accent/60 border border-sidebar-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-4 h-4 text-secondary animate-float" />
              <span className="text-xs font-semibold text-sidebar-foreground/70">Farm Tip</span>
            </div>
            <p className="text-[0.7rem] text-sidebar-foreground/50 leading-relaxed">
              Morning irrigation reduces water loss from evaporation by up to 30%.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar text-sidebar-foreground border-b border-sidebar-border px-4 py-3.5 flex items-center justify-between backdrop-blur-lg">
        <div className="flex items-center gap-2.5">
          <Leaf className="w-5 h-5 text-sidebar-primary" />
          <span className="font-display font-bold text-[1.05rem]">AquaFarm</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl hover:bg-sidebar-accent transition-colors">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-sidebar pt-16 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="px-4 space-y-1 mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-medium transition-all relative",
                    isActive
                      ? "bg-sidebar-primary/15 text-sidebar-primary"
                      : "text-sidebar-foreground/60 active:bg-sidebar-accent"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.label === "Alerts" && unreadCount > 0 && (
                  <span className="ml-auto bg-status-critical text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-[260px] mt-14 md:mt-0 overflow-auto min-h-screen">
        <div className="p-4 md:p-8 lg:p-10 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
