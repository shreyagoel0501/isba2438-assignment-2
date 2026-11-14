import { sendContactEmail } from "./contact-email";
import type { ContactInput } from "./contact-validation";
import { saveSubmission } from "./contact-store";

export async function deliverContact(
  data: ContactInput,
  source: "server-form" | "api",
): Promise<{ saved: boolean; emailed: boolean }> {
  let saved = false;
  try {
    await saveSubmission(data, source);
    saved = true;
  } catch (error) {
    console.error("Failed to save submission:", error);
  }

  const emailed = await sendContactEmail(data);

  return { saved, emailed };
}
