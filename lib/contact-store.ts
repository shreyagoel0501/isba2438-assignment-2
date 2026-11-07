import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { ContactInput } from "./contact-validation";

export type Submission = ContactInput & {
  id: string;
  source: "server-form" | "api";
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "contact-submissions.json");

export async function readSubmissions(): Promise<Submission[]> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as Submission[];
  } catch {
    return [];
  }
}

export async function saveSubmission(data: ContactInput, source: "server-form" | "api") {
  await mkdir(dataDir, { recursive: true });
  let submissions: Submission[] = [];
  try {
    submissions = JSON.parse(await readFile(filePath, "utf8")) as Submission[];
  } catch {
    submissions = [];
  }
  submissions.push({ id: randomUUID(), ...data, source, createdAt: new Date().toISOString() });
  await writeFile(filePath, JSON.stringify(submissions, null, 2), "utf8");
}
