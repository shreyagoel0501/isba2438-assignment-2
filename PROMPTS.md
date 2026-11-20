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


# Midterm: Expanded Portfolio

**New features:** a Thriller recs board (backend JSON + API with full CRUD, automatic posters) and My watchlist (saved in the browser with LocalStorage). I also added full CRUD for projects, blog posts and contact messages, an admin area, and password protection for the admin on the live site.

## Prompt log

| # | What I asked Viber | What changed | Commit |
|---|---|---|---|
| 37 | Add photos to my Deloitte blog post (data change only) | `data/blogs.json`, `public/blog/` | eddc92e |
| 38 | Create the thriller recommendations data file, helper functions and a full CRUD API with a log line for every request | `lib/recommendations.ts`, `data/recommendations.json`, `app/api/recommendations/route.ts`, `app/api/recommendations/[id]/route.ts` | 3f8db27 |
| 39 | Build the recs board: a parent component that fetches from the API and passes each recommendation to a card through props, a form for create and edit, delete, and my 8 starting picks | `RecommendationsBoard.tsx`, `RecommendationCard.tsx`, `RecommendationForm.tsx`, `app/recommendations/page.tsx`, `SiteNav.tsx` | 6f37d77 |
| 40 | Look up posters automatically on the server (TMDB for movies and shows, Open Library for books), add an optional year, and scroll to the form when Edit is clicked | `lib/posters.ts`, `lib/recommendations.ts`, `scripts/backfill-posters.ts`, `next.config.ts`, the recs components | 7044831 |
| 41 | Add My watchlist saved in LocalStorage, with safe loading of empty or broken data, and an "Add to watchlist" button on the recs board | `lib/watchlist.ts`, `Watchlist.tsx`, `WatchlistLoader.tsx`, `app/watchlist/page.tsx`, `RecommendationCard.tsx`, `RecommendationsBoard.tsx`, `SiteNav.tsx` | 150f8a6 |
| 42 | Move the recs form below the grid and add a reusable pagination component (6 per page) | `Pagination.tsx`, `RecommendationsBoard.tsx` | e78c886 |
| 43 | Make the current page number readable | `Pagination.tsx` | a33387e |
| 44 | Move projects into a JSON file with a full CRUD API and an admin page, keeping the public pages the same | `data/projects.json`, `lib/projects.ts`, `app/api/projects/`, `app/admin/projects/`, `ProjectAdmin.tsx`, `ProjectForm.tsx`, project pages | 99f7cf6 |
| 45 | Add edit and delete for blog posts (keeping photos and videos) and a contact messages admin page | `lib/blog-body.ts`, `lib/blogs.ts`, `lib/contact-store.ts`, `app/api/blogs/[slug]/`, `app/api/contact/`, `BlogAdmin.tsx`, `ContactAdmin.tsx`, `SubmissionCard.tsx` | 85ac658 |
| 46 | Add an admin home page with counts, a reusable BlogCard, and links back to the admin home page | `app/admin/page.tsx`, `AdminLinkCard.tsx`, `BlogCard.tsx`, `BlogList.tsx`, `SiteFooter.tsx` | 89250c8 |
| 47 | Password-protect the admin pages and write APIs on the live site, while keeping local development open | `proxy.ts`, `RecommendationsBoard.tsx`, `RecommendationForm.tsx` | 48aee7e |
| 48 | Stop the footer Admin link's prefetch from showing a login box on every page | `SiteFooter.tsx`, `proxy.ts` | d98a51f |
| 49 | Make the footer Admin link a full page load so the login box shows when it's clicked | `SiteFooter.tsx` | 7a303f9 |

Not written by Viber: Claude converted my Deloitte photos from iPhone formats to JPG, and checked my changes and ran tests (the watchlist in a browser, the blog edit round trip, page checks). I created the TMDB API key and the admin password myself; they are in `.env.local` (not committed) and in Vercel's settings.

## Critique examples

### 7. Clicking Edit seemed to do nothing
**Files and commit:** `RecommendationsBoard.tsx`, `RecommendationForm.tsx`, 6f37d77 → 7044831

