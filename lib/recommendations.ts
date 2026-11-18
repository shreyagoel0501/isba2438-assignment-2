import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { findPosterUrl } from "./posters";

export type RecommendationKind = "movie" | "show" | "book";

export type Recommendation = {
  id: string;
  title: string;
  kind: RecommendationKind;
  why: string;
  recommendedBy: string;
  year?: number;
  posterUrl?: string;
  createdAt: string;
  updatedAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "recommendations.json");

export async function readRecommendations(): Promise<Recommendation[]> {
  try {
    const items = JSON.parse(await readFile(filePath, "utf8")) as Recommendation[];
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function getRecommendation(id: string): Promise<Recommendation | undefined> {
  const items = await readRecommendations();
  return items.find((item) => item.id === id);
}

export function validateRecommendation(input: {
  title?: unknown;
  kind?: unknown;
  why?: unknown;
  recommendedBy?: unknown;
  year?: unknown;
}):
  | {
      ok: true;
      data: {
        title: string;
        kind: RecommendationKind;
        why: string;
        recommendedBy: string;
        year?: number;
      };
    }
  | { ok: false; errors: { title?: string; kind?: string; why?: string; recommendedBy?: string; year?: string } } {
  const errors: { title?: string; kind?: string; why?: string; recommendedBy?: string; year?: string } = {};

  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (!title) errors.title = "Please enter a title.";

  const kinds: RecommendationKind[] = ["movie", "show", "book"];
  const kind = typeof input.kind === "string" ? (input.kind.trim() as RecommendationKind) : ("" as RecommendationKind);
  if (!kinds.includes(kind)) errors.kind = "Please choose movie, show or book.";

  const why = typeof input.why === "string" ? input.why.trim() : "";
  if (!why) errors.why = "Please tell me why you recommend it.";

  const recommendedBy = typeof input.recommendedBy === "string" ? input.recommendedBy.trim() : "";
  if (!recommendedBy) errors.recommendedBy = "Please enter your name.";

  let year: number | undefined;
  if (input.year !== undefined && input.year !== null && input.year !== "") {
    if (
      typeof input.year !== "number" ||
      !Number.isInteger(input.year) ||
      input.year < 1900 ||
      input.year > 2100
    ) {
      errors.year = "Year must be a whole number between 1900 and 2100.";
    } else {
      year = input.year;
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { title, kind, why, recommendedBy, year } };
}

export async function createRecommendation(data: {
  title: string;
  kind: RecommendationKind;
  why: string;
  recommendedBy: string;
  year?: number;
}): Promise<Recommendation> {
  await mkdir(dataDir, { recursive: true });
  const items = await readRecommendations();

  const now = new Date().toISOString();
  const posterUrl = await findPosterUrl(data.title, data.kind, data.year);
  const item: Recommendation = {
    id: crypto.randomUUID(),
    title: data.title,
    kind: data.kind,
    why: data.why,
    recommendedBy: data.recommendedBy,
    year: data.year,
    posterUrl,
    createdAt: now,
    updatedAt: now,
  };

  items.push(item);
  await writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
  return item;
}

export async function updateRecommendation(
  id: string,
  data: {
    title: string;
    kind: RecommendationKind;
    why: string;
    recommendedBy: string;
    year?: number;
  }
): Promise<Recommendation | null> {
  await mkdir(dataDir, { recursive: true });
  const items = await readRecommendations();
  const item = items.find((entry) => entry.id === id);
  if (!item) return null;

  const detailsChanged =
    item.title !== data.title || item.kind !== data.kind || item.year !== data.year;

  item.title = data.title;
  item.kind = data.kind;
  item.why = data.why;
  item.recommendedBy = data.recommendedBy;
  item.year = data.year;
  item.updatedAt = new Date().toISOString();

  if (detailsChanged || !item.posterUrl) {
    item.posterUrl = await findPosterUrl(item.title, item.kind, item.year);
  }

  await writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
  return item;
}

export async function deleteRecommendation(id: string): Promise<boolean> {
  await mkdir(dataDir, { recursive: true });
  const items = await readRecommendations();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;

  await writeFile(filePath, JSON.stringify(next, null, 2), "utf8");
  return true;
}
