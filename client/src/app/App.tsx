import { useState } from "react";
import { NavLink, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/ui/Toast";
import {
  LayoutDashboard,
  CircleDot,
  Eye,
  Truck,
  CheckCircle2,
  LogOut,
  PanelLeft,
  PanelLeftClose,
  X,
  ListChecks,
} from "lucide-react";
import type { TaskStatus } from "../types/task";

const STAGE_NAV: {
  stage: TaskStatus | "all";
  label: string;
  icon: typeof CircleDot;
  color: string;
}[] = [
  { stage: "all", label: "All tasks", icon: LayoutDashboard, color: "text-ink-muted" },
  { stage: "new", label: "New", icon: CircleDot, color: "text-primary" },
  { stage: "review", label: "Review", icon: Eye, color: "text-amber-600" },
  { stage: "delivery", label: "Delivery", icon: Truck, color: "text-sky-600" },
  { stage: "completed", label: "Completed", icon: CheckCircle2, color: "text-emerald-600" },
];

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return localStorage.getItem("taskez-sidebar") !== "collapsed";
  });

  const stageParam = searchParams.get("stage");
  const activeStage: TaskStatus | "all" =
    stageParam && ["new", "review", "delivery", "completed"].includes(stageParam)
      ? (stageParam as TaskStatus)
      : "all";

  const goToStage = (stage: TaskStatus | "all") => {
    setSearchParams(stage === "all" ? {} : { stage }, { replace: true });
    if (window.innerWidth < 640) setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    toast("info", "You've been signed out.");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      localStorage.setItem("taskez-sidebar", prev ? "collapsed" : "expanded");
      return !prev;
    });
  };

  const initials = (user?.name ?? user?.email ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const nav = ({ collapsed }: { collapsed: boolean }) => (
    <nav
      aria-label="Primary"
      className={`flex flex-1 flex-col gap-1 px-2 ${collapsed ? "items-center" : ""}`}
    >
      <p
        className={`px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider text-ink-muted ${
          collapsed ? "hidden" : ""
        }`}
      >
        Board stages
      </p>
      {STAGE_NAV.map(({ stage, label, icon: Icon, color }) => {
        const active = activeStage === stage;
        return (
          <NavLink
            key={stage}
            to={stage === "all" ? "/" : `/?stage=${stage}`}
            replace
            onClick={() => goToStage(stage)}
            aria-current={active ? "page" : undefined}
            className={({ isActive }) => `
              flex items-center gap-2.5 rounded-xl font-medium text-sm transition-colors
              ${collapsed ? "justify-center p-2.5" : "px-3 py-2.5"}
              ${
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-ink-secondary hover:bg-canvas hover:text-ink"
              }
            `}
          >
            <Icon className={`size-4 shrink-0 ${active ? "text-primary" : color}`} aria-hidden="true" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        );
      })}
    </nav>
  );

  const sidebarContent = (collapsed: boolean) => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className={`flex items-center gap-2.5 px-4 py-5 ${collapsed ? "justify-center px-2" : ""}`}>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-card">
          <ListChecks className="size-4" aria-hidden="true" />
        </span>
        {!collapsed && (
          <span className="text-base font-semibold tracking-tight text-ink">
            Taskez
          </span>
        )}
      </div>

      {nav({ collapsed })}

      {/* Footer: user + logout */}
      <div
        className={`mt-auto flex items-center gap-2 border-t border-line px-3 py-3 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        {!collapsed && (
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-semibold text-ink-secondary"
          >
            {initials}
          </span>
        )}
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-ink">
              {user?.name ?? user?.email}
            </p>
            <p className="truncate text-[11px] text-ink-muted">{user?.email}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => void handleLogout()}
          aria-label="Log out"
          title="Log out"
          className="rounded-lg p-2 text-ink-muted hover:bg-danger-soft hover:text-danger transition-colors"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop sidebar (collapsible) */}
      <aside
        aria-hidden={!sidebarOpen}
        className={`fixed inset-y-0 left-0 z-30 hidden border-r border-line bg-surface transition-[width] duration-200 lg:block ${
          sidebarOpen ? "w-60" : "w-[68px]"
        }`}
      >
        {sidebarContent(!sidebarOpen)}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="absolute -right-3.5 top-6 z-40 hidden rounded-full border border-line bg-surface p-1.5 text-ink-muted shadow-card hover:text-ink lg:block"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="size-3.5" aria-hidden="true" />
          ) : (
            <PanelLeft className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </aside>

      {/* Mobile drawer is rendered below; desktop uses the persistent aside */}
      <div
        className={`transition-[padding] duration-200 ${
          sidebarOpen ? "lg:pl-60" : "lg:pl-[68px]"
        }`}
      >
        <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              {/* Mobile: open drawer button */}
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Open navigation"
                className="rounded-lg p-2 text-ink-secondary hover:bg-canvas lg:hidden"
              >
                <PanelLeft className="size-4.5" />
              </button>
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-white lg:hidden">
                <ListChecks className="size-3.5" aria-hidden="true" />
              </span>
              <span className="font-semibold tracking-tight text-ink lg:hidden">
                Taskez
              </span>
            </div>

            {user && (
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary"
                >
                  {initials}
                </span>
                <span className="hidden max-w-40 truncate text-sm text-ink-secondary sm:block">
                  {user.name ?? user.email}
                </span>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-muted hover:bg-danger-soft hover:text-danger transition-colors"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={toggleSidebar}
            className="fixed inset-0 z-30 bg-ink/40 fade-in lg:hidden"
          />
          <div className="fixed inset-y-0 left-0 z-40 w-60 border-r border-line bg-surface shadow-overlay modal-pop lg:hidden">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Close navigation"
              className="absolute right-3 top-5 rounded-lg p-1.5 text-ink-muted hover:bg-canvas"
            >
              <X className="size-4" />
            </button>
            {sidebarContent(false)}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
