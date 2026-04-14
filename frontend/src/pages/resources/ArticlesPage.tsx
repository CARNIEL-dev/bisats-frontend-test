import SearchInput from "@/components/Inputs/SearchInput";
import { Button } from "@/components/ui/Button";
import PreLoader from "@/layouts/PreLoader";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import ArticleCard from "@/pages/resources/components/ArticleCard";
import ResourcePagination from "@/pages/resources/components/ResourcePagination";
import {
  useCategories,
  usePublishedPosts,
} from "@/pages/resources/hooks/useResources";
import type { Article } from "@/types/resources";
import { container } from "@/components/animation";
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
    <div className="space-y-6">
      {/* Category pills */}
      <div className="flex items-center gap-1 min-w-0">
        <Button
          onClick={() => handleCategoryChange(null)}
          variant={!category ? "default" : "outline"}
          size="sm"
          className="rounded-full px-3 py-1.5 h-fit shrink-0 whitespace-nowrap"
        >
          All
        </Button>
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar min-w-0">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
