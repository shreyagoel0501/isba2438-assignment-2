import { createRecommendation, readRecommendations, validateRecommendation } from "@/lib/recommendations";

type RecommendationBody = {
  title?: unknown;
  kind?: unknown;
  why?: unknown;
  recommendedBy?: unknown;
};

export async function GET() {
  console.log("[api] GET /api/recommendations");
  try {
    const recommendations = await readRecommendations();
    console.log("[api] GET /api/recommendations -> 200");
    return Response.json({ ok: true, recommendations });
  } catch {
    console.log("[api] GET /api/recommendations -> 500");
    return Response.json({ ok: false, error: "Could not load recommendations." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log("[api] POST /api/recommendations");
  let body: RecommendationBody;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      console.log("[api] POST /api/recommendations -> 400");
      return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }
    body = parsed as RecommendationBody;
  } catch {
    console.log("[api] POST /api/recommendations -> 400");
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = validateRecommendation(body);
  if (!result.ok) {
    console.log("[api] POST /api/recommendations -> 400");
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  try {
    const recommendation = await createRecommendation(result.data);
    console.log("[api] POST /api/recommendations -> 201", recommendation.id);
    return Response.json({ ok: true, recommendation }, { status: 201 });
  } catch {
    console.log("[api] POST /api/recommendations -> 500");
    return Response.json({ ok: false, error: "Could not save the recommendation." }, { status: 500 });
  }
}
