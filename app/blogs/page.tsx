import BlogList from "@/components/BlogList";

export default function Blogs() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="text-4xl sm:text-5xl">Blog</h1>
      <p className="mt-2 text-muted">
        Stories from my first year in the US and beyond.
      </p>
      <BlogList />
    </main>
  );
}
