import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogBySlug, readBlogs } from "@/lib/blogs";

export async function generateStaticParams() {
  const posts = await readBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <nav className="font-mono text-xs uppercase tracking-widest text-muted">
        <Link href="/" className="hover:text-blush-deep">Home</Link>
        {" / "}
        <Link href="/blogs" className="hover:text-blush-deep">Blog</Link>
      </nav>
      <Suspense fallback={<p className="mt-8 text-muted">Loading post...</p>}>
        <PostContent slug={slug} />
      </Suspense>
      <Link
        href="/blogs"
        className="mt-12 inline-block border border-border px-6 py-3 text-sm uppercase tracking-widest transition-colors hover:border-blush-deep hover:text-blush-deep"
      >
        Back to all posts
      </Link>
    </main>
  );
}

async function PostContent({ slug }: { slug: string }) {
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <h1 className="mt-4 text-4xl sm:text-5xl">{post.title}</h1>
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-blush-deep">
        {new Date(`${post.date}T00:00:00`).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className="mt-3 font-display text-2xl italic text-blush-deep">
        {post.summary}
      </p>
      <div className="mt-8 space-y-6">
        {post.blocks.map((block, index) => {
          if (block.type === "paragraph") {
            return (
              <p key={index} className="text-lg leading-8">
                {block.text}
              </p>
            );
          }
          if (block.type === "image") {
            return (
              <Image
                key={index}
                src={block.src}
                alt={block.alt}
                width={1600}
                height={1200}
                className="h-auto w-full rounded"
              />
            );
          }
          return (
            <video
              key={index}
              src={block.src}
              controls
              playsInline
              preload="metadata"
              aria-label={block.alt}
              className="w-full rounded"
            />
          );
        })}
      </div>
    </article>
  );
}
