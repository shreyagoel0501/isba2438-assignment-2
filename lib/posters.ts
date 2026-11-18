import type { RecommendationKind } from "./recommendations";

const TMDB_BASE_URL = "https://api.themoviedb.org/3/search";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";
const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";
const TIMEOUT_MS = 5000;

type TmdbResult = {
  title?: string;
  name?: string;
  poster_path?: string | null;
};

type TmdbSearchResponse = {
  results?: TmdbResult[];
};

type OpenLibrarySearchResponse = {
  docs?: Array<{
    cover_i?: number;
  }>;
};

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) return undefined;
  return response.json();
}

async function findTmdbPosterUrl(
  title: string,
  kind: "movie" | "show",
  year?: number,
): Promise<string | undefined> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return undefined;

  const params = new URLSearchParams({ query: title });
  if (year !== undefined) {
    params.set(kind === "movie" ? "year" : "first_air_date_year", String(year));
  }
  params.set("api_key", apiKey);

  const endpoint = kind === "movie" ? "movie" : "tv";
  const data = (await fetchJson(`${TMDB_BASE_URL}/${endpoint}?${params.toString()}`)) as
    | TmdbSearchResponse
    | undefined;
  const results = data?.results;
  if (!results || results.length === 0) return undefined;

  const normalizedTitle = title.toLowerCase();
  const posterFor = (result: TmdbResult) =>
    result.poster_path ? `${TMDB_IMAGE_BASE_URL}${result.poster_path}` : undefined;

  const exact = results.find(
    (result) =>
      (result.title ?? result.name ?? "").toLowerCase() === normalizedTitle &&
      result.poster_path,
  );
  if (exact) return posterFor(exact);

  const first = results.find((result) => result.poster_path);
  return first ? posterFor(first) : undefined;
}

async function findBookCoverUrl(title: string): Promise<string | undefined> {
  const params = new URLSearchParams({ title, limit: "5" });
  const data = (await fetchJson(`${OPEN_LIBRARY_SEARCH_URL}?${params.toString()}`)) as
    | OpenLibrarySearchResponse
    | undefined;
  const coverId = data?.docs?.find((doc) => typeof doc.cover_i === "number")?.cover_i;
  if (!coverId) return undefined;
  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
}

export async function findPosterUrl(
  title: string,
  kind: RecommendationKind,
  year?: number,
): Promise<string | undefined> {
  try {
    if (kind === "book") return await findBookCoverUrl(title);
    return await findTmdbPosterUrl(title, kind, year);
  } catch {
    return undefined;
  }
}
