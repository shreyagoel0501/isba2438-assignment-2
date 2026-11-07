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
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-blush-deep">Home</Link>
        {" / "}
        <Link href="/projects" className="hover:text-blush-deep">Projects</Link>
        {" / "}
        <span>{project.title}</span>
      </nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{project.title}</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {project.summary}
      </p>
      <p className="mt-6">{project.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.tech.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
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
          className="mt-4 block text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          View on GitHub
        </a>
      )}
      <div className="mt-10 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
        <Link
          href={`/projects/${previous.slug}`}
          className="hover:text-blush-deep"
        >
          ← {previous.title}
        </Link>
        <Link href={`/projects/${next.slug}`} className="hover:text-blush-deep">
          {next.title} →
        </Link>
      </div>
    </main>
  );
}
