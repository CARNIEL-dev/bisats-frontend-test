import { container } from "@/components/animation";
import { SelectDropDown } from "@/components/Inputs/MultiSelectInput";
import SearchInput from "@/components/Inputs/SearchInput";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { Button } from "@/components/ui/Button";
import PreLoader from "@/layouts/PreLoader";
import ArticleCard from "@/pages/resources/components/ArticleCard";
import ResourcePagination from "@/pages/resources/components/ResourcePagination";
import {
  useCategories,
  usePublishedPosts,
} from "@/pages/resources/hooks/useResources";
import type { Article } from "@/types/resources";
import { cn } from "@/utils";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const LIMIT = 12;

const ArticlesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || null;
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Debounce search input
  const [searchInput, setSearchInput] = useState(search);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "") {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          });
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      updateParams({ search: value || null, page: "1" });
    }, 300);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    updateParams({ category: categoryId, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  // Queries
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories("BLOG");

  const pillsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = pillsRef.current;
    if (!el) return;
    const check = () => {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    check();
    el.addEventListener("scroll", check);
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [categories]);

  const {
    data: postsResponse,
    isLoading: postsLoading,
    isFetching,
    isError,
    error,
  } = usePublishedPosts<Article>({
    categoryId: category,
    search: search || null,
    page,
    limit: LIMIT,
  });

  const articles = postsResponse?.data ?? [];
  const totalPages = postsResponse?.meta?.totalPages ?? 0;

  const isLoading = categoriesLoading || postsLoading;

  if (isLoading) return <PreLoader />;

  return (
    <div className="space-y-6 overflow-hidden w-full">
      {/* Category filter — dropdown on mobile, pills on desktop */}
      <div className="md:hidden">
        <SelectDropDown
          options={[
            { value: "all", label: "All Categories" },
            ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
          ]}
          value={category ?? "all"}
          onChange={(val) => handleCategoryChange(val === "all" ? null : val)}
          placeholder="Select category"
        />
      </div>
      <div className="hidden md:flex items-center gap-1">
        <Button
          onClick={() => handleCategoryChange(null)}
          variant={!category ? "default" : "outline"}
          size="sm"
          className="rounded-full px-3 py-1.5 h-fit shrink-0 whitespace-nowrap"
        >
          All
        </Button>
        <div className="relative flex-1 min-w-0">
          <div
            ref={pillsRef}
            className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1"
          >
            {categories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                variant={category === cat.id ? "default" : "outline"}
                size="sm"
                className="rounded-full px-3 py-1.5 h-fit shrink-0 whitespace-nowrap"
              >
                {cat.name}
              </Button>
            ))}
          </div>
          {/* Left fade */}
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent transition-opacity duration-200",
              canScrollLeft ? "opacity-100" : "opacity-0",
            )}
          />
          {/* Right fade */}
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent transition-opacity duration-200",
              canScrollRight ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Search articles..."
        value={searchInput}
        handleChange={handleSearchChange}
        className="max-w-md"
        inputClassName="h-10"
      />

      {/* Articles grid */}
      {isError ? (
        <ErrorDisplay message={(error as Error)?.message} />
      ) : articles.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No articles found</p>
          <p className="text-sm mt-1">
            Try adjusting your search or category filter
          </p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0"
        >
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      <ResourcePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isFetching={isFetching}
      />
    </div>
  );
};

export default ArticlesPage;
