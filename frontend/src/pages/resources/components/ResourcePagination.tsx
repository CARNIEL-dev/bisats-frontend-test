import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ResourcePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

const ResourcePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isFetching,
}: ResourcePaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <Button
        variant="outline"
        size="icon"
        className="size-9"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isFetching}
      >
        <ChevronLeft size={16} />
      </Button>

      {getPageNumbers().map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            className="size-9"
            onClick={() => onPageChange(page)}
            disabled={isFetching}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        className="size-9"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isFetching}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default ResourcePagination;
