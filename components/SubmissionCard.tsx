import type { Submission } from "@/lib/contact-store";

type SubmissionCardProps = {
  submission: Submission;
  onEdit: () => void;
  onDelete: () => void;
};

export default function SubmissionCard({ submission, onEdit, onDelete }: SubmissionCardProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 p-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl">{submission.name}</h2>
          <span className="rounded-full border border-border px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted">
            {submission.source}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">
          <a href={`mailto:${submission.email}`} className="hover:underline">
            {submission.email}
          </a>
          {" · "}
          {new Date(submission.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
        <p className="mt-3 whitespace-pre-line text-sm">{submission.message}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onEdit}
          className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-blush-deep"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-red-600 dark:hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
