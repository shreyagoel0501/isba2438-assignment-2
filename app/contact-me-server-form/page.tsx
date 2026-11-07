import ContactServerForm from "@/components/ContactServerForm";

export default function ContactMe() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Contact Me</h1>
      <p className="mt-6 leading-8 text-zinc-600 dark:text-zinc-400">
        Send me a message below or email me at{" "}
        <a
          href="mailto:sgoel@scu.edu"
          className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          sgoel@scu.edu
        </a>
      </p>
      <ContactServerForm />
    </main>
  );
}
