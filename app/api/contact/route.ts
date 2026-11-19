import { deliverContact } from "@/lib/contact-delivery";
import { readSubmissions } from "@/lib/contact-store";
import { validateContact } from "@/lib/contact-validation";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

export async function GET() {
  console.log("[api] GET /api/contact");
  try {
    const submissions = await readSubmissions();
    submissions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    console.log("[api] GET /api/contact -> 200");
    return Response.json({ ok: true, submissions });
  } catch {
    console.log("[api] GET /api/contact -> 500");
    return Response.json({ ok: false, error: "Could not load contact messages." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }
    body = parsed as ContactBody;
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const { saved, emailed } = await deliverContact(result.data, "api");
  if (saved || emailed) {
    return Response.json({ ok: true, message: "Thanks! Your message was sent." }, { status: 201 });
  }
  return Response.json({ ok: false, error: "Could not save your message." }, { status: 500 });
}
