import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];

        pages.push(1);

        if (currentPage > 3) {
            pages.push("ellipsis-left");
        }

        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            if (i === 1 || i === totalPages) continue;
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("ellipsis-right");
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div
            className={`flex items-center justify-center space-x-2 py-4 ${className}`}
        >
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                aria-label="Previous page"
            >
                &laquo;
            </button>

            {pageNumbers.map((page, index) => {
                if (page === "ellipsis-left" || page === "ellipsis-right") {
                    return (
                        <span key={`${page}-${index}`} className="px-3 py-1">
                            &hellip;
                        </span>
                    );
                }

                return (
                    <button
                        key={`page-${page}`}
                        onClick={() => onPageChange(Number(page))}
                        className={`w-[32px] h-[32px] text-[16px] font-[400] rounded-lg  ${currentPage === page
                                ? "bg-[#2B313B] text-white"
                                : "bg-white text-[#515B6E]"
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                aria-label="Next page"
            >
                &raquo;
            </button>
        </div>
    );
};

export default Pagination;
