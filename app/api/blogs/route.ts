import { createBlog, readBlogs, validateBlog } from "@/lib/blogs";

type BlogBody = {
  title?: unknown;
  summary?: unknown;
  body?: unknown;
};

export async function GET() {
  try {
    const posts = await readBlogs();
    return Response.json({ ok: true, posts });
  } catch {
    return Response.json({ ok: false, error: "Could not load blog posts." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: BlogBody;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }
    body = parsed as BlogBody;
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = validateBlog(body);
  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  try {
    const post = await createBlog(result.data);
    return Response.json({ ok: true, post }, { status: 201 });
  } catch {
    return Response.json({ ok: false, error: "Could not save the blog post." }, { status: 500 });
  }
}
