import PreLoader from "@/layouts/PreLoader";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import VideoCard from "@/pages/resources/components/VideoCard";
import {
  useCategories,
  usePublishedPosts,
} from "@/pages/resources/hooks/useResources";
import type { Video } from "@/types/resources";
import { cn } from "@/utils";
import { container } from "@/components/animation";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VideosPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get("lesson") || null;

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useCategories("VIDEO");

  // Auto-select first lesson if none selected
  useEffect(() => {
    if (!lessonId && categories.length > 0) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("lesson", categories[0].id);
          return next;
        },
        { replace: true },
      );
    }
  }, [lessonId, categories, setSearchParams]);

  const {
    data: videosResponse,
    isLoading: videosLoading,
    isError,
    error,
  } = usePublishedPosts<Video>({
    type: "video",
    categoryId: lessonId,
    limit: 50,
  });

  const videos = videosResponse?.data ?? [];
  const selectedCategory = categories.find((c) => c.id === lessonId);

  const handleLessonSelect = (categoryId: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("lesson", categoryId);
        return next;
      },
      { replace: true },
    );
  };

  const navRef = useRef<HTMLElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  useEffect(() => {
    const el = navRef.current;
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

  if (categoriesLoading) return <PreLoader />;

  if (categories.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No lessons available yet</p>
        <p className="text-sm mt-1">Check back soon for new video content</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Lesson sidebar */}
      <aside className="lg:w-64 shrink-0">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Lessons
        </h3>
        <div className="relative lg:static">
          <nav
            ref={navRef}
            className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar"
          >
            {categories.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => handleLessonSelect(cat.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors shrink-0 w-full border",
                  lessonId === cat.id
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-card text-muted-foreground border-border hover:bg-muted",
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0",
                    lessonId === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {index + 1}
                </div>
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </nav>
          {/* Left fade — mobile only, signals can scroll back */}
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent transition-opacity duration-200 lg:hidden",
              canScrollLeft ? "opacity-100" : "opacity-0",
            )}
          />
          {/* Right fade — mobile only, signals more content ahead */}
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent transition-opacity duration-200 lg:hidden",
              canScrollRight ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
      </aside>

      {/* Video list */}
      <div className="flex-1 min-w-0">
        {selectedCategory && (
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">{selectedCategory.name}</h2>
            {selectedCategory.description && (
              <span className="text-sm text-muted-foreground hidden md:inline">
                — {selectedCategory.description}
              </span>
            )}
          </div>
        )}

        {videosLoading ? (
          <PreLoader />
        ) : isError ? (
          <ErrorDisplay message={(error as Error)?.message} />
        ) : videos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No videos in this lesson yet</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VideosPage;
