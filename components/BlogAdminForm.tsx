"use client";

import Link from "next/link";
import { useState } from "react";
import { blocksToBody } from "@/lib/blog-body";
import type { BlogPost } from "@/lib/blogs";

type FieldErrors = { title?: string; summary?: string; body?: string };

type BlogAdminFormProps = {
  initial?: BlogPost;
  onSaved?: () => void;
  onCancel?: () => void;
};

const emptyValues = { title: "", summary: "", body: "" };

export default function BlogAdminForm({ initial, onSaved, onCancel }: BlogAdminFormProps) {
  const [values, setValues] = useState(
    initial
      ? {
          title: initial.title,
          summary: initial.summary,
          body: blocksToBody(initial.blocks),
        }
      : emptyValues,
  );
  const [successSlug, setSuccessSlug] = useState<string | null>(null);
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
    setSuccessSlug(null);
    setErrorMessage(null);
    setErrors({});

    try {
      const response = await fetch(
        initial ? `/api/blogs/${initial.slug}` : "/api/blogs",
        {
          method: initial ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: values.title,
            summary: values.summary,
            body: values.body,
          }),
        },
      );
      const data = (await response.json()) as {
        ok: boolean;
        post?: { slug: string };
        errors?: FieldErrors;
        error?: string;
      };

      if (response.ok && data.ok && data.post) {
        setSuccessSlug(data.post.slug);
        if (!initial) setValues(emptyValues);
        onSaved?.();
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
          {initial ? `Editing "${initial.title}"` : "Add a blog post"}
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

      {successSlug && (
        <div role="status" className="rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          {initial ? "Post updated. " : "Post published. "}
          <Link href={`/blogs/${successSlug}`} className="underline underline-offset-4">
            View post
          </Link>
        </div>
      )}
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
        <label htmlFor="body" className="block font-mono text-xs uppercase tracking-widest text-muted">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          rows={10}
          value={values.body}
          onChange={handleChange}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        <p className="mt-2 text-sm text-muted">
          Leave a blank line between paragraphs. Photos look like [image: /blog/file.jpg | description].
        </p>
        {errors.body && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.body}</p>}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-blush px-8 py-4 text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-blush-deep hover:text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : initial ? "Save changes" : "Publish post"}
      </button>
    </form>
  );
}