- **What Viber proposed:** clicking Edit on a card switched the form at the top of the page into edit mode.
- **What I noticed:** when I clicked Edit on a card lower down the page, nothing seemed to happen, because the form was scrolled off the screen.
- **What I changed:** clicking Edit now scrolls smoothly to the form, and the form is highlighted while editing.
- **Why:** When I was trying it, I couldn't tell if the click worked or not, and users need to see that their click worked. Without this feedback, people would think the button was broken.
- **How I checked:** I clicked Edit on cards at the bottom of the page.
- **Result:** the page scrolls up to a highlighted form filled with that recommendation.

### 8. Editing a blog post would have deleted its photos
**Files and commit:** `lib/blog-body.ts`, `lib/blogs.ts`, `BlogAdminForm.tsx`, 85ac658

- **The problem:** my posts mix paragraphs with photos and a video. An editor that only showed text would have turned everything back into paragraphs on save, so the photos and video would be lost.
- **What I asked for:** in the editor, each photo or video appears as one line like `[image: /blog/diwali.jpg | Dressed up for Diwali]`. Saving turns those lines back into media blocks, so I can keep, move or remove them.
- **Why:** If I want to edit a post, I shouldn't have to lose content.
- **How I checked:** both posts were converted to editor text and back again, and the result was compared with the original. I also edited a word in the US post and opened it.
- **Result:** both posts came back identical, and the edited post still had all its photos and the video.

### 9. A login box popped up on every page
**Files and commits:** `proxy.ts`, `SiteFooter.tsx`, 48aee7e → d98a51f → 7a303f9

- **What happened:** after I added password protection for the admin on Vercel, every page (even Home) showed a login box.
- **What I found:** Next.js prefetches links in the background. The footer has an Admin link, so every page quietly requested `/admin`, got "password required", and the browser showed the login box.
- **First fix:** I turned off prefetch for that link and stopped the server from asking for a login on background requests. But then clicking Admin didn't ask for the password at all, because a Next.js link also changes pages in the background.
- **Second fix:** I made the Admin link a normal link that loads a full page.
- **Why:** I added this so that visitors and recruiters cannot access the admin. They should never see a password box on public pages, but clicking Admin should still ask.
- **How I checked:** I tested on the live site in a fresh Incognito window, and also checked the server responses.
- **Result:** public pages open normally, `/admin` asks for the password, and without it the admin pages and the contact message list return 401.

### 10. The current page number was invisible
**File and commits:** `Pagination.tsx`, e78c886 → a33387e

- **What Viber proposed:** the current page button was disabled so it couldn't be clicked again, but the disabled style also faded it, so the white number on light pink was unreadable.
- **What I changed:** only Previous and Next fade when disabled, and the current page uses a darker pink with full opacity.
- **Why:** It's visually less confusing if people can see which page they're on.
- **How I checked:** I looked at the pagination on the board with 9 recommendations (2 pages).
- **Result:** the current page number is clearly readable.

## Design choices and limitations

- **One lib file per data type.** All file reading, writing and validation lives in `lib/` (for example `lib/recommendations.ts`), and the API routes call those functions. The pages and APIs share one source of truth, and I could swap the JSON files for a database later without changing the routes or components.
- **The watchlist is in LocalStorage on purpose.** It's personal to each visitor, needs no account, and works on Vercel. The downside of browser storage is that it only exists in that one browser: it doesn't sync across devices, it's lost if the visitor clears their site data, and storage space is limited. All storage code is in `lib/watchlist.ts`, every value read back is checked, and saving is wrapped in try/catch.
- **Posters are looked up on the server,** so my TMDB key never reaches the browser. A poster is only looked up again when the title, type or year changes.
- **The Vercel filesystem is read-only.** Creating, editing and deleting work locally, but on the live site JSON writes fail (the forms show an error). For a real site I would use a database.
- **Known issue:** `/projects/nope` and `/blogs/nope` show the "not found" page, but the HTTP status is 200 instead of 404. The page streams in parts (Suspense), so the 200 is sent before the page knows the item is missing. Fixing it would mean caching the data, which would stop admin edits from showing right away, so I left it.
