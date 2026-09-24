import { Link } from "@tanstack/react-router";
import type { Surah } from "@/lib/quran";
import { revelationFr } from "@/lib/quran";
import { SurahBadge } from "./AppShell";

export function SurahCard({ s }: { s: Surah }) {
  return (
    <Link
      to="/sourate/$id"
      params={{ id: String(s.number) }}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-gold"
    >
      <SurahBadge n={s.number} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{s.englishName}</p>
        <p className="truncate text-xs text-muted-foreground">
          {s.englishNameTranslation} · {revelationFr(s.revelationType)} · {s.numberOfAyahs} versets
        </p>
      </div>
      <span className="font-arabic text-xl text-primary">{s.name.replace("سُورَةُ ", "")}</span>
    </Link>
  );
}

export function SurahSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-[76px] animate-pulse rounded-2xl bg-muted" />
      ))}
    </>
  );
}
