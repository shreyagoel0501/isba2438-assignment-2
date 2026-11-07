export default function SectionHeading({ title }: { title: string }) {
  return (
    <div>
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
    </div>
  );
}
