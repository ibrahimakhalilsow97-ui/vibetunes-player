import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BookOpen, Heart, History, Home, Moon, Search, Settings, Sun } from "lucide-react";
import { actions, useAppState } from "@/lib/store";

const nav = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/sourates", label: "Sourates", icon: BookOpen },
  { to: "/recherche", label: "Recherche", icon: Search },
  { to: "/favoris", label: "Favoris", icon: Heart },
  { to: "/historique", label: "Historique", icon: History },
  { to: "/reglages", label: "Réglages", icon: Settings },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-hero text-gold shadow-soft">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z" /></svg>
      </span>
      <span className="leading-tight">
        <span className="block font-display text-2xl font-semibold text-primary">Nour</span>
        <span className="block font-arabic text-xs text-muted-foreground">نور القرآن</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { dark } = useAppState();
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pattern-layer" aria-hidden />
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-card/80 p-5 backdrop-blur lg:flex">
        <Logo />
        <nav className="mt-10 flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-secondary-foreground"
              activeProps={{ className: "!bg-secondary !text-primary" }}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={actions.toggleDark}
          className="mt-auto flex items-center gap-3 rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
        >
          {dark ? <Sun className="h-4 w-4 text-gold" /> : <Moon className="h-4 w-4" />}
          {dark ? "Mode clair" : "Mode sombre"}
        </button>
      </aside>

      {/* Header mobile */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button onClick={actions.toggleDark} aria-label="Changer de thème" className="grid h-10 w-10 place-items-center rounded-xl bg-card shadow-soft">
          {dark ? <Sun className="h-4 w-4 text-gold" /> : <Moon className="h-4 w-4 text-primary" />}
        </button>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-28 pt-6 lg:ml-64 lg:px-10 lg:pb-12 xl:mx-auto xl:pl-72">
        {children}
      </main>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {nav.slice(0, 5).map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground"
            activeProps={{ className: "!text-primary font-semibold" }}
          >
            <Icon className="h-5 w-5" /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-4xl font-semibold text-primary">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-3 flex items-center gap-2 text-gold">
        <span className="h-px w-10 bg-gold" />✦<span className="h-px w-10 bg-gold" />
      </div>
    </div>
  );
}

export function SurahBadge({ n }: { n: number }) {
  return (
    <span className="relative grid h-11 w-11 shrink-0 place-items-center text-sm font-semibold text-primary">
      <svg viewBox="0 0 44 44" className="absolute inset-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.3">
        <rect x="8" y="8" width="28" height="28" rx="4" />
        <rect x="8" y="8" width="28" height="28" rx="4" transform="rotate(45 22 22)" />
      </svg>
      <span className="relative">{n}</span>
    </span>
  );
}
