"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Recommendation } from "@/lib/recommendations";
import { addToWatchlist } from "@/lib/watchlist";
import Pagination from "@/components/Pagination";
import RecommendationCard from "@/components/RecommendationCard";
import RecommendationForm from "@/components/RecommendationForm";

const PAGE_SIZE = 6;

export default function RecommendationsBoard() {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Recommendation | null>(null);
  const [watchlistMessage, setWatchlistMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const formRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const totalPages = recommendations
    ? Math.max(1, Math.ceil(recommendations.length / PAGE_SIZE))
    : 1;
  const visibleRecommendations =
    recommendations?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) ?? [];

  const load = useCallback(() => {
    fetch("/api/recommendations")
      .then((response) => {
        if (!response.ok) throw new Error("Request failed");
        return response.json() as Promise<{ ok: boolean; recommendations?: Recommendation[] }>;
      })
      .then((data) => {
        if (!data.ok || !data.recommendations) throw new Error("Request failed");
        const items = data.recommendations;
        setRecommendations(items);
        setCurrentPage((page) =>
          Math.min(page, Math.max(1, Math.ceil(items.length / PAGE_SIZE))),
        );
        setError(null);
      })
      .catch(() => {
        setError("Could not load recommendations. Please try again later.");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!editing) return;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("title")?.focus({ preventScroll: true });
  }, [editing]);

  function handleEdit(recommendation: Recommendation) {
    setEditing(recommendation);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSaved() {
    const wasEditing = editing !== null;
    setEditing(null);
    if (!wasEditing) {
      setCurrentPage(1);
      setSuccessMessage("Thanks! Your recommendation was added.");
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    load();
  }

  function handleAddToWatchlist(recommendation: Recommendation) {
    const result = addToWatchlist({
      id: recommendation.id,
      title: recommendation.title,
      kind: recommendation.kind,
      year: recommendation.year,
      posterUrl: recommendation.posterUrl,
    });
    setWatchlistMessage(
      result === "added"
        ? "Added to your watchlist"
        : result === "exists"
          ? "Already in your watchlist"
          : "Could not save to your watchlist",
    );
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this recommendation?")) return;
    try {
      const response = await fetch(`/api/recommendations/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Request failed");
      if (editing?.id === id) setEditing(null);
      load();
    } catch {
      setError("Could not delete the recommendation. Please try again.");
    }
  }

  return (
    <div>
      {error && (
        <div role="alert" className="mt-8 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {recommendations === null && !error && <p className="mt-8 text-muted">Loading recommendations...</p>}

      {recommendations !== null && recommendations.length === 0 && (
        <p className="mt-8 text-muted">No recommendations yet. Be the first!</p>
      )}

      {recommendations !== null && recommendations.length > 0 && (
        <div ref={gridRef} className="mt-8">
          {successMessage && (
            <p
              role="status"
              className="rounded-xl border border-blush bg-blush-pale px-4 py-3 text-sm text-blush-deep"
            >
              {successMessage}
            </p>
          )}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {watchlistMessage && (
              <p
                role="status"
                className="sm:col-span-2 lg:col-span-3 rounded-xl border border-blush bg-blush-pale px-4 py-3 text-sm text-blush-deep"
              >
                {watchlistMessage}
              </p>
            )}
            {visibleRecommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddToWatchlist={handleAddToWatchlist}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <div ref={formRef} className="mt-8">
        <RecommendationForm
          key={editing?.id ?? "new"}
          initial={editing ?? undefined}
          onSaved={handleSaved}
          onCancel={editing ? () => setEditing(null) : undefined}
        />
      </div>
    </div>
  );
}
