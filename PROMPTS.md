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
| 19 | Rotating "I am an analyst / a problem solver / …" line in the hero | `components/RotatingRoles.tsx`, `app/page.tsx` | 257e27e |
| 20 | Clinking coffee cups after the coffee-chat sentence, a polaroid frame around my photo, and screen-reader text for the rotating line | `CoffeeClink.tsx`, `globals.css`, `app/page.tsx`, `RotatingRoles.tsx` (the cups and frame were removed later, see 21–23) | 44acde2 |
| 21 | Fix the hero photo disappearing inside the polaroid frame (frame had no width) | `app/page.tsx` | 44acde2 |
| 22 | Remove the polaroid frame, keep the hero label on one line, make the cups bigger, then turn the cups so the handles face outward | `app/page.tsx`, `CoffeeClink.tsx`, `globals.css` | 44acde2 |
| 23 | Remove the coffee cups, change "3+" to "3", add a link to my Microsoft publication, add a P.S. line to my bio | `app/page.tsx`, `lib/experience.ts`, `ExperienceCard.tsx`, About page | 44acde2 |
| 24 | Add a Home link and a Résumé button to the nav, and switch the contact email to my Gmail | `SiteNav.tsx`, contact page, `SiteFooter.tsx` | 44acde2 |
| 25 | Add a mobile menu so the nav fits on phones | `SiteNav.tsx`, `app/page.tsx` | 44acde2 |
| 26 | Fix an ESLint error in the mobile menu (remove an unneeded `useEffect`) | `SiteNav.tsx` | 44acde2 |

Not written by Viber (no code change): the résumé PDF (`public/Shreya_Goel_Resume.pdf`) is a copy of my data analyst résumé with my phone number removed, and the favicon (`app/icon.png`, replacing `favicon.ico`) is a round crop of my headshot. Claude prepared both files and I added them myself (commits 44acde2 and a1c6831).

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


# Part 2

## Prompt log

| # | What I asked Viber | What changed | Commit |
|---|---|---|---|
| 27 | Add a POST API route for contact messages that reuses my existing validation and storage | `app/api/contact/route.ts` | eacd565 |
| 28 | Build a client-side contact form that sends to the API with fetch, and point the nav's Contact link to it | `components/ContactApiForm.tsx`, `app/contact-me/page.tsx`, `SiteNav.tsx` | a1a167c |
| 29 | Create the blog data file with my two posts, and helper functions to read, validate and create posts | `lib/blogs.ts`, `data/blogs.json`, `public/blog/` | e96333d |
| 30 | Add GET and POST for blog posts, rejecting bodies that aren't plain objects | `app/api/blogs/route.ts` | 24ac526 |
| 31 | Blog list page that loads posts from the API, post pages with a 404, a `/blog-posts` redirect and a nav link | `BlogList.tsx`, `app/blogs/`, `app/blog-posts/page.tsx`, `SiteNav.tsx` | ae7b8f5 |
| 32 | An admin form that creates posts through the API | `components/BlogAdminForm.tsx`, `app/admin/blogs/page.tsx` | 6d2071e |
| 33 | Fix posts getting an empty slug when the title has no letters or numbers | `lib/blogs.ts` | d52a2f7 |
| 34 | Email each contact message to me with Resend, shared by both forms | `lib/contact-email.ts`, `lib/contact-delivery.ts`, `actions.ts`, `route.ts` | f0bc1c6 |
| 35 | Make both forms show the same success message | `ContactApiForm.tsx`, `route.ts` | 2632bcf, f0bc1c6 |
| 36 | Add the same `null` body check to the contact route | `app/api/contact/route.ts` | 5c3ff3e |

Not written by Viber: the blog photos and video in `public/blog/` are my own. Claude converted them from iPhone formats (HEIC and MOV) to smaller JPG and MP4 files, and I copied them into the project. I created the Resend account and API key myself; the key is in `.env.local` (not committed) and in Vercel's settings.

## Critique examples

### 4. The contact API crashed on a `null` body
**Files and commits:** `app/api/contact/route.ts` (eacd565 → 5c3ff3e), `app/api/blogs/route.ts` (24ac526)

- **What Viber proposed:** the contact route only checked that the body was valid JSON. `null` is valid JSON, so it went straight into `validateContact`, which crashed trying to read `null.name`, and the route returned an error page instead of a clean 400.
- **What I changed:** when I asked for the blogs route, I asked it to reject any body that isn't a plain object (`null` or an array) with a 400 "Invalid request body." Then I asked Viber to add the same check to the contact route.
- **Why:** A bad input needs to get a 400 error and not crash the route. A public API can be called by anything, not just my form. I asked for the check in the blogs route because the same gap was visible in the contact route, and then fixed the contact route so both APIs behave the same way.
- **How I checked:** I sent `null` to both APIs with curl. Before the fix, the live `/api/contact` returned a 500.
- **Result:** both now return `400 {"ok":false,"error":"Invalid request body."}`.

### 5. A title with no letters made a post with no URL
**File and commits:** `lib/blogs.ts`, e96333d → d52a2f7

- **What Viber proposed:** `createBlog` turned the title into a slug by keeping only letters and numbers. A title like `!!!` became an empty slug.
- **What I noticed:** I published a post titled `!!!` on `/admin/blogs`. It saved to `data/blogs.json` with `"slug": ""`, but no success message appeared, because the form only shows it when the slug isn't empty. The post also had no page of its own.
- **What I changed:** if the slug comes out empty, it now uses `post` (and then `post-2`, `post-3`, and so on).
- **Why:** Every post needs its own URL. Without its own URL, the post gets saved but people will be unable to open it.
- **How I checked:** I published `!!!` again.
- **Result:** it saved as `"slug": "post"`, the green box showed, and "View post" opened `/blogs/post`.

### 6. The live contact form couldn't save messages
**Files and commit:** `lib/contact-delivery.ts`, `lib/contact-email.ts`, f0bc1c6

- **What Viber's first version did:** both forms only saved messages to `data/contact-submissions.json`. Vercel's filesystem is read-only, so on the live site every message failed with "Could not save your message."
- **What I changed:** I added email with Resend as a second way to deliver each message. A shared `deliverContact` function tries both the save and the email, and the form shows success if either works. If there's no API key, it skips the email, so the project still runs for anyone without my key.
- **Why:** I want messages to reach my inbox, including on the live Vercel site I intend to share with recruiters. Doing the save and the email in one shared function keeps both forms working the same way, and skipping the email when there's no key means the project still runs for anyone else.
- **How I checked:** I sent messages from both forms locally, then added the key in Vercel, redeployed, and sent one from the live site.
- **Result:** all three emails reached my Gmail, and the live form showed "Thanks! Your message was sent."
