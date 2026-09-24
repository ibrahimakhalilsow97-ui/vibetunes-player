import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { surahsQuery } from "@/lib/quran";
import { PageTitle } from "@/components/AppShell";
import { SurahCard, SurahSkeleton } from "@/components/SurahList";

export const Route = createFileRoute("/sourates")({
  head: () => ({
    meta: [
      { title: "Les 114 sourates — Nour" },
      { name: "description", content: "Liste complète des 114 sourates du Coran, mecquoises et médinoises." },
      { property: "og:title", content: "Les 114 sourates — Nour" },
      { property: "og:description", content: "Parcourez toutes les sourates du Coran." },
    ],
  }),
  component: Sourates,
});

function Sourates() {
  const { data } = useQuery(surahsQuery);
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "Meccan" | "Medinan">("all");
  const list = (data ?? []).filter(
    (s) =>
      (type === "all" || s.revelationType === type) &&
      `${s.number} ${s.englishName} ${s.englishNameTranslation} ${s.name}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div>
      <PageTitle title="Sourates" subtitle="Les 114 chapitres du Saint Coran" />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrer par nom ou numéro…" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <div className="flex rounded-2xl border border-border bg-card p-1">
          {([["all", "Toutes"], ["Meccan", "Mecquoises"], ["Medinan", "Médinoises"]] as const).map(([v, l]) => (
            <button key={v} onClick={() => setType(v)} className={`rounded-xl px-3 py-2 text-xs font-medium ${type === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {data ? list.map((s) => <SurahCard key={s.number} s={s} />) : <SurahSkeleton count={10} />}
      </div>
    </div>
  );
}
