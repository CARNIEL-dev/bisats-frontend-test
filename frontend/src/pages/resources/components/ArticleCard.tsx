import Logo from "@/assets/icons/bisats logo.png";
import { slideUpSmallVariant } from "@/components/animation";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/types/resources";
import { Eye } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

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
    <motion.div
      variants={slideUpSmallVariant}
      className="min-w-0 h-full max-h-[23rem]"
    >
      <Link
        to={`/resources/articles/${article.id}`}
        className="group  rounded-xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-md h-full flex flex-col gap-4"
      >
        <div className="aspect-video w-full overflow-hidden bg-muted basis-[90%] ">
          <img
            src={article.mediaUrl ?? Logo}
            alt={article.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-2 h-full p-4">
          <Badge variant="outline" className="text-xs">
            {article.categoryName}
          </Badge>
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 ">
            {article.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground  mt-auto">
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
