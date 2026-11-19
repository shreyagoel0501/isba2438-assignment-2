import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { parseBody, blocksToBody } from "./blog-body";
import type { BlogBlock } from "./blog-body";

export type { BlogBlock };
export { parseBody, blocksToBody };

export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  updatedAt?: string;
  blocks: BlogBlock[];
};

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "blogs.json");

export async function readBlogs(): Promise<BlogPost[]> {
  try {
    const posts = JSON.parse(await readFile(filePath, "utf8")) as BlogPost[];
    return posts.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await readBlogs();
  return posts.find((post) => post.slug === slug);
}

export function validateBlog(input: {
  title?: unknown;
  summary?: unknown;
  body?: unknown;
}): { ok: true; data: { title: string; summary: string; body: string } } | { ok: false; errors: { title?: string; summary?: string; body?: string } } {
  const errors: { title?: string; summary?: string; body?: string } = {};

  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (!title) errors.title = "Please enter a title.";

  const summary = typeof input.summary === "string" ? input.summary.trim() : "";
  if (!summary) errors.summary = "Please enter a summary.";

  const body = typeof input.body === "string" ? input.body.trim() : "";
  if (!body) errors.body = "Please write something.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { title, summary, body } };
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createBlog(data: { title: string; summary: string; body: string }): Promise<BlogPost> {
  await mkdir(dataDir, { recursive: true });
  const posts = await readBlogs();

  const base = slugify(data.title) || "post";
  let slug = base;
  let counter = 2;
  while (posts.some((post) => post.slug === slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }

  const post: BlogPost = {
    slug,
    title: data.title,
    summary: data.summary,
    date: new Date().toISOString().slice(0, 10),
    blocks: parseBody(data.body),
  };

  posts.push(post);
  await writeFile(filePath, JSON.stringify(posts, null, 2), "utf8");
  return post;
}

export async function updateBlog(
  slug: string,
  data: { title: string; summary: string; body: string },
): Promise<BlogPost | null> {
  await mkdir(dataDir, { recursive: true });
  const posts = await readBlogs();
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) return null;

  post.title = data.title;
  post.summary = data.summary;
  post.blocks = parseBody(data.body);
  post.updatedAt = new Date().toISOString().slice(0, 10);

  await writeFile(filePath, JSON.stringify(posts, null, 2), "utf8");
  return post;
}

export async function deleteBlog(slug: string): Promise<boolean> {
  await mkdir(dataDir, { recursive: true });
  const posts = await readBlogs();
  const next = posts.filter((post) => post.slug !== slug);
  if (next.length === posts.length) return false;

  await writeFile(filePath, JSON.stringify(next, null, 2), "utf8");
  return true;
}
