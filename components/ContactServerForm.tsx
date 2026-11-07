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
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={state.values?.name}
          className="mt-2 block w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-2.5 text-sm dark:border-zinc-700"
        />
        {state.errors?.name && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{state.errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state.values?.email}
          className="mt-2 block w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-2.5 text-sm dark:border-zinc-700"
        />
        {state.errors?.email && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{state.errors.email}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={state.values?.message}
          className="mt-2 block w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-2.5 text-sm dark:border-zinc-700"
        />
        {state.errors?.message && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{state.errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
