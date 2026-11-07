"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/about-me", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact-me-server-form", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Shreya Goel, home" className="shrink-0">
          <Image
            src="/headshot.jpg"
            alt="Shreya Goel, home"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover object-[58%_35%] ring-1 ring-blush transition-shadow hover:ring-blush-deep"
          />
        </Link>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm uppercase tracking-widest transition-colors hover:text-blush-deep ${
                isActive(link.href) ? "text-blush-deep" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
