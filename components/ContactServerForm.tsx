"use client";

import { useActionState } from "react";
import { submitContact, type ContactFormState } from "@/app/contact-me-server-form/actions";

const initialState: ContactFormState = { status: "idle" };

export default function ContactServerForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  return (
    <form action={formAction} noValidate className="mt-8 space-y-6">
      {state.status === "success" && state.message && (
        <div role="status" className="rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
          {state.message}
        </div>
      )}
      {state.status === "error" && state.message && (
        <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {state.message}
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
          defaultValue={state.values?.name}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        {state.errors?.name && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{state.errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block font-mono text-xs uppercase tracking-widest text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state.values?.email}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        {state.errors?.email && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{state.errors.email}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block font-mono text-xs uppercase tracking-widest text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={state.values?.message}
          className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />
        {state.errors?.message && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{state.errors.message}</p>}
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
