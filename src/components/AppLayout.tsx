import { NavLink, Outlet } from "react-router-dom";
import { Droplets, BarChart3, Bell, Settings, Sprout, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAlerts } from "@/hooks/useIrrigation";

const navItems = [
  { to: "/", icon: Sprout, label: "Dashboard" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/alerts", icon: Bell, label: "Alerts" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: alerts } = useAlerts(true);
  const unreadCount = alerts?.length ?? 0;

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary/20 flex items-center justify-center">
            <Droplets className="w-6 h-6 text-sidebar-primary" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight">AquaFarm</h1>
            <p className="text-xs text-sidebar-foreground/60">Smart Irrigation</p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.label === "Alerts" && unreadCount > 0 && (
                <span className="absolute right-3 bg-status-critical text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 text-xs text-sidebar-foreground/40">
          IoT Smart Irrigation v1.0
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar text-sidebar-foreground border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets className="w-6 h-6 text-sidebar-primary" />
          <span className="font-display font-bold">AquaFarm</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-sidebar/95 pt-16">
          <nav className="px-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-4 rounded-lg text-base font-medium transition-colors relative",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.label === "Alerts" && unreadCount > 0 && (
                  <span className="ml-auto bg-status-critical text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-0 mt-14 md:mt-0 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
