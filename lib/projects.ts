import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tech: string[];
  githubUrl?: string;
};

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "projects.json");

export async function readProjects(): Promise<Project[]> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as Project[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await readProjects();
  return projects.find((project) => project.slug === slug);
}

export function validateProject(input: {
  title?: unknown;
  summary?: unknown;
  description?: unknown;
  tech?: unknown;
  githubUrl?: unknown;
}):
  | {
      ok: true;
      data: {
        title: string;
        summary: string;
        description: string;
        tech: string[];
        githubUrl?: string;
      };
    }
  | {
      ok: false;
      errors: { title?: string; summary?: string; description?: string; tech?: string; githubUrl?: string };
    } {
  const errors: { title?: string; summary?: string; description?: string; tech?: string; githubUrl?: string } = {};

  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (!title) errors.title = "Please enter a title.";

  const summary = typeof input.summary === "string" ? input.summary.trim() : "";
  if (!summary) errors.summary = "Please enter a summary.";

  const description = typeof input.description === "string" ? input.description.trim() : "";
  if (!description) errors.description = "Please enter a description.";

  let tech: string[] = [];
  if (typeof input.tech === "string") {
    tech = input.tech
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  } else if (Array.isArray(input.tech)) {
    tech = input.tech
      .filter((tag): tag is string => typeof tag === "string")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  if (tech.length === 0) errors.tech = "Please add at least one technology.";

  let githubUrl: string | undefined;
  if (typeof input.githubUrl === "string" && input.githubUrl.trim() !== "") {
    const trimmed = input.githubUrl.trim();
    if (!trimmed.startsWith("https://")) {
      errors.githubUrl = "GitHub link must start with https://.";
    } else {
      githubUrl = trimmed;
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { title, summary, description, tech, githubUrl } };
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProject(data: {
  title: string;
  summary: string;
  description: string;
  tech: string[];
  githubUrl?: string;
}): Promise<Project> {
  await mkdir(dataDir, { recursive: true });
  const projects = await readProjects();

  const base = slugify(data.title) || "project";
  let slug = base;
  let counter = 2;
  while (projects.some((project) => project.slug === slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }

  const project: Project = {
    slug,
    title: data.title,
    summary: data.summary,
    description: data.description,
    tech: data.tech,
    githubUrl: data.githubUrl,
  };

  projects.push(project);
  await writeFile(filePath, JSON.stringify(projects, null, 2), "utf8");
  return project;
}

export async function updateProject(
  slug: string,
  data: {
    title: string;
    summary: string;
    description: string;
    tech: string[];
    githubUrl?: string;
  }
): Promise<Project | null> {
  await mkdir(dataDir, { recursive: true });
  const projects = await readProjects();
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) return null;

  project.title = data.title;
  project.summary = data.summary;
  project.description = data.description;
  project.tech = data.tech;
  project.githubUrl = data.githubUrl;

  await writeFile(filePath, JSON.stringify(projects, null, 2), "utf8");
  return project;
}

export async function deleteProject(slug: string): Promise<boolean> {
  await mkdir(dataDir, { recursive: true });
  const projects = await readProjects();
  const next = projects.filter((project) => project.slug !== slug);
  if (next.length === projects.length) return false;

  await writeFile(filePath, JSON.stringify(next, null, 2), "utf8");
  return true;
}
