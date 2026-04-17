import BackButton from "@/components/shared/BackButton";
import ErrorDisplay from "@/components/shared/ErrorDisplay";
import MaxWidth from "@/components/shared/MaxWith";
import { Badge } from "@/components/ui/badge";
import PreLoader from "@/layouts/PreLoader";
import { usePostById } from "@/pages/resources/hooks/useResources";
import type { Video } from "@/types/resources";
import { Calendar, Eye } from "lucide-react";
import { useParams } from "react-router-dom";
import { InstagramEmbed, YouTubeEmbed } from "react-social-media-embed";

function isYouTubeUrl(url: string) {
  return /^https?:\/\/(www\.)?(youtube\.com\/(watch|shorts)|youtu\.be\/)/.test(
    url,
  );
}

function isInstagramUrl(url: string) {
  return /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\//.test(url);
}

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
      <div className="min-h-[80dvh] grid place-content-center">
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
  const url = video.videoUrl;
  const formattedDate = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const renderPlayer = () => {
    if (isYouTubeUrl(url)) {
      return <YouTubeEmbed url={url} width="100%" height="100%" />;
    }

    if (isInstagramUrl(url)) {
      return (
        <div className=" w-auto overflow-hidden rounded-lg bg-black">
          <InstagramEmbed url={url} width={380} height={570} captioned />
        </div>
      );
    }

    return (
      <video
        src={url}
        controls
        className="aspect-video w-full md:w-[60%] object-contain overflow-hidden rounded-lg bg-black"
      >
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <MaxWidth className="max-w-5xl py-8 md:py-12 space-y-6 min-h-[82dvh]">
      <BackButton />
      <div className="flex flex-col md:flex-row gap-4">
        {/* Video player */}
        {renderPlayer()}

        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            {video.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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

          <p className="text-muted-foreground text-sm italic leading-relaxed">
            {video.description}
          </p>
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
        </div>
      </div>
    </MaxWidth>
  );
};

export default VideoDetailPage;
