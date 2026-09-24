import { queryOptions } from "@tanstack/react-query";

const API = "https://api.alquran.cloud/v1";

export type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
};
export type Ayah = { number: number; numberInSurah: number; text: string; translation: string };

export const surahsQuery = queryOptions({
  queryKey: ["surahs"],
  staleTime: Infinity,
  queryFn: async (): Promise<Surah[]> => {
    const r = await fetch(`${API}/surah`);
    return (await r.json()).data;
  },
});

export const surahQuery = (n: number) =>
  queryOptions({
    queryKey: ["surah", n],
    staleTime: Infinity,
    queryFn: async () => {
      const r = await fetch(`${API}/surah/${n}/editions/quran-uthmani,fr.hamidullah`);
      const [ar, fr] = (await r.json()).data;
      const ayahs: Ayah[] = ar.ayahs.map((a: any, i: number) => ({
        number: a.number,
        numberInSurah: a.numberInSurah,
        text: a.text,
        translation: fr.ayahs[i].text,
      }));
      return { surah: ar as Surah, ayahs };
    },
  });

export const searchQuery = (q: string) =>
  queryOptions({
    queryKey: ["search", q],
    enabled: q.trim().length >= 3,
    queryFn: async () => {
      const r = await fetch(`${API}/search/${encodeURIComponent(q.trim())}/all/fr.hamidullah`);
      const j = await r.json();
      if (j.code !== 200) return [];
      return (j.data.matches as any[]).slice(0, 40).map((m) => ({
        surah: m.surah.number as number,
        surahName: m.surah.englishName as string,
        ayah: m.numberInSurah as number,
        text: m.text as string,
      }));
    },
  });

export const surahAudio = (n: number) => `https://server8.mp3quran.net/afs/${String(n).padStart(3, "0")}.mp3`;
export const ayahAudio = (global: number) => `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${global}.mp3`;
export const revelationFr = (t: string) => (t === "Meccan" ? "Mecquoise" : "Médinoise");
