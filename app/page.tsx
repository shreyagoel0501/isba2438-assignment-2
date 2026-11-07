import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-4xl sm:text-5xl">Shreya Goel</h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
        Business Analytics graduate student turning data into decisions with machine learning and AI
      </p>
      <p className="mt-6 max-w-xl text-zinc-600 dark:text-zinc-400">
        I build ML models, LLM-powered tools, and analytics that turn messy data into clear, practical recommendations.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/projects"
          className="rounded-full bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          View my projects
        </Link>
        <Link
          href="/contact-me-server-form"
          className="rounded-full border border-zinc-300 px-6 py-3 font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Contact me
        </Link>
      </div>
    </main>
  );
}
