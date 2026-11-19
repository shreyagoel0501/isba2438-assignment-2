"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const baseClass =
    "rounded-sm border px-4 py-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const inactiveClass = "border-border bg-card hover:border-blush-deep hover:text-blush-deep";
  const activeClass = "border-blush bg-blush text-white";

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseClass} ${inactiveClass}`}
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
          aria-current={page === currentPage ? "page" : undefined}
          className={`${baseClass} ${page === currentPage ? activeClass : inactiveClass}`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseClass} ${inactiveClass}`}
      >
        Next
      </button>
    </nav>
  );
}
