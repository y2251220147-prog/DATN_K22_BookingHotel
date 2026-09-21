// components/Pagination/PaginationServer.tsx
import Link from "next/link";

interface PaginationServerProps {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

const PaginationServer = ({
  page,
  totalPages,
  basePath,
  searchParams = {},
}: PaginationServerProps) => {
  const buildHref = (p: number) => {
    const params = new URLSearchParams({ ...searchParams, page: String(p) });
    return `${basePath}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-end items-center mt-4 gap-1.5">
      <Link
        href={buildHref(page - 1)}
        aria-disabled={page === 1}
        className={`w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 transition-colors
          ${page === 1 ? "pointer-events-none opacity-35" : "hover:bg-gray-100"}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border transition-colors
            ${p === page
              ? "bg-blue-500 text-white border-blue-500 font-medium"
              : "border-gray-200 text-gray-500 hover:bg-gray-100"
            }`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={buildHref(page + 1)}
        aria-disabled={page === totalPages}
        className={`w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 transition-colors
          ${page === totalPages ? "pointer-events-none opacity-35" : "hover:bg-gray-100"}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
};

export default PaginationServer;