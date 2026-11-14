"use server";

import { deliverContact } from "@/lib/contact-delivery";
import { validateContact } from "@/lib/contact-validation";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: { name?: string; email?: string; message?: string };
  values?: { name: string; email: string; message: string };
};

export async function submitContact(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const result = validateContact(values);
  if (!result.ok) {
    return { status: "error", errors: result.errors, values };
  }

  const { saved, emailed } = await deliverContact(result.data, "server-form");
  if (saved || emailed) {
    return { status: "success", message: "Thanks! Your message was sent." };
  }
  return {
    status: "error",
    message: "Could not save your message. Please try again.",
    values,
  };
}
