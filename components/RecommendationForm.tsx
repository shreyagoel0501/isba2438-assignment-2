"use client";

import { useState } from "react";
import type { Recommendation } from "@/lib/recommendations";

type FieldErrors = { title?: string; kind?: string; why?: string; recommendedBy?: string };

type RecommendationFormProps = {
  initial?: Recommendation;
  onSaved: () => void;
  onCancel?: () => void;
};

const emptyValues = { title: "", kind: "", why: "", recommendedBy: "" };

export default function RecommendationForm({ initial, onSaved, onCancel }: RecommendationFormProps) {
  const [values, setValues] = useState({
    title: initial?.title ?? "",
    kind: initial?.kind ?? "",
    why: initial?.why ?? "",
    recommendedBy: initial?.recommendedBy ?? "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrorMessage(null);
    setErrors({});

    try {
      const response = await fetch(
        initial ? `/api/recommendations/${initial.id}` : "/api/recommendations",
        {
          method: initial ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: values.title,
            kind: values.kind,
            why: values.why,
            recommendedBy: values.recommendedBy,
          }),
        },
      );
      const data = (await response.json()) as {
        ok: boolean;
        errors?: FieldErrors;
        error?: string;
      };

      if (response.ok && data.ok) {
        if (!initial) setValues(emptyValues);
        onSaved();
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6 rounded-sm border border-border bg-card p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl">
          {initial ? `Editing "${initial.title}"` : "Recommend a thriller"}
        </h2>
        {initial && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-blush-deep disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>

      {errorMessage && (
        <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block font-mono text-xs uppercase tracking-widest text-muted">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        {errors.title && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="kind" className="block font-mono text-xs uppercase tracking-widest text-muted">
          Kind
        </label>
        <select
          id="kind"
          name="kind"
          value={values.kind}
          onChange={handleChange}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        >
          <option value="">Choose one</option>
          <option value="movie">Movie</option>
          <option value="show">Show</option>
          <option value="book">Book</option>
        </select>
        {errors.kind && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.kind}</p>}
      </div>

      <div>
        <label htmlFor="why" className="block font-mono text-xs uppercase tracking-widest text-muted">
          Why
        </label>
        <textarea
          id="why"
          name="why"
          rows={4}
          value={values.why}
          onChange={handleChange}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        {errors.why && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.why}</p>}
      </div>

      <div>
        <label htmlFor="recommendedBy" className="block font-mono text-xs uppercase tracking-widest text-muted">
          Your name
        </label>
        <input
          id="recommendedBy"
          name="recommendedBy"
          type="text"
          value={values.recommendedBy}
          onChange={handleChange}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        {errors.recommendedBy && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.recommendedBy}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-blush px-8 py-4 text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-blush-deep hover:text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : initial ? "Save changes" : "Save recommendation"}
      </button>
    </form>
  );
}
