"use client";

import { useEffect, useState } from "react";
import type { BlogPost } from "@/lib/blogs";
import BlogCard from "@/components/BlogCard";

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/blogs")
      .then((response) => {
        if (!response.ok) throw new Error("Request failed");
        return response.json() as Promise<{ ok: boolean; posts?: BlogPost[] }>;
      })
      .then((data) => {
        if (!data.ok || !data.posts) throw new Error("Request failed");
        setPosts(data.posts);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  if (error) {
    return (
      <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        Could not load blog posts. Please try again later.
      </div>
    );
  }

  if (posts === null) {
    return <p className="text-muted">Loading posts...</p>;
  }

  if (posts.length === 0) {
    return <p className="text-muted">No posts yet.</p>;
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
