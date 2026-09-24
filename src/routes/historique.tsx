import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { actions, useAppState } from "@/lib/store";
import { PageTitle, SurahBadge } from "@/components/AppShell";

export const Route = createFileRoute("/historique")({
  head: () => ({
    meta: [
      { title: "Historique de lecture — Nour" },
      { name: "description", content: "Vos dernières sourates lues dans le Coran." },
      { property: "og:title", content: "Historique — Nour" },
      { property: "og:description", content: "Vos lectures récentes." },
    ],
  }),
  component: Historique,
});

function Historique() {
  const { history } = useAppState();
  return (
    <div>
      <div className="flex items-start justify-between">
        <PageTitle title="Historique" subtitle="Vos lectures récentes" />
        {history.length > 0 && <button onClick={actions.clearHistory} className="rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">Effacer</button>}
      </div>
      {history.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <Clock className="mx-auto h-8 w-8 text-gold" />
          <p className="mt-3 text-muted-foreground">Aucune lecture pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((h) => (
            <Link key={h.surah} to="/sourate/$id" params={{ id: String(h.surah) }} hash={`ayah-${h.ayah}`} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft hover:border-gold">
              <SurahBadge n={h.surah} />
              <div className="flex-1">
                <p className="font-semibold">{h.surahName}</p>
                <p className="text-xs text-muted-foreground">Verset {h.ayah}</p>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(h.at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
