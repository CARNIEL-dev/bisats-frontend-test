import type { Article } from "@/types/resources";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { motion } from "motion/react";
import { slideUpSmallVariant } from "@/components/animation";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <motion.div variants={slideUpSmallVariant}>
      <Link
        to={`/resources/articles/${article.id}`}
        className="group block rounded-xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-md"
      >
        {article.mediaUrl && (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={article.mediaUrl}
              alt={article.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-4 space-y-3">
          <Badge variant="outline" className="text-xs">
            {article.categoryName}
          </Badge>
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {article.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            {formattedDate && <span>{formattedDate}</span>}
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {article.views}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArticleCard;
