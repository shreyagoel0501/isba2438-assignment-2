"use client";

import { useCallback, useEffect, useState } from "react";
import type { Recommendation } from "@/lib/recommendations";
import RecommendationCard from "@/components/RecommendationCard";
import RecommendationForm from "@/components/RecommendationForm";

export default function RecommendationsBoard() {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Recommendation | null>(null);

  const load = useCallback(() => {
    fetch("/api/recommendations")
      .then((response) => {
        if (!response.ok) throw new Error("Request failed");
        return response.json() as Promise<{ ok: boolean; recommendations?: Recommendation[] }>;
      })
      .then((data) => {
        if (!data.ok || !data.recommendations) throw new Error("Request failed");
        setRecommendations(data.recommendations);
        setError(null);
      })
      .catch(() => {
        setError("Could not load recommendations. Please try again later.");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleSaved() {
    setEditing(null);
    load();
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
      <RecommendationForm
        key={editing?.id ?? "new"}
        initial={editing ?? undefined}
        onSaved={handleSaved}
        onCancel={editing ? () => setEditing(null) : undefined}
      />

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
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
