import { Suspense } from "react";
import AdminLinkCard from "@/components/AdminLinkCard";
import { readProjects } from "@/lib/projects";
import { readBlogs } from "@/lib/blogs";
import { readSubmissions } from "@/lib/contact-store";
import { readRecommendations } from "@/lib/recommendations";

export default function AdminHome() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="text-4xl sm:text-5xl">Admin</h1>
      <p className="mt-2 text-muted">
        Manage everything stored on the server. Each page talks to its API and
        saves to a JSON file in /data.
      </p>
      <Suspense
        fallback={<p className="mt-8 text-muted">Loading counts...</p>}
      >
        <AdminLinks />
      </Suspense>
      <p className="mt-8 text-sm text-muted">
        The watchlist is saved in each visitor&apos;s browser, not on the
        server, so it isn&apos;t managed here.
      </p>
    </main>
  );
}

async function AdminLinks() {
  const [projects, blogs, submissions, recommendations] = await Promise.all([
    readProjects(),
    readBlogs(),
    readSubmissions(),
    readRecommendations(),
  ]);

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AdminLinkCard
        title="Projects"
        description="Create, edit and delete portfolio projects."
        href="/admin/projects"
        count={projects.length}
      />
      <AdminLinkCard
        title="Blog posts"
        description="Write and manage blog posts."
        href="/admin/blogs"
        count={blogs.length}
      />
      <AdminLinkCard
        title="Contact messages"
        description="Read messages sent through the contact form."
        href="/admin/contacts"
        count={submissions.length}
      />
      <AdminLinkCard
        title="Thriller recs"
        description="The public recommendations board."
        href="/recommendations"
        count={recommendations.length}
      />
    </div>
  );
}
