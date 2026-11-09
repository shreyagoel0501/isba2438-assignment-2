# Prompt log and critique: Assignment 2, Part 1

All codes were written by Viber. I wrote the prompts and ran checks myself after every couple of prompts. I did use Claude as an outside reviewer to look over Viber’s code, point out problems and write test scripts that I ran, but in the end what to accept or change was my decision.


## Prompt log

| # | What I asked Viber | What changed | Commit |
|---|---|---|---|
| 1 | Set up a Next.js App Router project with TypeScript and Tailwind | Project scaffold, and `data/contact-submissions.json` added to `.gitignore` | ae52836 |
| 2 | Create project data and a navigation bar | `lib/projects.ts`, `components/SiteNav.tsx`, nav added to the layout | 2c265a7 |
| 3 | Build the Home, About Me and Projects pages | `app/page.tsx`, `app/about-me/page.tsx`, `app/projects/page.tsx` | 55b2101 |
| 4 | Add the dynamic project route, a not-found page and GitHub links | `app/projects/[slug]/page.tsx` and `not-found.tsx` | 795bc9b |
| 5 | Write the contact validation and the JSON storage logic | `lib/contact-validation.ts`, `lib/contact-store.ts` | f4229c7 |
| 6 | Fix the storage so it doesn't wipe data or repeat code | `readSubmissions` only treats a missing file as empty; `saveSubmission` reuses it | cd56581 |
| 7 | Build the server form contact page | `actions.ts` (server action), `components/ContactServerForm.tsx`, the contact page | d43b067 |
| 8 | Apply a blush theme, fonts and nav; add photos | `globals.css` colors and fonts, restyled nav | 2161ca1 |
| 9 | Add four more projects | `lib/projects.ts` now has 6 projects; GitHub link is optional | 10190f5 |
| 10 | Sticky nav, breadcrumbs, previous/next links; force a light theme | `SiteNav.tsx`, project page, `globals.css` | 51c0086 |
| 11 | Background glows, a footer, consistent heading fonts | `layout.tsx`, `SiteFooter.tsx`, `globals.css` | 8b4bf39 |
| 12 | Headshot in the nav; remove repeated names | `SiteNav.tsx`, `SiteFooter.tsx` | 8b6f507 |
| 13 | New Home hero and a shared project card | `app/page.tsx`, `components/ProjectCard.tsx` | 49794cc |
| 14 | Experience and education data; About page redesign | `lib/experience.ts`, `ExperienceCard.tsx`, `SectionHeading.tsx`, About page | 992322c, 9f2233b |
| 15 | Restyle the project pages | Projects list, project page, not-found page | 5bd3a53 |
| 16 | Rewrite my bio and Home intro in my own words | About page, `app/page.tsx` | 314e72d, 3b9a313 |
| 17 | Restyle the contact page with my headshot (styling only) | Contact page, `ContactServerForm.tsx` | 584c907 |
| 18 | Footer icon links | `SiteFooter.tsx` | 43c551b |

## Critique examples

### 1. The JSON store could silently delete every saved message
**File and commits:** `lib/contact-store.ts`, f4229c7 → cd56581

- **What Viber proposed:** `saveSubmission` had its own copy of the file-reading code instead of calling `readSubmissions`. Both copies caught *every* error and treated it as "no file yet". So if the JSON file were ever corrupted, the next save would start from an empty list and overwrite all existing messages without any warning.
- **What I changed:** I prompted Viber so that `readSubmissions` returns an empty list only when the file doesn't exist (error code `ENOENT`) and rethrows any other error, and so that `saveSubmission` calls `readSubmissions` instead of repeating the code.
- **Why:** I didn’t want messages to be deleted without anyone noticing. The form shows "Could not save your message" if saving fails. Removing the duplicate code meant there's one place to fix if the read logic changes.
- **How I checked:** I ran a test script that runs the store in a temporary folder: it saves two entries, then corrupts the file and tries to save again. I ran it on the old version (from f4229c7) and on the new version.
- **Result:** the old version failed 2 of 5 checks: it didn't raise an error, and it overwrote the corrupted file. The new version passed all 5.

### 2. Leftover dark-mode styles broke the layout
**Files and commit:** `app/globals.css` and the page files, 51c0086

- **What Viber proposed:** when Viber added the light pink theme, it removed the dark-mode background but left the `dark:` classes it had written earlier in the pages. On a computer in dark mode, parts of the page switched to dark colors while the background stayed light.
- **What I changed:** I prompted Viber to add a rule in `globals.css` so `dark:` classes never apply, and set `color-scheme: light`.
- **Why:** right now, i designed the site as light theme-only, and one rule would fix every page at once without editing each file.
- **How I checked:** I noticed the problem in Chrome while my Mac was in dark mode, and I compared it with the same page in dark mode before and after the fix.
- **Result:** before the fix, the tech tags were black, the text was faint and the button was washed out. After the fix, the pages looked the same in dark and light mode.

### 3. Email and blank-field validation
**File and commit:** `lib/contact-validation.ts`, f4229c7

- **What Viber proposed:** a `validateContact` function that trims name and message and rejects them if they're blank, and an email check: no whitespace, exactly one "@", text before the "@", and a domain with a dot and no empty parts.
- **What I accepted:** I kept it as written.
- **Why:** the form doesn't use the browser's own validation (`noValidate`), so these server-side checks are what actually decide, and they match every rule in the handout.
- **How I checked:** I ran a test script with 17 cases, including blank names and messages, missing or extra "@", `a@b`, `ana@.example.com`, `ana@example..com`, spaces and tabs in the email, and a non-text email value. I also tested the form by hand: an empty form, `a@b`, `a b@c.com`, and a valid entry, then checked `data/contact-submissions.json`.
- **Result:** all 17 cases passed. In the browser, the invalid submissions showed red errors and weren't saved, and the valid one showed the green message and appeared in the JSON file.
