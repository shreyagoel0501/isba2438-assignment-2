export type WatchlistKind = "movie" | "show" | "book";

export type WatchlistItem = {
  id: string;
  title: string;
  kind: WatchlistKind;
  year?: number;
  posterUrl?: string;
  watched: boolean;
  rating?: number;
  note?: string;
  addedAt: string;
};

export type WatchlistDraft = {
  id: string;
  title: string;
  kind: WatchlistKind;
  year?: number;
  posterUrl?: string;
};

export type WatchlistStatus = "empty" | "ok" | "invalid";

export type WatchlistLoadResult = {
  items: WatchlistItem[];
  status: WatchlistStatus;
};

export const STORAGE_KEY = "thriller-watchlist:v1";

const kinds: WatchlistKind[] = ["movie", "show", "book"];

function isWatchlistKind(value: unknown): value is WatchlistKind {
  return typeof value === "string" && (kinds as string[]).includes(value);
}

function parseEntry(entry: unknown): WatchlistItem | null {
  if (typeof entry !== "object" || entry === null) return null;
  const record = entry as Record<string, unknown>;

  if (typeof record.id !== "string" || record.id === "") return null;
  if (typeof record.title !== "string" || record.title === "") return null;
  if (!isWatchlistKind(record.kind)) return null;
  if (typeof record.watched !== "boolean") return null;
  if (typeof record.addedAt !== "string" || record.addedAt === "") return null;

  let year: number | undefined;
  if (record.year !== undefined) {
    if (typeof record.year !== "number" || !Number.isInteger(record.year)) return null;
    year = record.year;
  }

  let posterUrl: string | undefined;
  if (record.posterUrl !== undefined) {
    if (typeof record.posterUrl !== "string") return null;
    posterUrl = record.posterUrl;
  }

  let rating: number | undefined;
  if (record.rating !== undefined) {
    if (
      typeof record.rating !== "number" ||
      !Number.isInteger(record.rating) ||
      record.rating < 1 ||
      record.rating > 5
    ) {
      return null;
    }
    rating = record.rating;
  }

  let note: string | undefined;
  if (record.note !== undefined) {
    if (typeof record.note !== "string") return null;
    note = record.note;
  }

  return {
    id: record.id,
    title: record.title,
    kind: record.kind,
    year,
    posterUrl,
    watched: record.watched,
    rating,
    note,
    addedAt: record.addedAt,
  };
}

export function loadWatchlist(): WatchlistLoadResult {
  try {
    if (typeof window === "undefined") return { items: [], status: "empty" };

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { items: [], status: "empty" };

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { items: [], status: "invalid" };
    }

    if (!Array.isArray(parsed)) return { items: [], status: "invalid" };

    const items: WatchlistItem[] = [];
    let dropped = false;
    for (const entry of parsed) {
      const item = parseEntry(entry);
      if (item === null) dropped = true;
      else items.push(item);
    }

    return { items, status: dropped ? "invalid" : "ok" };
  } catch {
    return { items: [], status: "invalid" };
  }
}

export function saveWatchlist(items: WatchlistItem[]): boolean {
  try {
    if (typeof window === "undefined") return false;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

export function addToWatchlist(draft: WatchlistDraft): "added" | "exists" | "failed" {
  const { items } = loadWatchlist();
  if (items.some((item) => item.id === draft.id)) return "exists";

  const item: WatchlistItem = {
    ...draft,
    watched: false,
    addedAt: new Date().toISOString(),
  };

  if (!saveWatchlist([...items, item])) return "failed";
  return "added";
}

export function clearWatchlist(): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}
