import Link from "next/link";
import type { BlogPost } from "@/lib/blogs";

export default function BlogCard({ post }: { post: BlogPost }) {
  const formattedDate = new Date(`${post.date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="block rounded-sm border border-border bg-card p-8 transition-all duration-200 hover:-translate-y-1 hover:border-blush"
    >
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-blush-deep">
        {formattedDate}
      </p>
      <h2 className="mt-2 font-display text-2xl">{post.title}</h2>
      <p className="mt-2 text-muted">{post.summary}</p>
    </Link>
  );
}
