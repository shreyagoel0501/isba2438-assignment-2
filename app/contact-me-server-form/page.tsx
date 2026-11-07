import Image from "next/image";
import ContactServerForm from "@/components/ContactServerForm";

export default function ContactMe() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-2 md:items-start">
        <div>
          <Image
            src="/headshot.jpg"
            alt="Shreya Goel"
            width={960}
            height={1200}
            className="aspect-4/5 w-full rounded-sm object-cover object-[58%_30%] shadow-[0_30px_60px_-20px_rgba(232,116,138,0.35)]"
          />
          <p className="mt-4 text-sm text-muted">
            Prefer email? Reach me at{" "}
            <a href="mailto:sgoel@scu.edu" className="text-blush-deep underline underline-offset-4">
              sgoel@scu.edu
            </a>
          </p>
        </div>
        <div>
          <h1 className="text-4xl font-display sm:text-5xl">Contact Me</h1>
          <p className="mt-6 leading-8 text-muted">
            Have a question, an opportunity, or a thriller recommendation? Send me a message.
          </p>
          <ContactServerForm />
        </div>
      </div>
    </main>
  );
}
