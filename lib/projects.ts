export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tech: string[];
  githubUrl: string;
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
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
