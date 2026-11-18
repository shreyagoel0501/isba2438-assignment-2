import {
  deleteRecommendation,
  getRecommendation,
  updateRecommendation,
  validateRecommendation,
} from "@/lib/recommendations";

type RecommendationBody = {
  title?: unknown;
  kind?: unknown;
  why?: unknown;
  recommendedBy?: unknown;
};

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  console.log("[api] GET /api/recommendations/[id]", id);
  try {
    const recommendation = await getRecommendation(id);
    if (!recommendation) {
      console.log("[api] GET /api/recommendations/[id] -> 404", id);
      return Response.json({ ok: false, error: "Recommendation not found." }, { status: 404 });
    }
    console.log("[api] GET /api/recommendations/[id] -> 200", id);
    return Response.json({ ok: true, recommendation });
  } catch {
    console.log("[api] GET /api/recommendations/[id] -> 500", id);
    return Response.json({ ok: false, error: "Could not load the recommendation." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  console.log("[api] PUT /api/recommendations/[id]", id);

  let body: RecommendationBody;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      console.log("[api] PUT /api/recommendations/[id] -> 400", id);
      return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }
    body = parsed as RecommendationBody;
  } catch {
    console.log("[api] PUT /api/recommendations/[id] -> 400", id);
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = validateRecommendation(body);
  if (!result.ok) {
    console.log("[api] PUT /api/recommendations/[id] -> 400", id);
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  try {
    const recommendation = await updateRecommendation(id, result.data);
    if (!recommendation) {
      console.log("[api] PUT /api/recommendations/[id] -> 404", id);
      return Response.json({ ok: false, error: "Recommendation not found." }, { status: 404 });
    }
    console.log("[api] PUT /api/recommendations/[id] -> 200", id);
    return Response.json({ ok: true, recommendation });
  } catch {
    console.log("[api] PUT /api/recommendations/[id] -> 500", id);
    return Response.json({ ok: false, error: "Could not update the recommendation." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  console.log("[api] DELETE /api/recommendations/[id]", id);
  try {
    const deleted = await deleteRecommendation(id);
    if (!deleted) {
      console.log("[api] DELETE /api/recommendations/[id] -> 404", id);
      return Response.json({ ok: false, error: "Recommendation not found." }, { status: 404 });
    }
    console.log("[api] DELETE /api/recommendations/[id] -> 200", id);
    return Response.json({ ok: true });
  } catch {
    console.log("[api] DELETE /api/recommendations/[id] -> 500", id);
    return Response.json({ ok: false, error: "Could not delete the recommendation." }, { status: 500 });
  }
}
