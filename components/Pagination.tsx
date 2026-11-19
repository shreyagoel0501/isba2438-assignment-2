"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const navButtonClass =
    "rounded-sm border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-blush-deep hover:text-blush-deep disabled:opacity-50 disabled:cursor-not-allowed";
  const pageButtonClass = "rounded-sm border px-4 py-2 text-sm transition-colors";
  const currentPageClass = "cursor-default border-blush-deep bg-blush-deep text-white";
  const otherPageClass = "border-border bg-card hover:border-blush-deep hover:text-blush-deep";

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={navButtonClass}
      >
        Previous
      </button>
      {pages.map((page) =>
        page === currentPage ? (
          <button
            key={page}
            type="button"
            disabled
            aria-current="page"
            className={`${pageButtonClass} ${currentPageClass}`}
          >
            {page}
          </button>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`${pageButtonClass} ${otherPageClass}`}
          >
            {page}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={navButtonClass}
      >
        Next
      </button>
    </nav>
  );
}
