"use client";

import { useState } from "react";

type FieldErrors = { name?: string; email?: string; message?: string };

const emptyValues = { name: "", email: "", message: "" };

export default function ContactApiForm() {
  const [values, setValues] = useState(emptyValues);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
    setSuccessMessage(null);
    setErrorMessage(null);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
        }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        errors?: FieldErrors;
        error?: string;
      };

      if (response.status === 201 && data.ok) {
        setSuccessMessage(data.message ?? "Thanks! Your message was saved.");
        setValues(emptyValues);
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
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
      {successMessage && (
        <div role="status" className="rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block font-mono text-xs uppercase tracking-widest text-muted">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block font-mono text-xs uppercase tracking-widest text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block font-mono text-xs uppercase tracking-widest text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        {errors.message && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-blush px-8 py-4 text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-blush-deep hover:text-white disabled:opacity-50"
      >
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
