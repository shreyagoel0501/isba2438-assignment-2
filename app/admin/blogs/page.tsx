import BlogAdminForm from "@/components/BlogAdminForm";

export default function NewBlogPost() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="text-4xl sm:text-5xl">New blog post</h1>
      <p className="mt-2 text-muted">
        Posts are saved to data/blogs.json.
      </p>
      <BlogAdminForm />
    </main>
  );
}
