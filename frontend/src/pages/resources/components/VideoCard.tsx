import type { Video } from "@/types/resources";
import { Link } from "react-router-dom";
import { Eye, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import { slideUpSmallVariant } from "@/components/animation";

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const formattedDate = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <motion.div variants={slideUpSmallVariant}>
      <Link
        to={`/resources/videos/${video.id}`}
        className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
      >
        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
          <PlayCircle size={28} />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {video.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
            {formattedDate && <span>{formattedDate}</span>}
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {video.views}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VideoCard;
