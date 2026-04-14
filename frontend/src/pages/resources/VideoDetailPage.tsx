import BackButton from "@/components/shared/BackButton";
import MaxWidth from "@/components/shared/MaxWith";
import PreLoader from "@/layouts/PreLoader";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import { Badge } from "@/components/ui/badge";
import { usePostById } from "@/pages/resources/hooks/useResources";
import type { Video } from "@/types/resources";
import { Eye, Calendar, User } from "lucide-react";
import { useParams } from "react-router-dom";

const VideoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = usePostById(id || "", "video");

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

  const video = post as Video;
  const formattedDate = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Determine if videoUrl is a YouTube/Vimeo embed or a direct video
  const isYouTube =
    video.videoUrl?.includes("youtube.com") ||
    video.videoUrl?.includes("youtu.be");
  const isVimeo = video.videoUrl?.includes("vimeo.com");
  const isEmbed = isYouTube || isVimeo;

  const getEmbedUrl = (url: string) => {
    if (isYouTube) {
      const videoId =
        url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] || "";
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (isVimeo) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1] || "";
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return (
    <MaxWidth className="max-w-4xl py-8 md:py-12 space-y-6">
      <BackButton />

      {/* Video player */}
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
        {isEmbed ? (
          <iframe
            src={getEmbedUrl(video.videoUrl)}
            title={video.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={video.videoUrl}
            controls
            className="h-full w-full"
            title={video.title}
          />
        )}
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold leading-tight">
          {video.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User size={14} />
            {video.authorName}
          </span>
          {formattedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formattedDate}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Eye size={14} />
            {video.views} views
          </span>
        </div>

        <p className="text-muted-foreground text-base leading-relaxed">
          {video.description}
        </p>
      </div>

      {/* Tags */}
      {video.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
          {video.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </MaxWidth>
  );
};

export default VideoDetailPage;
