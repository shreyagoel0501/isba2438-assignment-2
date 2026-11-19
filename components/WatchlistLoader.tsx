"use client";

import dynamic from "next/dynamic";

const Watchlist = dynamic(() => import("@/components/Watchlist"), {
  ssr: false,
  loading: () => <p className="mt-8 text-muted">Loading your watchlist...</p>,
});

export default function WatchlistLoader() {
  return <Watchlist />;
}
