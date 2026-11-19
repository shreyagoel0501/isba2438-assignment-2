import { createProject, readProjects, validateProject } from "@/lib/projects";

type ProjectBody = {
  title?: unknown;
  summary?: unknown;
  description?: unknown;
  tech?: unknown;
  githubUrl?: unknown;
};

export async function GET() {
  console.log("[api] GET /api/projects");
  try {
    const projects = await readProjects();
    console.log("[api] GET /api/projects -> 200");
    return Response.json({ ok: true, projects });
  } catch {
    console.log("[api] GET /api/projects -> 500");
    return Response.json({ ok: false, error: "Could not load projects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log("[api] POST /api/projects");
  let body: ProjectBody;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      console.log("[api] POST /api/projects -> 400");
      return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }
    body = parsed as ProjectBody;
  } catch {
    console.log("[api] POST /api/projects -> 400");
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = validateProject(body);
  if (!result.ok) {
    console.log("[api] POST /api/projects -> 400");
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  try {
    const project = await createProject(result.data);
    console.log("[api] POST /api/projects -> 201", project.slug);
    return Response.json({ ok: true, project }, { status: 201 });
  } catch {
    console.log("[api] POST /api/projects -> 500");
    return Response.json({ ok: false, error: "Could not save the project." }, { status: 500 });
  }
}
