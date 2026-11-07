export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
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
        <p className="text-xs text-muted">© 2026</p>
      </div>
    </footer>
  );
}
