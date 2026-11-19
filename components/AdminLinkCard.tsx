import Link from "next/link";

export default function AdminLinkCard({
  title,
  description,
  href,
  count,
}: {
  title: string;
  description: string;
  href: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className="block rounded-sm border border-border bg-card p-8 transition-all duration-200 hover:-translate-y-1 hover:border-blush"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl">{title}</h2>
        {typeof count === "number" && (
          <span className="rounded-full bg-blush-pale px-3 py-1 font-mono text-xs text-blush-deep">
            {count} {count === 1 ? "item" : "items"}
          </span>
        )}
      </div>
      <p className="mt-2 text-muted">{description}</p>
    </Link>
  );
}
