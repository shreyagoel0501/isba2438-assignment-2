"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about-me", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact-me", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `text-sm uppercase tracking-widest transition-colors hover:text-blush-deep ${
      isActive(href) ? "text-blush-deep" : "text-muted"
    }`;

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
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          <a
            href="/Shreya_Goel_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border px-4 py-2 text-sm uppercase tracking-widest text-muted transition-colors hover:border-blush-deep hover:text-blush-deep"
          >
            Résumé
          </a>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-blush-deep md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>
      {open && (
        <div className="border-b border-border bg-card px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(link.href)}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/Shreya_Goel_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border px-4 py-2 text-sm uppercase tracking-widest text-muted transition-colors hover:border-blush-deep hover:text-blush-deep"
            >
              Résumé
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
