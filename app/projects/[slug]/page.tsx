import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <nav className="font-mono text-xs uppercase tracking-widest text-muted">
        <Link href="/" className="hover:text-blush-deep">Home</Link>
        {" / "}
        <Link href="/projects" className="hover:text-blush-deep">Projects</Link>
        {" / "}
        <span>{project.title}</span>
      </nav>
      <h1 className="mt-4 text-4xl sm:text-5xl">{project.title}</h1>
      <p className="mt-3 font-display text-2xl italic text-blush-deep">
        {project.summary}
      </p>
      <p className="mt-6 text-lg leading-8">{project.description}</p>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-blush-deep">
        Built with
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tech.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-blush-pale px-3 py-1 font-mono text-xs text-blush-deep"
          >
            {tag}
          </span>
        ))}
      </div>
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block border border-border px-6 py-3 text-sm uppercase tracking-widest transition-colors hover:border-blush-deep hover:text-blush-deep"
        >
          View on GitHub
        </a>
      )}
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <Link
          href={`/projects/${previous.slug}`}
          className="border border-border bg-card p-6 transition-colors hover:border-blush"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-blush-deep">
            Previous
          </p>
          <p className="mt-2 font-display text-xl">← {previous.title}</p>
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="border border-border bg-card p-6 text-right transition-colors hover:border-blush"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-blush-deep">
            Next
          </p>
          <p className="mt-2 font-display text-xl">{next.title} →</p>
        </Link>
      </div>
    </main>
  );
}
