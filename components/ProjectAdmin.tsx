"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import ProjectForm from "@/components/ProjectForm";

export default function ProjectAdmin() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    fetch("/api/projects")
      .then((response) => {
        if (!response.ok) throw new Error("Request failed");
        return response.json() as Promise<{ ok: boolean; projects?: Project[] }>;
      })
      .then((data) => {
        if (!data.ok || !data.projects) throw new Error("Request failed");
        setProjects(data.projects);
        setError(null);
      })
      .catch(() => {
        setError("Could not load projects. Please try again later.");
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

  function handleEdit(project: Project) {
    setEditing(project);
    setSuccessMessage(null);
  }

  function handleSaved() {
    const wasEditing = editing !== null;
    setEditing(null);
    setSuccessMessage(
      wasEditing ? "Project updated." : "Project added.",
    );
    load();
  }

  async function handleDelete(slug: string) {
    if (!window.confirm("Delete this project?")) return;
    try {
      const response = await fetch(`/api/projects/${slug}`, { method: "DELETE" });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Request failed");
      if (editing?.slug === slug) setEditing(null);
      setSuccessMessage("Project deleted.");
      load();
    } catch {
      setError("Could not delete the project. Please try again.");
    }
  }

  return (
    <div>
      {error && (
        <div role="alert" className="mt-8 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {projects === null && !error && <p className="mt-8 text-muted">Loading projects...</p>}

      {projects !== null && projects.length === 0 && (
        <p className="mt-8 text-muted">No projects yet. Add your first one below.</p>
      )}

      {projects !== null && projects.length > 0 && (
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
            {projects.map((project) => (
              <li
                key={project.slug}
                className="flex flex-wrap items-start justify-between gap-4 p-6"
              >
                <div className="min-w-0">
                  <h2 className="font-display text-xl">{project.title}</h2>
                  <p className="mt-1 text-sm text-muted">{project.summary}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-xs uppercase tracking-widest text-blush-deep hover:underline"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-blush-deep"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project.slug)}
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
        <ProjectForm
          key={editing?.slug ?? "new"}
          initial={editing ?? undefined}
          onSaved={handleSaved}
          onCancel={editing ? () => setEditing(null) : undefined}
        />
      </div>
    </div>
  );
}
