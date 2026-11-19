"use client";

import { useState } from "react";
import Image from "next/image";
import type { Recommendation } from "@/lib/recommendations";

type RecommendationCardProps = {
  recommendation: Recommendation;
  onEdit: (recommendation: Recommendation) => void;
  onDelete: (id: string) => void;
  onAddToWatchlist: (recommendation: Recommendation) => void;
};

const posterSizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

export default function RecommendationCard({
  recommendation,
  onEdit,
  onDelete,
  onAddToWatchlist,
}: RecommendationCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPoster = Boolean(recommendation.posterUrl) && !imageFailed;

  return (
    <article className="flex flex-col rounded-sm border border-border bg-card p-8 transition-all duration-200 hover:border-blush">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm">
        {showPoster ? (
          <Image
            src={recommendation.posterUrl as string}
            alt={`${recommendation.title} poster`}
            fill
            sizes={posterSizes}
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-blush-pale">
            <span className="font-display text-6xl text-blush-deep">
              {recommendation.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl">{recommendation.title}</h2>
        <div className="flex items-center gap-2">
          {recommendation.year !== undefined && (
            <span className="font-mono text-xs text-muted">{recommendation.year}</span>
          )}
          <span className="rounded-full bg-blush-pale px-3 py-1 font-mono text-xs text-blush-deep">
            {recommendation.kind}
          </span>
        </div>
      </div>
      <p className="mt-2 text-muted">{recommendation.why}</p>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-blush-deep">
        Recommended by {recommendation.recommendedBy}
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => onAddToWatchlist(recommendation)}
          className="text-xs uppercase tracking-widest text-blush-deep transition-colors hover:text-foreground"
        >
          Add to watchlist
        </button>
        <button
          type="button"
          onClick={() => onEdit(recommendation)}
          className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-blush-deep"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(recommendation.id)}
          className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
