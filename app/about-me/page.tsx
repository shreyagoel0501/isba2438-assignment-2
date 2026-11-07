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
];

export default function AboutMe() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">About me</h1>
      <p className="mt-6 leading-8 text-zinc-600 dark:text-zinc-400">
        I’m an MS in Business Analytics student at Santa Clara University’s Leavey School of Business, graduating in
        December 2026 with a 4.0 GPA. Before SCU, I spent three years at Deloitte as a Workday Financials Technical
        Analyst, building data integrations and reports for healthcare and public-sector clients. Now I focus on
        statistics, machine learning, and LLM-powered tools, most recently as a Marketing Analytics Intern at Aquila
        Clouds and on an AI meeting-effectiveness practicum with Microsoft. I enjoy turning messy data into clear,
        practical recommendations.
      </p>

      <h2 className="mt-12 text-xl font-semibold">Skills</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm dark:border-zinc-700"
          >
            {skill}
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-semibold">Highlights</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-600 dark:text-zinc-400">
        {highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </main>
  );
}
