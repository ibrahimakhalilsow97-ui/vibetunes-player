import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { searchQuery, surahsQuery } from "@/lib/quran";
import { PageTitle } from "@/components/AppShell";
import { SurahCard } from "@/components/SurahList";

export const Route = createFileRoute("/recherche")({
  head: () => ({
    meta: [
      { title: "Recherche dans le Coran — Nour" },
      { name: "description", content: "Recherchez une sourate ou un mot dans la traduction française du Coran." },
      { property: "og:title", content: "Recherche — Nour" },
      { property: "og:description", content: "Trouvez un verset ou une sourate." },
    ],
  }),
  component: Recherche,
});

function Recherche() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => { const t = setTimeout(() => setDebounced(q), 400); return () => clearTimeout(t); }, [q]);
  const { data: surahs } = useQuery(surahsQuery);
  const { data: results, isFetching } = useQuery(searchQuery(debounced));
  const matchS = q ? (surahs ?? []).filter((s) => `${s.englishName} ${s.englishNameTranslation}`.toLowerCase().includes(q.toLowerCase())).slice(0, 4) : [];

  return (
    <div>
      <PageTitle title="Recherche" subtitle="Sourate, thème ou mot de la traduction" />
      <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-soft focus-within:border-gold">
        <Search className="h-5 w-5 text-gold" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex : miséricorde, patience, Yasin…" className="w-full bg-transparent outline-none" />
      </label>
      {!q && (
        <div className="mt-4 flex flex-wrap gap-2">
          {["miséricorde", "patience", "paradis", "prière", "lumière"].map((w) => (
            <button key={w} onClick={() => setQ(w)} className="rounded-full bg-secondary px-4 py-1.5 text-sm text-primary">{w}</button>
          ))}
        </div>
      )}
      {matchS.length > 0 && (
        <div className="mt-6 grid gap-3 md:grid-cols-2">{matchS.map((s) => <SurahCard key={s.number} s={s} />)}</div>
      )}
      {isFetching && <p className="mt-6 text-sm text-muted-foreground">Recherche…</p>}
      <div className="mt-6 space-y-3">
        {results?.map((r) => (
          <Link key={`${r.surah}-${r.ayah}`} to="/sourate/$id" params={{ id: String(r.surah) }} hash={`ayah-${r.ayah}`} className="block rounded-2xl border border-border bg-card p-4 shadow-soft hover:border-gold">
            <p className="text-xs font-semibold text-gold">{r.surahName} · {r.surah}:{r.ayah}</p>
            <p className="mt-1 text-sm leading-relaxed">{r.text}</p>
          </Link>
        ))}
        {debounced.length >= 3 && results?.length === 0 && !isFetching && <p className="text-sm text-muted-foreground">Aucun verset trouvé.</p>}
      </div>
    </div>
  );
}
