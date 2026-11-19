import Link from "next/link";
import BlogAdmin from "@/components/BlogAdmin";

export default function ManageBlogs() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <nav className="font-mono text-xs uppercase tracking-widest text-muted">
        <Link href="/admin" className="hover:text-blush-deep">
          ← Admin
        </Link>
      </nav>
      <h1 className="mt-4 text-4xl sm:text-5xl">Manage blog posts</h1>
      <p className="mt-2 text-muted">
        Posts are saved to data/blogs.json and served through the API.
      </p>
      <BlogAdmin />
    </main>
  );
}
