import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { actions, useAppState } from "@/lib/store";
import { PageTitle } from "@/components/AppShell";

export const Route = createFileRoute("/favoris")({
  head: () => ({
    meta: [
      { title: "Mes versets favoris — Nour" },
      { name: "description", content: "Retrouvez les versets du Coran que vous avez enregistrés." },
      { property: "og:title", content: "Favoris — Nour" },
      { property: "og:description", content: "Vos versets enregistrés." },
    ],
  }),
  component: Favoris,
});

function Favoris() {
  const { favorites } = useAppState();
  return (
    <div>
      <PageTitle title="Favoris" subtitle={`${favorites.length} verset(s) enregistré(s)`} />
      {favorites.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <Heart className="mx-auto h-8 w-8 text-gold" />
          <p className="mt-3 text-muted-foreground">Touchez le cœur d'un verset pendant la lecture pour l'ajouter ici.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {favorites.map((f) => (
            <div key={`${f.surah}-${f.ayah}`} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <Link to="/sourate/$id" params={{ id: String(f.surah) }} hash={`ayah-${f.ayah}`} className="text-sm font-semibold text-primary">{f.surahName} · {f.surah}:{f.ayah}</Link>
                <button aria-label="Retirer" onClick={() => actions.toggleFav(f)}><Heart className="h-4 w-4 fill-gold text-gold" /></button>
              </div>
              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
