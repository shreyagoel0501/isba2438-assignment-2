"use client";

import { useCallback, useEffect, useState } from "react";
import type { Submission } from "@/lib/contact-store";
import SubmissionCard from "@/components/SubmissionCard";

type FieldErrors = { name?: string; email?: string; message?: string };

const emptyEditValues = { name: "", email: "", message: "" };

export default function ContactAdmin() {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState(emptyEditValues);
  const [editErrors, setEditErrors] = useState<FieldErrors>({});
  const [editError, setEditError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const load = useCallback(() => {
    fetch("/api/contact")
      .then((response) => {
        if (!response.ok) throw new Error("Request failed");
        return response.json() as Promise<{ ok: boolean; submissions?: Submission[] }>;
      })
      .then((data) => {
        if (!data.ok || !data.submissions) throw new Error("Request failed");
        setSubmissions(data.submissions);
        setError(null);
      })
      .catch(() => {
        setError("Could not load messages. Please try again later.");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleEdit(submission: Submission) {
    setEditingId(submission.id);
    setEditValues({
      name: submission.name,
      email: submission.email,
      message: submission.message,
    });
    setEditErrors({});
    setEditError(null);
    setSuccessMessage(null);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditValues(emptyEditValues);
    setEditErrors({});
    setEditError(null);
  }

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) return;
    setPending(true);
    setEditError(null);
    setEditErrors({});

    try {
      const response = await fetch(`/api/contact/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      });
      const data = (await response.json()) as {
        ok: boolean;
        errors?: FieldErrors;
        error?: string;
      };

      if (response.ok && data.ok) {
        setEditingId(null);
        setEditValues(emptyEditValues);
        setSuccessMessage("Message updated.");
        load();
      } else if (data.errors) {
        setEditErrors(data.errors);
      } else {
        setEditError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setEditError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this message?")) return;
    try {
      const response = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error ?? "Request failed");
      if (editingId === id) handleCancelEdit();
      setSuccessMessage("Message deleted.");
      load();
    } catch {
      setError("Could not delete the message. Please try again.");
    }
  }

  return (
    <div>
      {error && (
        <div role="alert" className="mt-8 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {submissions === null && !error && <p className="mt-8 text-muted">Loading messages...</p>}

      {submissions !== null && submissions.length === 0 && (
        <p className="mt-8 text-muted">No messages yet.</p>
      )}

      {submissions !== null && submissions.length > 0 && (
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
            {submissions.map((submission) => (
              <li key={submission.id} className="divide-y divide-border">
                <SubmissionCard
                  submission={submission}
                  onEdit={() => handleEdit(submission)}
                  onDelete={() => handleDelete(submission.id)}
                />
                {editingId === submission.id && (
                  <form onSubmit={handleUpdate} noValidate className="space-y-6 bg-blush-pale p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h3 className="font-display text-lg">Editing message</h3>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={pending}
                        className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-blush-deep disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>

                    {editError && (
                      <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                        {editError}
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor={`name-${submission.id}`}
                        className="block font-mono text-xs uppercase tracking-widest text-muted"
                      >
                        Name
                      </label>
                      <input
                        id={`name-${submission.id}`}
                        name="name"
                        type="text"
                        value={editValues.name}
                        onChange={handleEditChange}
                        className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
                      />
                      {editErrors.name && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{editErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`email-${submission.id}`}
                        className="block font-mono text-xs uppercase tracking-widest text-muted"
                      >
                        Email
                      </label>
                      <input
                        id={`email-${submission.id}`}
                        name="email"
                        type="email"
                        value={editValues.email}
                        onChange={handleEditChange}
                        className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
                      />
                      {editErrors.email && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{editErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`message-${submission.id}`}
                        className="block font-mono text-xs uppercase tracking-widest text-muted"
                      >
                        Message
                      </label>
                      <textarea
                        id={`message-${submission.id}`}
                        name="message"
                        rows={5}
                        value={editValues.message}
                        onChange={handleEditChange}
                        className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
                      />
                      {editErrors.message && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{editErrors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={pending}
                      className="bg-blush px-8 py-4 text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-blush-deep hover:text-white disabled:opacity-50"
                    >
                      {pending ? "Saving..." : "Save changes"}
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
