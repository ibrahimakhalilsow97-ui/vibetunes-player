import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { actions, useAppState } from "@/lib/store";
import { PageTitle } from "@/components/AppShell";

export const Route = createFileRoute("/reglages")({
  head: () => ({
    meta: [
      { title: "Réglages de lecture — Nour" },
      { name: "description", content: "Mode sombre, taille du texte arabe et affichage de la traduction." },
      { property: "og:title", content: "Réglages — Nour" },
      { property: "og:description", content: "Personnalisez votre confort de lecture." },
    ],
  }),
  component: Reglages,
});

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} role="switch" aria-checked={on} className={`relative h-7 w-12 rounded-full transition ${on ? "bg-primary" : "bg-muted"}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-card shadow transition ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

function Reglages() {
  const { dark, fontSize, showTranslation } = useAppState();
  return (
    <div className="space-y-4">
      <PageTitle title="Réglages" subtitle="Votre confort de lecture" />
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div><p className="font-semibold">Mode sombre</p><p className="text-xs text-muted-foreground">Idéal pour la lecture nocturne</p></div>
        <Toggle on={dark} onClick={actions.toggleDark} />
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div><p className="font-semibold">Afficher la traduction</p><p className="text-xs text-muted-foreground">Français — Muhammad Hamidullah</p></div>
        <Toggle on={showTranslation} onClick={actions.toggleTranslation} />
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Taille du texte arabe</p>
          <div className="flex items-center gap-2">
            <button aria-label="Réduire" onClick={() => actions.setFontSize(fontSize - 2)} className="grid h-9 w-9 place-items-center rounded-xl bg-secondary"><Minus className="h-4 w-4" /></button>
            <span className="w-12 text-center text-sm">{fontSize}px</span>
            <button aria-label="Agrandir" onClick={() => actions.setFontSize(fontSize + 2)} className="grid h-9 w-9 place-items-center rounded-xl bg-secondary"><Plus className="h-4 w-4" /></button>
          </div>
        </div>
        <input type="range" min={22} max={56} step={2} value={fontSize} onChange={(e) => actions.setFontSize(+e.target.value)} className="mt-4 w-full accent-[var(--gold)]" />
        <p dir="rtl" className="mt-4 rounded-xl bg-muted p-4 text-center font-arabic text-primary" style={{ fontSize, lineHeight: 2 }}>ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ</p>
      </div>
    </div>
  );
}
