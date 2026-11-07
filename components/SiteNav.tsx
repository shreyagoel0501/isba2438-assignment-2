import Link from "next/link";

const links = [
  { href: "/about-me", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact-me-server-form", label: "Contact" },
];

export default function SiteNav() {
  return (
    <nav className="w-full border-b border-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-2xl text-foreground">
          Shreya Goel
        </Link>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-widest text-muted transition-colors hover:text-blush-deep"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
