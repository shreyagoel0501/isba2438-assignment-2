import {
  deleteSubmission,
  getSubmission,
  updateSubmission,
} from "@/lib/contact-store";
import { validateContact } from "@/lib/contact-validation";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  console.log("[api] GET /api/contact/[id]", id);
  try {
    const submission = await getSubmission(id);
    if (!submission) {
      console.log("[api] GET /api/contact/[id] -> 404", id);
      return Response.json({ ok: false, error: "Message not found." }, { status: 404 });
    }
    console.log("[api] GET /api/contact/[id] -> 200", id);
    return Response.json({ ok: true, submission });
  } catch {
    console.log("[api] GET /api/contact/[id] -> 500", id);
    return Response.json({ ok: false, error: "Could not load the message." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  console.log("[api] PUT /api/contact/[id]", id);

  let body: ContactBody;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      console.log("[api] PUT /api/contact/[id] -> 400", id);
      return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }
    body = parsed as ContactBody;
  } catch {
    console.log("[api] PUT /api/contact/[id] -> 400", id);
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = validateContact(body);
  if (!result.ok) {
    console.log("[api] PUT /api/contact/[id] -> 400", id);
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  try {
    const submission = await updateSubmission(id, result.data);
    if (!submission) {
      console.log("[api] PUT /api/contact/[id] -> 404", id);
      return Response.json({ ok: false, error: "Message not found." }, { status: 404 });
    }
    console.log("[api] PUT /api/contact/[id] -> 200", id);
    return Response.json({ ok: true, submission });
  } catch {
    console.log("[api] PUT /api/contact/[id] -> 500", id);
    return Response.json({ ok: false, error: "Could not update the message." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  console.log("[api] DELETE /api/contact/[id]", id);
  try {
    const deleted = await deleteSubmission(id);
    if (!deleted) {
      console.log("[api] DELETE /api/contact/[id] -> 404", id);
      return Response.json({ ok: false, error: "Message not found." }, { status: 404 });
    }
    console.log("[api] DELETE /api/contact/[id] -> 200", id);
    return Response.json({ ok: true });
  } catch {
    console.log("[api] DELETE /api/contact/[id] -> 500", id);
    return Response.json({ ok: false, error: "Could not delete the message." }, { status: 500 });
  }
}
