import { deliverContact } from "@/lib/contact-delivery";
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

  const { saved, emailed } = await deliverContact(result.data, "api");
  if (saved || emailed) {
    return Response.json({ ok: true, message: "Thanks! Your message was sent." }, { status: 201 });
  }
  return Response.json({ ok: false, error: "Could not save your message." }, { status: 500 });
}
