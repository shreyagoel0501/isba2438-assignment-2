import type { Role } from "@/lib/experience";

export default function ExperienceCard({ role }: { role: Role }) {
  return (
    <div className="rounded-sm border border-border bg-card p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-display text-2xl">{role.title}</h3>
          <p className="mt-1 text-blush-deep">{role.company}</p>
          <p className="mt-1 font-mono text-xs tracking-widest text-muted">
            {role.location}
          </p>
        </div>
        <span className="self-start rounded-full bg-blush-pale px-3 py-1 font-mono text-xs text-blush-deep sm:shrink-0">
          {role.dates}
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {role.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blush" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}
