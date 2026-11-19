import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { ContactInput } from "./contact-validation";

export type Submission = ContactInput & {
  id: string;
  source: "server-form" | "api";
  createdAt: string;
  updatedAt?: string;
};

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "contact-submissions.json");

export async function readSubmissions(): Promise<Submission[]> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as Submission[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function saveSubmission(data: ContactInput, source: "server-form" | "api") {
  await mkdir(dataDir, { recursive: true });
  const submissions = await readSubmissions();
  submissions.push({ id: randomUUID(), ...data, source, createdAt: new Date().toISOString() });
  await writeFile(filePath, JSON.stringify(submissions, null, 2), "utf8");
}

export async function getSubmission(id: string): Promise<Submission | undefined> {
  const submissions = await readSubmissions();
  return submissions.find((submission) => submission.id === id);
}

export async function updateSubmission(
  id: string,
  data: ContactInput,
): Promise<Submission | null> {
  await mkdir(dataDir, { recursive: true });
  const submissions = await readSubmissions();
  const submission = submissions.find((entry) => entry.id === id);
  if (!submission) return null;

  submission.name = data.name;
  submission.email = data.email;
  submission.message = data.message;
  submission.updatedAt = new Date().toISOString();

  await writeFile(filePath, JSON.stringify(submissions, null, 2), "utf8");
  return submission;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  await mkdir(dataDir, { recursive: true });
  const submissions = await readSubmissions();
  const next = submissions.filter((submission) => submission.id !== id);
  if (next.length === submissions.length) return false;

  await writeFile(filePath, JSON.stringify(next, null, 2), "utf8");
  return true;
}
