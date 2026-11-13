import Link from "next/link";

export default function BlogNotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-blush-deep">
        404
      </p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Post not found</h1>
      <p className="mt-2 text-muted">
        Sorry, that post doesn&apos;t exist.
      </p>
      <Link
        href="/blogs"
        className="mt-10 inline-block bg-blush px-8 py-4 text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-blush-deep hover:text-white"
      >
        See all posts
      </Link>
    </main>
  );
}
