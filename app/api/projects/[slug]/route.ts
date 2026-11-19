import {
  deleteProject,
  getProjectBySlug,
  updateProject,
  validateProject,
} from "@/lib/projects";

type ProjectBody = {
  title?: unknown;
  summary?: unknown;
  description?: unknown;
  tech?: unknown;
  githubUrl?: unknown;
};

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  console.log("[api] GET /api/projects/[slug]", slug);
  try {
    const project = await getProjectBySlug(slug);
    if (!project) {
      console.log("[api] GET /api/projects/[slug] -> 404", slug);
      return Response.json({ ok: false, error: "Project not found." }, { status: 404 });
    }
    console.log("[api] GET /api/projects/[slug] -> 200", slug);
    return Response.json({ ok: true, project });
  } catch {
    console.log("[api] GET /api/projects/[slug] -> 500", slug);
    return Response.json({ ok: false, error: "Could not load the project." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { slug } = await params;
  console.log("[api] PUT /api/projects/[slug]", slug);

  let body: ProjectBody;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      console.log("[api] PUT /api/projects/[slug] -> 400", slug);
      return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }
    body = parsed as ProjectBody;
  } catch {
    console.log("[api] PUT /api/projects/[slug] -> 400", slug);
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = validateProject(body);
  if (!result.ok) {
    console.log("[api] PUT /api/projects/[slug] -> 400", slug);
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  try {
    const project = await updateProject(slug, result.data);
    if (!project) {
      console.log("[api] PUT /api/projects/[slug] -> 404", slug);
      return Response.json({ ok: false, error: "Project not found." }, { status: 404 });
    }
    console.log("[api] PUT /api/projects/[slug] -> 200", slug);
    return Response.json({ ok: true, project });
  } catch {
    console.log("[api] PUT /api/projects/[slug] -> 500", slug);
    return Response.json({ ok: false, error: "Could not update the project." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  console.log("[api] DELETE /api/projects/[slug]", slug);
  try {
    const deleted = await deleteProject(slug);
    if (!deleted) {
      console.log("[api] DELETE /api/projects/[slug] -> 404", slug);
      return Response.json({ ok: false, error: "Project not found." }, { status: 404 });
    }
    console.log("[api] DELETE /api/projects/[slug] -> 200", slug);
    return Response.json({ ok: true });
  } catch {
    console.log("[api] DELETE /api/projects/[slug] -> 500", slug);
    return Response.json({ ok: false, error: "Could not delete the project." }, { status: 500 });
  }
}
