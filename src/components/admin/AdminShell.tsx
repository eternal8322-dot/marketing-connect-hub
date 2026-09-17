import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Bell, LayoutDashboard, Plug, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "成效總覽", icon: LayoutDashboard },
  { to: "/campaigns", label: "廣告活動", icon: BarChart3 },
  { to: "/notifications", label: "LINE 通知", icon: Bell },
  { to: "/integrations", label: "串接設定", icon: Plug },
] as const;

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r-2 border-foreground bg-sidebar p-5 md:flex">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg border-2 border-foreground bg-primary text-primary-foreground shadow-[3px_3px_0_var(--foreground)]">
            <Sparkles className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold tracking-tight">行銷數據後台</p>
            <p className="text-xs text-sidebar-foreground/70">MARKETING CONSOLE</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-sm font-semibold transition-transform ${
                  active
                    ? "border-foreground bg-primary text-primary-foreground shadow-[3px_3px_0_var(--foreground)] -translate-x-0.5 -translate-y-0.5"
                    : "border-transparent text-sidebar-foreground hover:border-sidebar-border hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border-2 border-foreground bg-primary p-3 text-xs font-medium text-primary-foreground shadow-[3px_3px_0_var(--foreground)]">
          <span className="font-bold">DEMO MODE</span>
          <p className="mt-1 opacity-80">目前使用示範資料，串接完成後會自動換成真實數據。</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b-2 border-foreground bg-card px-5 py-5 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Marketing Dashboard</p>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <span className="hidden rounded-full border-2 border-foreground bg-primary px-3 py-1 text-xs font-bold md:inline-flex">LIVE UI</span>
          </div>
          <nav className="mt-5 flex gap-2 overflow-x-auto md:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`whitespace-nowrap rounded-full border-2 border-foreground px-3 py-1.5 text-xs font-bold ${
                  pathname === item.to ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 px-5 py-7 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
