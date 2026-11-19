import ContactAdmin from "@/components/ContactAdmin";

export default function ManageContacts() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="text-4xl sm:text-5xl">Contact messages</h1>
      <p className="mt-2 text-muted">
        Messages are saved to data/contact-submissions.json and served through the API.
      </p>
      <ContactAdmin />
    </main>
  );
}
