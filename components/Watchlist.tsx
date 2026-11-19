"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  clearWatchlist,
  loadWatchlist,
  saveWatchlist,
  type WatchlistItem,
  type WatchlistKind,
} from "@/lib/watchlist";

type Filter = "all" | "toWatch" | "watched";

type FormValues = { title: string; kind: string; year: string; note: string };

type FormErrors = { title?: string; kind?: string; year?: string };

const kindOptions: WatchlistKind[] = ["movie", "show", "book"];

const emptyForm: FormValues = { title: "", kind: "", year: "", note: "" };

const stars = [1, 2, 3, 4, 5];

type WatchlistCardProps = {
  item: WatchlistItem;
  onChange: (next: WatchlistItem) => void;
  onRemove: (id: string) => void;
};

function WatchlistCard({ item, onChange, onRemove }: WatchlistCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [noteDraft, setNoteDraft] = useState(item.note ?? "");
  const showPoster = Boolean(item.posterUrl) && !imageFailed;

  function toggleWatched(event: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...item, watched: event.target.checked });
  }

  function setRating(rating: number | undefined) {
    onChange({ ...item, rating });
  }

  function handleNoteBlur() {
    const note = noteDraft.trim();
    if (note === (item.note ?? "")) return;
    onChange({ ...item, note: note === "" ? undefined : note });
  }

  return (
    <article className="flex flex-col rounded-sm border border-border bg-card p-8 transition-colors hover:border-blush sm:flex-row sm:gap-6">
      <div className="relative aspect-[2/3] w-28 shrink-0 self-start overflow-hidden rounded-sm">
        {showPoster ? (
          <Image
            src={item.posterUrl as string}
            alt={`${item.title} poster`}
            fill
            sizes="112px"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-blush-pale">
            <span className="font-display text-4xl text-blush-deep">
              {item.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 min-w-0 flex-1 sm:mt-0">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl">{item.title}</h3>
          <div className="flex shrink-0 items-center gap-2">
            {item.year !== undefined && (
              <span className="font-mono text-xs text-muted">{item.year}</span>
            )}
            <span className="rounded-full bg-blush-pale px-3 py-1 font-mono text-xs text-blush-deep">
              {item.kind}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={item.watched}
              onChange={toggleWatched}
              className="h-4 w-4 accent-blush-deep"
            />
            Watched
          </label>

          <div className="flex items-center gap-1" role="group" aria-label={`Rate ${item.title}`}>
            {stars.map((star) => {
              const filled = item.rating !== undefined && item.rating >= star;
              return (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} out of 5`}
                  aria-pressed={item.rating === star}
                  onClick={() => setRating(item.rating === star ? undefined : star)}
                  className={`text-xl leading-none transition-colors ${
                    filled ? "text-blush-deep" : "text-blush-light hover:text-blush"
                  }`}
                >
                  ★
                </button>
              );
            })}
          </div>
        </div>

        <textarea
          rows={2}
          value={noteDraft}
          onChange={(event) => setNoteDraft(event.target.value)}
          onBlur={handleNoteBlur}
          placeholder="Add a note (saved when you click away)"
          className="mt-4 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
        />

        <div className="mt-4 flex gap-4">
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Watchlist() {
  const [loaded] = useState(() => loadWatchlist());
  const [items, setItems] = useState<WatchlistItem[]>(loaded.items);
  const [status, setStatus] = useState(loaded.status);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  function update(nextItems: WatchlistItem[]) {
    setItems(nextItems);
    if (saveWatchlist(nextItems)) {
      setSaveError(null);
      setStatus((current) => (current === "invalid" ? "ok" : current));
    } else {
      setSaveError("Could not save your watchlist. Browser storage may be full or blocked.");
    }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = form.title.trim();
    const kind = kindOptions.find((option) => option === form.kind);
    const errors: FormErrors = {};
    if (!title) errors.title = "Please enter a title.";
    if (!kind) errors.kind = "Please choose movie, show or book.";

    const yearText = form.year.trim();
    let year: number | undefined;
    if (yearText !== "") {
      const parsed = Number(yearText);
      if (!Number.isInteger(parsed) || parsed < 1900 || parsed > 2100) {
        errors.year = "Year must be a whole number between 1900 and 2100.";
      } else {
        year = parsed;
      }
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const note = form.note.trim();
    const item: WatchlistItem = {
      id: crypto.randomUUID(),
      title,
      kind: kind as WatchlistKind,
      year,
      watched: false,
      note: note === "" ? undefined : note,
      addedAt: new Date().toISOString(),
    };

    update([...items, item]);
    setForm(emptyForm);
  }

  function handleItemChange(next: WatchlistItem) {
    update(items.map((item) => (item.id === next.id ? next : item)));
  }

  function handleRemove(id: string) {
    update(items.filter((item) => item.id !== id));
  }

  function handleClear() {
    if (!window.confirm("Remove every item from your watchlist? This cannot be undone.")) return;
    clearWatchlist();
    setItems([]);
    setStatus("empty");
    setSaveError(null);
  }

  const toWatchCount = items.filter((item) => !item.watched).length;
  const watchedCount = items.filter((item) => item.watched).length;
  const visible = items.filter((item) =>
    filter === "all" ? true : filter === "watched" ? item.watched : !item.watched,
  );

  return (
    <div>
      {status === "invalid" && (
        <div
          role="alert"
          className="mt-8 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
        >
          Some saved watchlist data couldn&apos;t be read, so it was reset.
        </div>
      )}

      {saveError && (
        <div
          role="alert"
          className="mt-8 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
        >
          {saveError}
        </div>
      )}

      {items.length === 0 ? (
        <p className="mt-8 text-muted">
          Your watchlist is empty. Add something below or save picks from the{" "}
          <Link href="/recommendations" className="text-blush-deep underline underline-offset-4 hover:text-blush">
            thriller recs board
          </Link>
          .
        </p>
      ) : (
        <>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            {(
              [
                { key: "all", label: "All", count: items.length },
                { key: "toWatch", label: "To watch", count: toWatchCount },
                { key: "watched", label: "Watched", count: watchedCount },
              ] as const
            ).map(({ key, label, count }) => (
              <button
                key={key}
                type="button"
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
                className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                  filter === key
                    ? "border-blush-deep bg-blush-pale text-blush-deep"
                    : "border-border text-muted hover:border-blush hover:text-blush-deep"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-6">
            {visible.map((item) => (
              <WatchlistCard
                key={item.id}
                item={item}
                onChange={handleItemChange}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs uppercase tracking-widest text-muted transition-colors hover:text-red-600"
            >
              Clear watchlist
            </button>
          </div>
        </>
      )}

      <form
        onSubmit={handleAdd}
        noValidate
        className="mt-12 space-y-6 rounded-sm border border-border bg-card p-8"
      >
        <h2 className="font-display text-2xl">Add your own</h2>

        <div>
          <label
            htmlFor="watchlist-title"
            className="block font-mono text-xs uppercase tracking-widest text-muted"
          >
            Title
          </label>
          <input
            id="watchlist-title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
          />
          {formErrors.title && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.title}</p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="watchlist-kind"
              className="block font-mono text-xs uppercase tracking-widest text-muted"
            >
              Kind
            </label>
            <select
              id="watchlist-kind"
              name="kind"
              value={form.kind}
              onChange={handleChange}
              className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
            >
              <option value="">Choose one</option>
              <option value="movie">Movie</option>
              <option value="show">Show</option>
              <option value="book">Book</option>
            </select>
            {formErrors.kind && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.kind}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="watchlist-year"
              className="block font-mono text-xs uppercase tracking-widest text-muted"
            >
              Year <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="watchlist-year"
              name="year"
              type="number"
              min={1900}
              max={2100}
              step={1}
              value={form.year}
              onChange={handleChange}
              className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
            />
            {formErrors.year && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.year}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="watchlist-note"
            className="block font-mono text-xs uppercase tracking-widest text-muted"
          >
            Note <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <textarea
            id="watchlist-note"
            name="note"
            rows={3}
            value={form.note}
            onChange={handleChange}
            className="mt-2 block w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blush-deep focus:ring-2 focus:ring-blush/30"
          />
        </div>

        <button
          type="submit"
          className="bg-blush px-8 py-4 text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-blush-deep hover:text-white"
        >
          Add to watchlist
        </button>
      </form>
    </div>
  );
}
