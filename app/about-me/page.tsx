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
        <h1 className="text-4xl sm:text-5xl">About me</h1>
        <div className="mt-6 space-y-4 text-lg leading-8 text-muted">
          <p>
            My journey with data started in grade 11, when I picked the science stream and took computer science. It
            was not love at first sight and I was honestly terrible at it. I took a long time to get the basics in my
            head. But I’m stubborn, so after grade 12 I signed up for more: an undergrad at Christ University in
            computer science, math and stats. That’s where it finally clicked.
          </p>
          <p>
            Then came Deloitte, where I was a Workday Financials analyst. I didn’t code much there, apart from Workday
            Studio, XSLT and connectors, but I realized that while I enjoy the technical side, I really love talking to
            clients about what the data found and what the insights mean. Business analytics sits right between the
            tech team and the business team, which is why I decided to do this program. Talking is one thing, but I
            also want to be the person who actually understands the data.
          </p>
          <p>
            In my free time I like to sing, crochet, and watch thrillers and murder mysteries, usually trying to solve
            the murder before the detective does. I love talking to people, and I’m convinced I’d make a great
            personality hire.
          </p>
        </div>
      </section>

      <section className="py-12">
        <SectionHeading title="Experience" />
        <div className="mt-8 space-y-6">
          {experience.map((role) => (
            <ExperienceCard key={role.title} role={role} />
          ))}
        </div>
      </section>

      <section className="py-12">
        <SectionHeading title="Education" />
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
        <SectionHeading title="Skills" />
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
        <SectionHeading title="Highlights" />
        <ul className="mt-8 space-y-3">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blush" />
              {highlight}
            </li>
          ))}
        </ul>
      </section>

    </main>
  );
}
