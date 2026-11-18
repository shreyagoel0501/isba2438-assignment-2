import RecommendationsBoard from "@/components/RecommendationsBoard";

export default function Recommendations() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="text-4xl sm:text-5xl">Thriller recs</h1>
      <p className="mt-2 text-muted">
        I&apos;m always looking for my next thriller. Recommend one, or browse what others have
        suggested.
      </p>
      <RecommendationsBoard />
    </main>
  );
}
