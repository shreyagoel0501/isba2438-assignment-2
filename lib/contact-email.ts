import { Resend } from "resend";
import type { ContactInput } from "./contact-validation";

const FROM = "Portfolio <onboarding@resend.dev>";
const TO = "goelshreya0501@gmail.com";

export async function sendContactEmail(data: ContactInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: data.email,
      subject: `New portfolio message from ${data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
    });

    if (error) {
      console.error("Resend email failed:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Resend email failed:", error);
    return false;
  }
}
