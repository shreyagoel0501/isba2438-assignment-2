import { saveSubmission } from "@/lib/contact-store";
import { validateContact } from "@/lib/contact-validation";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  try {
    await saveSubmission(result.data, "api");
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ ok: false, error: "Could not save your message." }, { status: 500 });
  }
}
