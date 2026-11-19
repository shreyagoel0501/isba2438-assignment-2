import BlogAdmin from "@/components/BlogAdmin";

export default function ManageBlogs() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="text-4xl sm:text-5xl">Manage blog posts</h1>
      <p className="mt-2 text-muted">
        Posts are saved to data/blogs.json and served through the API.
      </p>
      <BlogAdmin />
    </main>
  );
}
