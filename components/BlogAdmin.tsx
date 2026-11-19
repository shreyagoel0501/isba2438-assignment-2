"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blogs";
import BlogAdminForm from "@/components/BlogAdminForm";

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    fetch("/api/blogs")
      .then((response) => {
        if (!response.ok) throw new Error("Request failed");
        return response.json() as Promise<{ ok: boolean; posts?: BlogPost[] }>;
      })
      .then((data) => {
        if (!data.ok || !data.posts) throw new Error("Request failed");
        setPosts(data.posts);
        setError(null);
      })
      .catch(() => {
        setError("Could not load blog posts. Please try again later.");
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

  function handleEdit(post: BlogPost) {
    setEditing(post);
    setSuccessMessage(null);
  }

  function handleSaved() {
    const wasEditing = editing !== null;
    setEditing(null);
    setSuccessMessage(wasEditing ? "Blog post updated." : "Blog post added.");
    load();
  }

  async function handleDelete(slug: string) {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      const response = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Request failed");
      if (editing?.slug === slug) setEditing(null);
      setSuccessMessage("Blog post deleted.");
      load();
    } catch {
      setError("Could not delete the blog post. Please try again.");
    }
  }

  return (
    <div>
      {error && (
        <div role="alert" className="mt-8 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {posts === null && !error && <p className="mt-8 text-muted">Loading blog posts...</p>}

      {posts !== null && posts.length === 0 && (
        <p className="mt-8 text-muted">No blog posts yet. Add your first one below.</p>
      )}

      {posts !== null && posts.length > 0 && (
        <div className="mt-8">
          {successMessage && (
            <p
              role="status"
              className="rounded-xl border border-blush bg-blush-pale px-4 py-3 text-sm text-blush-deep"
            >
              {successMessage}
            </p>
          )}
          <ul className="mt-4 divide-y divide-border border border-border rounded-sm bg-card">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="flex flex-wrap items-start justify-between gap-4 p-6"
              >
                <div className="min-w-0">
                  <h2 className="font-display text-xl">{post.title}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {new Date(`${post.date}T00:00:00`).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="text-xs uppercase tracking-widest text-blush-deep hover:underline"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleEdit(post)}
                    className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-blush-deep"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.slug)}
                    className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-red-600 dark:hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div ref={formRef} className="mt-8">
        <BlogAdminForm
          key={editing?.slug ?? "new"}
          initial={editing ?? undefined}
          onSaved={handleSaved}
          onCancel={editing ? () => setEditing(null) : undefined}
        />
      </div>
    </div>
  );
}
