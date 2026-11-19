"use client";

import { useState } from "react";
import type { Project } from "@/lib/projects";

type FieldErrors = { title?: string; summary?: string; description?: string; tech?: string; githubUrl?: string };

type ProjectFormProps = {
  initial?: Project;
  onSaved: () => void;
  onCancel?: () => void;
};

const emptyValues = { title: "", summary: "", description: "", tech: "", githubUrl: "" };

export default function ProjectForm({ initial, onSaved, onCancel }: ProjectFormProps) {
  const [values, setValues] = useState({
    title: initial?.title ?? "",
    summary: initial?.summary ?? "",
    description: initial?.description ?? "",
    tech: initial?.tech.join(", ") ?? "",
    githubUrl: initial?.githubUrl ?? "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
        initial ? `/api/projects/${initial.slug}` : "/api/projects",
        {
          method: initial ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: values.title,
            summary: values.summary,
            description: values.description,
            tech: values.tech,
            githubUrl: values.githubUrl.trim() === "" ? undefined : values.githubUrl,
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
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`mt-8 space-y-6 rounded-sm border p-8 ${
        initial ? "border-blush bg-blush-pale" : "border-border bg-card"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl">
          {initial ? `Editing "${initial.title}"` : "Add a project"}
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
        <label htmlFor="summary" className="block font-mono text-xs uppercase tracking-widest text-muted">
          Summary
        </label>
        <input
          id="summary"
          name="summary"
          type="text"
          value={values.summary}
          onChange={handleChange}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        {errors.summary && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.summary}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block font-mono text-xs uppercase tracking-widest text-muted">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={values.description}
          onChange={handleChange}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="tech" className="block font-mono text-xs uppercase tracking-widest text-muted">
          Tech
        </label>
        <input
          id="tech"
          name="tech"
          type="text"
          value={values.tech}
          onChange={handleChange}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        <p className="mt-1 text-sm text-muted">Separate with commas</p>
        {errors.tech && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.tech}</p>}
      </div>

      <div>
        <label htmlFor="githubUrl" className="block font-mono text-xs uppercase tracking-widest text-muted">
          GitHub link <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="githubUrl"
          name="githubUrl"
          type="url"
          value={values.githubUrl}
          onChange={handleChange}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        {errors.githubUrl && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.githubUrl}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-blush px-8 py-4 text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-blush-deep hover:text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : initial ? "Save changes" : "Save project"}
      </button>
    </form>
  );
}
