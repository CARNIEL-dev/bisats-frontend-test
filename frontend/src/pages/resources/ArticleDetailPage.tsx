import BackButton from "@/components/shared/BackButton";
import MaxWidth from "@/components/shared/MaxWith";
import PreLoader from "@/layouts/PreLoader";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { Badge } from "@/components/ui/badge";
import { usePostById } from "@/pages/resources/hooks/useResources";
import type { Article } from "@/types/resources";
import { Eye, Calendar, User } from "lucide-react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = usePostById(id || "", "article");

  if (isLoading)
    return (
      <div className="min-h-[70dvh] grid place-content-center">
        <PreLoader primary={false} />
      </div>
    );

  if (isError) {
    return (
      <MaxWidth className="max-w-4xl py-10">
        <ErrorDisplay message={(error as Error)?.message} />
      </MaxWidth>
    );
  }

  if (!post) return null;

  const article = post as Article;
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <MaxWidth className="max-w-5xl py-8 md:py-12 flex flex-col gap-4">
      <BackButton text="Back to Resources" variant="secondary" />

      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Badge variant="outline">{article.categoryName}</Badge>
          {formattedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formattedDate}
            </span>
          )}
          <span className="flex items-center gap-1.5 ">
            <Eye size={14} />
            {article.views} views
          </span>
        </div>

        {article.description && (
          <p className="text-muted-foreground text-sm italic leading-relaxed">
            {article.description}
          </p>
        )}
      </div>
      {article.mediaUrl && (
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted">
          <img
            src={article.mediaUrl}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Article content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none pt-4 border-t border-border mt-4">
        {parse(DOMPurify.sanitize(article.content))}
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </MaxWidth>
  );
};

export default ArticleDetailPage;
