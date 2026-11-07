export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
        <div>
          <p className="font-display text-xl text-foreground">Shreya Goel</p>
          <p className="font-mono text-xs uppercase tracking-widest text-blush-deep mt-1">
            Business Analytics · Data Science
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-2">
          <p className="text-xs text-muted sm:hidden">© 2026 Shreya Goel</p>
          <a
            href="mailto:sgoel@scu.edu"
            className="text-muted hover:text-blush-deep"
          >
            sgoel@scu.edu
          </a>
          <a
            href="https://www.linkedin.com/in/shreyagoel0501"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-blush-deep"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/shreyagoel0501"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-blush-deep"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pb-8 hidden sm:block">
        <p className="text-xs text-muted">© 2026 Shreya Goel</p>
      </div>
    </footer>
  );
}
