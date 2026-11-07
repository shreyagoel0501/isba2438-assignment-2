import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";

const stats = [
  { value: "3+", label: "Years at Deloitte" },
  { value: "26+", label: "Pipelines built" },
  { value: "4.0", label: "Graduate GPA" },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <section className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-blush-deep">
            Business Analytics · Data Science · AI
          </p>
          <h1 className="mt-4 text-6xl sm:text-7xl">Shreya Goel</h1>
          <p className="mt-4 font-display text-2xl italic text-blush-deep">
            Turning messy data into decisions that stick.
          </p>
          <p className="mt-4 text-muted">
            Business Analytics grad student at Santa Clara University,
            previously at Deloitte. Always up for a coffee chat about data,
            careers, or the last thriller you watched.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="inline-block bg-blush px-8 py-4 text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-blush-deep hover:text-white"
            >
              View my work
            </Link>
            <Link
              href="/about-me"
              className="inline-block border border-foreground/20 px-8 py-4 text-sm uppercase tracking-widest text-foreground transition-colors hover:border-blush-deep hover:text-blush-deep"
            >
              More about me
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm shadow-[0_30px_60px_-20px_rgba(232,116,138,0.35)]">
            <Image
              src="/shreya.jpg"
              alt="Shreya Goel"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="mt-10 grid w-full grid-cols-3 gap-4 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl text-blush-deep">
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-24">
        <SectionHeading title="Featured projects" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <Link
          href="/projects"
          className="mt-8 inline-block text-blush-deep hover:underline"
        >
          See all projects →
        </Link>
      </section>
    </main>
  );
}
