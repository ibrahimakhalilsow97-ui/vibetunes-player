import { useSyncExternalStore } from "react";

export type Fav = { surah: number; ayah: number; surahName: string; text: string };
export type HistoryItem = { surah: number; ayah: number; surahName: string; at: number };

type State = {
  dark: boolean;
  fontSize: number; // arabic px
  showTranslation: boolean;
  favorites: Fav[];
  history: HistoryItem[];
};

const KEY = "nour-state-v1";
const initial: State = { dark: false, fontSize: 32, showTranslation: true, favorites: [], history: [] };
let state: State = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {}
  applyDark();
}
function applyDark() {
  if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", state.dark);
}
function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  localStorage.setItem(KEY, JSON.stringify(state));
  applyDark();
  listeners.forEach((l) => l());
}

export function useAppState() {
  return useSyncExternalStore(
    (l) => {
      load();
      listeners.add(l);
      l();
      return () => listeners.delete(l);
    },
    () => state,
    () => initial,
  );
}

export const actions = {
  toggleDark: () => set({ dark: !state.dark }),
  setFontSize: (n: number) => set({ fontSize: Math.min(56, Math.max(22, n)) }),
  toggleTranslation: () => set({ showTranslation: !state.showTranslation }),
  toggleFav: (f: Fav) => {
    const exists = state.favorites.some((x) => x.surah === f.surah && x.ayah === f.ayah);
    set({
      favorites: exists
        ? state.favorites.filter((x) => !(x.surah === f.surah && x.ayah === f.ayah))
        : [f, ...state.favorites],
    });
  },
  addHistory: (h: Omit<HistoryItem, "at">) => {
    const rest = state.history.filter((x) => x.surah !== h.surah);
    set({ history: [{ ...h, at: Date.now() }, ...rest].slice(0, 30) });
  },
  clearHistory: () => set({ history: [] }),
};
