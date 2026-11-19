import ProjectAdmin from "@/components/ProjectAdmin";

export default function ManageProjects() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="text-4xl sm:text-5xl">Manage projects</h1>
      <p className="mt-2 text-muted">
        Projects are saved to data/projects.json and served through the API.
      </p>
      <ProjectAdmin />
    </main>
  );
}
