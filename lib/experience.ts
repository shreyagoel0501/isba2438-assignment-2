export type Role = {
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
  link?: { label: string; href: string };
};

export const experience: Role[] = [
  {
    title: "Student Ambassador",
    company: "SCU Office of Educational Assessment",
    location: "Santa Clara, CA",
    dates: "Sep 2026 – Present",
    bullets: [
      "Analyzed academic outcomes for a cohort of nearly 500 students to help evaluate a gateway program.",
      "Validated a Python analysis against an independent Excel model, writing data-cleaning logic that brought the two into 100% agreement.",
      "Reviewed departmental improvement plans against institutional standards and wrote feedback on gaps.",
    ],
  },
  {
    title: "Marketing Analytics Intern",
    company: "Aquila Clouds",
    location: "Pleasanton, CA",
    dates: "Jun 2026 – Present",
    bullets: [
      "Built a 146-column sales pipeline tracker across 9 deal stages, consolidating scattered data into one validated database.",
      "Ran win-driver analysis with chi-square, Fisher’s exact tests and Cramér’s V, automated in a reusable R script.",
      "Presented a go-to-market targeting recommendation to the co-founders.",
    ],
  },
  {
    title: "AI Meeting Effectiveness Practicum",
    company: "Microsoft",
    location: "Santa Clara, CA",
    dates: "Jan 2026 – Jun 2026",
    bullets: [
      "Built an LLM evaluation pipeline using Azure Video Indexer and Microsoft Foundry.",
      "Engineered extractors for action items, tone shifts and agenda adherence that output consistent JSON for scoring.",
      "Co-authored a Microsoft Tech Community publication on the Online Meeting Effectiveness Index.",
    ],
    link: {
      label: "Read the publication",
      href: "https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/online-meeting-effectiveness-index-omei/4526638",
    },
  },
  {
    title: "Workday Financials Technical Analyst",
    company: "Deloitte Consulting USI",
    location: "Mumbai, India",
    dates: "Aug 2022 – Aug 2025",
    bullets: [
      "Built and maintained 26+ Workday Financials integrations for healthcare and public-sector clients.",
      "Led delivery of 15+ integrations and reports across 3 client migrations from PeopleSoft to Workday.",
      "Served as Acting Integration Lead for 2 months on a large public-sector university project.",
    ],
  },
  {
    title: "Team Leader, Outgoing Global Talent",
    company: "AIESEC in Bengaluru",
    location: "Bengaluru, India",
    dates: "Feb 2020 – Jan 2021",
    bullets: [
      "Led a 4-person team through a major transition, running remote recruitment and partnerships across Malaysia, Turkey and Lahore.",
    ],
  },
];

export type Degree = {
  school: string;
  degree: string;
  details: string;
  dates: string;
};

export const education: Degree[] = [
  {
    school: "Santa Clara University, Leavey School of Business",
    degree: "MS in Business Analytics",
    details: "GPA 4.0 · Dean’s List",
    dates: "Expected Dec 2026",
  },
  {
    school: "Christ University, Bangalore",
    degree: "BS in Computer Science, Mathematics and Statistics",
    details: "",
    dates: "May 2022",
  },
];
