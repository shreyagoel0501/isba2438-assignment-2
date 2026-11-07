import Link from "next/link";
import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block rounded-sm border border-border bg-card p-8 transition-all duration-200 hover:-translate-y-1 hover:border-blush"
    >
      <h2 className="font-display text-2xl">{project.title}</h2>
      <p className="mt-2 text-muted">{project.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-blush-pale px-3 py-1 font-mono text-xs text-blush-deep"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
