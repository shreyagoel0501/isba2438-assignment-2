export default function SectionHeading({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-blush-deep">
        {label}
      </p>
      <h2 className="mt-2 text-3xl sm:text-4xl">{title}</h2>
    </div>
  );
}
