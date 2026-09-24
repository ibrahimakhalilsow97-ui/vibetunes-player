import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Languages, Minus, Pause, Play, Plus, Volume2 } from "lucide-react";
import { ayahAudio, revelationFr, surahAudio, surahQuery } from "@/lib/quran";
import { actions, useAppState } from "@/lib/store";

export const Route = createFileRoute("/sourate/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Sourate ${params.id} — Lecture — Nour` },
      { name: "description", content: `Lire la sourate ${params.id} en arabe avec traduction française et audio.` },
      { property: "og:title", content: `Sourate ${params.id} — Nour` },
      { property: "og:description", content: "Texte arabe, traduction française et récitation." },
    ],
  }),
  component: Reader,
});

function Reader() {
  const id = Number(Route.useParams().id);
  const { data, isLoading } = useQuery(surahQuery(id));
  const { fontSize, showTranslation, favorites } = useAppState();
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (data) actions.addHistory({ surah: id, ayah: 1, surahName: data.surah.englishName });
    return () => audio.current?.pause();
  }, [data, id]);

  useEffect(() => {
    if (data && location.hash) document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [data]);

  const play = (key: string, src: string) => {
    if (playing === key) {
      audio.current?.pause();
      setPlaying(null);
      return;
    }
    audio.current?.pause();
    const a = new Audio(src);
    a.ontimeupdate = () => setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
    a.onended = () => setPlaying(null);
    a.play();
    audio.current = a;
    setPlaying(key);
  };

  if (isLoading || !data)
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-40 animate-pulse rounded-3xl bg-muted" />)}</div>;

  const { surah, ayahs } = data;
  const isFav = (n: number) => favorites.some((f) => f.surah === id && f.ayah === n);

  return (
    <div className="space-y-5">
      {/* En-tête sourate */}
      <section className="relative overflow-hidden rounded-3xl bg-hero p-6 text-center text-primary-foreground shadow-soft dark:text-foreground">
        <div className="pattern-layer opacity-60" />
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Sourate {surah.number}</p>
        <h1 className="mt-4 font-arabic text-4xl leading-[1.8]">{surah.name}</h1>
        <p className="mt-1 font-display text-2xl">{surah.englishName}</p>
        <p className="mt-1 text-sm opacity-80">{surah.englishNameTranslation} · {revelationFr(surah.revelationType)} · {surah.numberOfAyahs} versets</p>
        <button onClick={() => play("surah", surahAudio(id))} className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-primary dark:text-primary-foreground">
          {playing === "surah" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing === "surah" ? "Pause" : "Écouter la sourate"}
        </button>
      </section>

      {/* Barre d'outils */}
      <div className="sticky top-[68px] z-10 flex items-center justify-between gap-2 rounded-2xl border border-border bg-card/95 p-2 shadow-soft backdrop-blur lg:top-4">
        <div className="flex items-center gap-1">
          <button aria-label="Réduire le texte" onClick={() => actions.setFontSize(fontSize - 2)} className="grid h-9 w-9 place-items-center rounded-xl hover:bg-secondary"><Minus className="h-4 w-4" /></button>
          <span className="w-12 text-center text-xs text-muted-foreground">{fontSize}px</span>
          <button aria-label="Agrandir le texte" onClick={() => actions.setFontSize(fontSize + 2)} className="grid h-9 w-9 place-items-center rounded-xl hover:bg-secondary"><Plus className="h-4 w-4" /></button>
        </div>
        <button onClick={actions.toggleTranslation} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${showTranslation ? "bg-secondary text-primary" : "text-muted-foreground"}`}>
          <Languages className="h-4 w-4" /> Traduction
        </button>
      </div>

      {id !== 1 && id !== 9 && (
        <p dir="rtl" className="text-center font-arabic text-3xl text-primary">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
      )}

      {/* Versets */}
      <div className="space-y-3">
        {ayahs.map((a) => {
          const key = `a${a.number}`;
          const text = id !== 1 && a.numberInSurah === 1 ? a.text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, "") : a.text;
          return (
            <article
              id={`ayah-${a.numberInSurah}`}
              key={a.number}
              onClick={() => actions.addHistory({ surah: id, ayah: a.numberInSurah, surahName: surah.englishName })}
              className={`rounded-3xl border bg-card p-5 shadow-soft transition md:p-7 ${playing === key ? "border-gold" : "border-border"}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">{id}:{a.numberInSurah}</span>
                <div className="flex gap-1">
                  <button aria-label="Écouter" onClick={(e) => { e.stopPropagation(); play(key, ayahAudio(a.number)); }} className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-primary">
                    {playing === key ? <Pause className="h-4 w-4 text-gold" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <button aria-label="Favori" onClick={(e) => { e.stopPropagation(); actions.toggleFav({ surah: id, ayah: a.numberInSurah, surahName: surah.englishName, text: a.translation }); }} className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:bg-secondary">
                    <Heart className={`h-4 w-4 ${isFav(a.numberInSurah) ? "fill-gold text-gold" : ""}`} />
                  </button>
                </div>
              </div>
              <p dir="rtl" lang="ar" className="font-arabic text-foreground" style={{ fontSize, lineHeight: 2.1 }}>
                {text} <span className="text-gold">۝{a.numberInSurah.toLocaleString("ar-EG")}</span>
              </p>
              {showTranslation && <p className="mt-4 border-t border-border pt-4 leading-relaxed text-muted-foreground" style={{ fontSize: Math.max(15, fontSize * 0.5) }}>{a.translation}</p>}
            </article>
          );
        })}
      </div>

      <div className="flex justify-between">
        {id > 1 ? <Link to="/sourate/$id" params={{ id: String(id - 1) }} className="flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2 text-sm"><ChevronLeft className="h-4 w-4" /> Précédente</Link> : <span />}
        {id < 114 && <Link to="/sourate/$id" params={{ id: String(id + 1) }} className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Suivante <ChevronRight className="h-4 w-4" /></Link>}
      </div>

      {playing && (
        <div className="fixed inset-x-3 bottom-20 z-40 flex items-center gap-3 rounded-2xl border border-gold/50 bg-card p-3 shadow-soft lg:bottom-6 lg:left-auto lg:right-6 lg:w-96">
          <button onClick={() => { audio.current?.pause(); setPlaying(null); }} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Pause className="h-4 w-4" /></button>
          <div className="flex-1">
            <p className="text-sm font-semibold">{surah.englishName} · Mishary Alafasy</p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-gold" style={{ width: `${progress}%` }} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
