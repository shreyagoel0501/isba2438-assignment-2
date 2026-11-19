import { deleteBlog, getBlogBySlug, updateBlog, validateBlog } from "@/lib/blogs";

type BlogBody = {
  title?: unknown;
  summary?: unknown;
  body?: unknown;
};

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  console.log("[api] GET /api/blogs/[slug]", slug);
  try {
    const post = await getBlogBySlug(slug);
    if (!post) {
      console.log("[api] GET /api/blogs/[slug] -> 404", slug);
      return Response.json({ ok: false, error: "Blog post not found." }, { status: 404 });
    }
    console.log("[api] GET /api/blogs/[slug] -> 200", slug);
    return Response.json({ ok: true, post });
  } catch {
    console.log("[api] GET /api/blogs/[slug] -> 500", slug);
    return Response.json({ ok: false, error: "Could not load the blog post." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  console.log("[api] PUT /api/blogs/[slug]", slug);

  let body: BlogBody;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      console.log("[api] PUT /api/blogs/[slug] -> 400", slug);
      return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }
    body = parsed as BlogBody;
  } catch {
    console.log("[api] PUT /api/blogs/[slug] -> 400", slug);
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = validateBlog(body);
  if (!result.ok) {
    console.log("[api] PUT /api/blogs/[slug] -> 400", slug);
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  try {
    const post = await updateBlog(slug, result.data);
    if (!post) {
      console.log("[api] PUT /api/blogs/[slug] -> 404", slug);
      return Response.json({ ok: false, error: "Blog post not found." }, { status: 404 });
    }
    console.log("[api] PUT /api/blogs/[slug] -> 200", slug);
    return Response.json({ ok: true, post });
  } catch {
    console.log("[api] PUT /api/blogs/[slug] -> 500", slug);
    return Response.json({ ok: false, error: "Could not update the blog post." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  console.log("[api] DELETE /api/blogs/[slug]", slug);
  try {
    const deleted = await deleteBlog(slug);
    if (!deleted) {
      console.log("[api] DELETE /api/blogs/[slug] -> 404", slug);
      return Response.json({ ok: false, error: "Blog post not found." }, { status: 404 });
    }
    console.log("[api] DELETE /api/blogs/[slug] -> 200", slug);
    return Response.json({ ok: true });
  } catch {
    console.log("[api] DELETE /api/blogs/[slug] -> 500", slug);
    return Response.json({ ok: false, error: "Could not delete the blog post." }, { status: 500 });
  }
}
