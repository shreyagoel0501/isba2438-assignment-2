import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-4xl sm:text-5xl">Project not found</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Sorry, that project doesn&apos;t exist.
      </p>
      <Link
        href="/projects"
        className="mt-10 inline-block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to projects
      </Link>
    </main>
  );
}
