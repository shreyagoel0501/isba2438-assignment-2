export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tech: string[];
  githubUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "moon-lift",
    title: "Moon Lift: AI Gym Agent",
    summary: "A fitness AI agent that personalizes workouts for each user.",
    description:
      "A full-stack fitness agent with a Streamlit frontend, an orchestration layer that interprets what the user wants, and a recommendation engine that combines hard safety rules with LLM prompting. It adjusts workout intensity to the user's menstrual cycle phase and stores workout history and feedback in a vector database, so plans become more personal over time.",
    tech: ["Python", "Streamlit", "LLMs", "Ollama embeddings", "Vector database"],
    githubUrl: "https://github.com/shreyagoel0501/AI_Gym_Agent",
  },
  {
    slug: "wine-quality-prediction",
    title: "Wine Quality Prediction",
    summary: "A machine learning model that predicts whether a wine is high quality.",
    description:
      "A binary classification pipeline on about 6,500 wine samples. I engineered features such as a sulphur ratio, total acidity, and a body index, used SMOTE to handle class imbalance, and compared Logistic Regression, Decision Trees, Gradient Boosting, and XGBoost. XGBoost reached 0.90 AUC, and I tuned it for precision to avoid recommending bad wines. The top predictors were alcohol content, volatile acidity, and the engineered body index.",
    tech: ["Python", "Scikit-learn", "XGBoost", "SMOTE", "Feature engineering"],
    githubUrl: "https://github.com/shreyagoel0501/Wine_Prediction",
  },
  {
    slug: "hotel-cancellation-analytics",
    title: "Hotel Revenue & Cancellation Analytics",
    summary: "What makes hotel guests cancel, and what drives room prices?",
    description:
      "An end-to-end R analysis of about 119,000 hotel bookings from 2015 to 2017. I engineered a holiday feature by matching Portuguese public holidays to arrival dates. A logistic regression showed group bookings were 4.5x more likely to cancel than direct bookings and online travel agency bookings 2.5x more likely, with lead time as another risk factor. I recommended risk-based deposits for high-cancellation channels and dynamic pricing for holiday periods.",
    tech: ["R", "Logistic regression", "ANOVA", "Feature engineering"],
    githubUrl: "https://github.com/shreyagoel0501/Hotel_Analytics",
  },
  {
    slug: "h1b-wage-fairness",
    title: "H1B Wage Fairness Analytics",
    summary: "Do H1B workers earn more than the national average for their job?",
    description:
      "A Python pipeline that joins Department of Labor H1B application data with BLS national wage benchmarks by occupation code. Wages were converted to a common annual figure and compared as a wage ratio per occupation. The mean ratio was 1.08 but the median was 0.99, so half of certified H1B workers earn at or below the national average. A t-test confirmed the premium is statistically significant but concentrated in a few high-demand roles.",
    tech: ["Python", "Pandas", "Statistical testing", "Data visualization"],
    githubUrl: "https://github.com/shreyagoel0501/H1B_Wage_Analytics",
  },
  {
    slug: "twitter-sentiment-analysis",
    title: "Sentiment Analysis on X (Twitter) Data",
    summary: "How much does the method change the answer in sentiment analysis?",
    description:
      "A lexicon-based sentiment classifier on about 150,000 words from tweets mentioning Trump, using regex text cleaning and word-list matching. A sensitivity analysis showed the positive-to-negative ratio flipped from 1.39 to 0.54 depending on how the search keyword itself was classified, exposing a bias built into the method.",
    tech: ["Python", "Regex", "NLP", "Sentiment analysis"],
    githubUrl: "https://github.com/shreyagoel0501/Sentiment_Analysis",
  },
  {
    slug: "the-book-spot",
    title: "The Book Spot",
    summary: "A community platform where readers connect and exchange books.",
    description:
      "A full-stack reading platform built from scratch in a two-person agile team. I designed the database schemas and REST APIs and delivered features including social networking, user profiles, login and signup, and shopping with courier integration for book exchanges.",
    tech: ["Full-stack development", "REST APIs", "Database design", "Authentication"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
