import { Suspense } from "react";
import { readProjects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";

export default function Projects() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="text-4xl sm:text-5xl">My Projects</h1>
      <p className="mt-2 text-muted">
        A mix of machine learning, analytics and AI projects from school and
        work.
      </p>
      <Suspense fallback={<p className="mt-8 text-muted">Loading projects...</p>}>
        <ProjectsGrid />
      </Suspense>
    </main>
  );
}

async function ProjectsGrid() {
  const projects = await readProjects();

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
