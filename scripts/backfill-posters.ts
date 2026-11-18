import { readFile, writeFile } from "fs/promises";
import path from "path";
import { findPosterUrl } from "../lib/posters";
import type { Recommendation } from "../lib/recommendations";

const years: Record<string, number> = {
  "Stay Close": 2021,
  "I Will Find You": 2026,
  "Fool Me Once": 2024,
  "The Innocent": 2021,
  "The Housemaid": 2022,
  "The Girl on the Train": 2016,
  "Gone Girl": 2014,
  Kartavya: 2026,
};

const filePath = path.join(process.cwd(), "data", "recommendations.json");

async function main() {
  const items = JSON.parse(await readFile(filePath, "utf8")) as Recommendation[];

  for (const item of items) {
    const year = years[item.title];
    if (year !== undefined) item.year = year;

    item.posterUrl = await findPosterUrl(item.title, item.kind, item.year);
    if (item.posterUrl) {
      console.log(`[poster] ${item.title} (${item.year ?? "no year"}) -> ${item.posterUrl}`);
    } else {
      console.log(`[poster] ${item.title} (${item.year ?? "no year"}) -> none found`);
    }
  }

  await writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
  console.log(`[poster] wrote ${items.length} recommendations to ${filePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
