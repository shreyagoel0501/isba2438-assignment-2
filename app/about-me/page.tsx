import SectionHeading from "@/components/SectionHeading";
import ExperienceCard from "@/components/ExperienceCard";
import { experience, education } from "@/lib/experience";

const skills = [
  "Python",
  "SQL",
  "R",
  "Machine learning (scikit-learn, XGBoost)",
  "LLM pipelines and RAG",
  "Tableau and Power BI",
  "Statistical testing",
  "Git",
];

const highlights = [
  "1st Place, SCU AI Club Project Showcase (2026)",
  "2nd Place, Fall 2025 Analytics Showdown",
  "Teaching Assistant, Math for Business and Analytics with R",
  "Workday Financials Certified Technical Specialist (2022)",
];

export default function AboutMe() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <section className="py-12">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-blush-deep">
          My story
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl">About me</h1>
        <p className="mt-6 leading-8 text-muted">
          I’m an MS in Business Analytics student at Santa Clara University’s Leavey School of Business, graduating in
          December 2026 with a 4.0 GPA. Before SCU, I spent three years at Deloitte as a Workday Financials Technical
          Analyst, building data integrations and reports for healthcare and public-sector clients. Now I focus on
          statistics, machine learning, and LLM-powered tools, most recently as a Marketing Analytics Intern at Aquila
          Clouds and on an AI meeting-effectiveness practicum with Microsoft. I enjoy turning messy data into clear,
          practical recommendations.
        </p>
      </section>

      <section className="py-12">
        <SectionHeading label="Where I’ve worked" title="Experience" />
        <div className="mt-8 space-y-6">
          {experience.map((role) => (
            <ExperienceCard key={role.title} role={role} />
          ))}
        </div>
      </section>

      <section className="py-12">
        <SectionHeading label="Where I’ve studied" title="Education" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {education.map((edu) => (
            <div key={edu.school} className="rounded-sm border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-xl">{edu.school}</h3>
                <span className="shrink-0 rounded-full bg-blush-pale px-3 py-1 font-mono text-xs text-blush-deep">
                  {edu.dates}
                </span>
              </div>
              <p className="mt-2">{edu.degree}</p>
              {edu.details && (
                <p className="mt-1 font-mono text-xs tracking-widest text-muted">
                  {edu.details}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <SectionHeading label="What I work with" title="Skills" />
        <ul className="mt-8 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full bg-blush-pale px-3 py-1 font-mono text-xs text-blush-deep"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className="py-12">
        <SectionHeading label="Recognition" title="Highlights" />
        <ul className="mt-8 space-y-3">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blush" />
              {highlight}
            </li>
          ))}
        </ul>
      </section>

      <section className="py-12">
        <SectionHeading label="Beyond the data" title="A little about me" />
        <p className="mt-6 leading-8 text-muted">
          Outside of data, I sing, crochet, and never say no to a good thriller or murder mystery. I love talking to
          people, and I’m pretty sure I’d make a great personality hire.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {[
            "Singing",
            "Crochet",
            "Thrillers & murder mysteries",
            "Talking to people",
          ].map((chip) => (
            <li
              key={chip}
              className="rounded-full bg-blush-pale px-3 py-1 font-mono text-xs text-blush-deep"
            >
              {chip}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
