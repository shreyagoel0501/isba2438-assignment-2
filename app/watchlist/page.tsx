import WatchlistLoader from "@/components/WatchlistLoader";

export const metadata = {
  title: "My watchlist",
};

export default function WatchlistPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="text-4xl sm:text-5xl">My watchlist</h1>
      <p className="mt-2 text-muted">Saved only in this browser, so it&apos;s private to you.</p>
      <WatchlistLoader />
    </main>
  );
}
