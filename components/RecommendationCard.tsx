import type { Recommendation } from "@/lib/recommendations";

type RecommendationCardProps = {
  recommendation: Recommendation;
  onEdit: (recommendation: Recommendation) => void;
  onDelete: (id: string) => void;
};

export default function RecommendationCard({
  recommendation,
  onEdit,
  onDelete,
}: RecommendationCardProps) {
  return (
    <article className="flex flex-col rounded-sm border border-border bg-card p-8 transition-all duration-200 hover:border-blush">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl">{recommendation.title}</h2>
        <span className="rounded-full bg-blush-pale px-3 py-1 font-mono text-xs text-blush-deep">
          {recommendation.kind}
        </span>
      </div>
      <p className="mt-2 text-muted">{recommendation.why}</p>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-blush-deep">
        Recommended by {recommendation.recommendedBy}
      </p>
      <div className="mt-6 flex gap-4">
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
