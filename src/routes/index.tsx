import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Heart, History, Search } from "lucide-react";
import { surahsQuery } from "@/lib/quran";
import { useAppState } from "@/lib/store";
import { SurahCard, SurahSkeleton } from "@/components/SurahList";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nour — Lecture du Coran en arabe et français" },
      { name: "description", content: "Reprenez votre lecture du Coran, avec texte arabe, traduction française et récitation audio." },
      { property: "og:title", content: "Nour — Lecture du Coran" },
      { property: "og:description", content: "Texte arabe, traduction française, audio, favoris et historique." },
    ],
  }),
  component: Home,
});

const popular = [1, 18, 36, 55, 67, 112];

function Home() {
  const { history, favorites } = useAppState();
  const { data } = useQuery(surahsQuery);
  const last = history[0];
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Bonne matinée" : hour < 18 ? "Bon après-midi" : "Bonne soirée";

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-muted-foreground">As-salāmu ʿalaykum · {greet}</p>
        <h1 className="font-display text-4xl font-semibold text-primary md:text-5xl">Que la lumière guide votre lecture</h1>
      </section>

      {/* Continuer */}
      <section className="relative overflow-hidden rounded-3xl bg-hero p-6 text-primary-foreground shadow-soft md:p-8 dark:text-foreground">
        <svg className="absolute -right-10 -top-10 h-56 w-56 text-gold opacity-25" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
          {[0, 15, 30, 45, 60, 75].map((r) => (
            <rect key={r} x="25" y="25" width="50" height="50" transform={`rotate(${r} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="18" />
        </svg>
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Continuer la lecture</p>
        {last ? (
          <>
            <h2 className="mt-2 font-display text-3xl font-semibold">{last.surahName}</h2>
            <p className="mt-1 text-sm opacity-80">Sourate {last.surah} · Verset {last.ayah}</p>
            <Link
              to="/sourate/$id"
              params={{ id: String(last.surah) }}
              hash={`ayah-${last.ayah}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-primary"
            >
              Reprendre <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <>
            <h2 className="mt-2 font-display text-3xl font-semibold">Al-Fatiha</h2>
            <p className="mt-1 font-arabic text-2xl opacity-90">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
            <Link to="/sourate/$id" params={{ id: "1" }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-primary">
              Commencer <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </section>

      {/* Raccourcis */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { to: "/sourates", icon: BookOpen, label: "Sourates", sub: "114 sourates" },
          { to: "/recherche", icon: Search, label: "Recherche", sub: "Mot ou verset" },
          { to: "/favoris", icon: Heart, label: "Favoris", sub: `${favorites.length} verset(s)` },
          { to: "/historique", icon: History, label: "Historique", sub: `${history.length} lecture(s)` },
        ].map(({ to, icon: Icon, label, sub }) => (
          <Link key={to} to={to} className="rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:border-gold">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary"><Icon className="h-5 w-5" /></span>
            <p className="mt-3 font-semibold">{label}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </Link>
        ))}
      </section>

      {/* Verset du jour */}
      <section className="rounded-3xl border border-gold/40 bg-card p-6 text-center shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Verset du jour</p>
        <p dir="rtl" className="mt-4 font-arabic text-3xl leading-loose text-primary">أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ</p>
        <p className="mt-3 text-muted-foreground">« N'est-ce point par l'évocation d'Allah que se tranquillisent les cœurs ? »</p>
        <p className="mt-2 text-xs text-muted-foreground">Ar-Ra'd · 13:28</p>
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl font-semibold text-primary">Sourates populaires</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data ? popular.map((n) => data[n - 1] && <SurahCard key={n} s={data[n - 1]!} />) : <SurahSkeleton />}
        </div>
      </section>
    </div>
  );
}
