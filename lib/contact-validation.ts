export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

function isValidEmail(email: string): boolean {
  if (typeof email !== "string" || /\s/.test(email)) return false;
  if ((email.match(/@/g) ?? []).length !== 1) return false;
  const [local, domain] = email.split("@");
  if (!local) return false;
  const parts = domain.split(".");
  if (parts.length < 2) return false;
  return parts.every((part) => part.length > 0);
}

export function validateContact(input: {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}): { ok: true; data: ContactInput } | { ok: false; errors: { name?: string; email?: string; message?: string } } {
  const errors: { name?: string; email?: string; message?: string } = {};

  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name) errors.name = "Please enter your name.";

  const email = typeof input.email === "string" ? input.email : "";
  if (!email) errors.email = "Please enter your email address.";
  else if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";

  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (!message) errors.message = "Please enter a message.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, message } };
}
