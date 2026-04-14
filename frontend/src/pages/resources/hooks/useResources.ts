import { BACKEND_URLS } from "@/utils/backendUrls";
import type {
  Article,
  ApiResponse,
  Category,
  PaginatedResponse,
  Video,
} from "@/types/resources";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const BASE_URL = BACKEND_URLS.BASE_URL;

async function resourceFetch<T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.status) {
    throw new Error(json.message || "Request failed");
  }

  return json.data;
}

// Fetch categories filtered by type
export function useCategories(type: "BLOG" | "VIDEO") {
  return useQuery<Category[]>({
    queryKey: ["resourceCategories", type],
    queryFn: async () => {
      const data = await resourceFetch<Category[]>(
        BACKEND_URLS.RESOURCES.CATEGORIES,
      );
      return data.filter((cat) => cat.type === type);
    },
    staleTime: 1000 * 60 * 30, // 30 min — categories rarely change
  });
}

// Fetch published posts (articles or videos) with filters
interface PublishedPostsParams {
  type?: "article" | "video";
  categoryId?: string | null;
  search?: string | null;
  page?: number;
  limit?: number;
}

export function usePublishedPosts<T = Article>(params: PublishedPostsParams) {
  const { type = "article", categoryId, search, page = 1, limit = 12 } = params;

  const endpoint =
    type === "video"
      ? BACKEND_URLS.RESOURCES.PUBLISHED_VIDEOS
      : BACKEND_URLS.RESOURCES.PUBLISHED_ARTICLES;

  return useQuery<PaginatedResponse<T>>({
    queryKey: ["publishedPosts", type, { categoryId, search, page, limit }],
    queryFn: () => {
      const queryParams: Record<string, string> = {
        page: String(page),
        limit: String(limit),
      };
      if (categoryId) queryParams.categoryId = categoryId;
      if (search) queryParams.search = search;

      return resourceFetch<PaginatedResponse<T>>(endpoint, queryParams);
    },
    placeholderData: keepPreviousData,
  });
}

// Fetch a single post by ID
export function usePostById(id: string, type: "article" | "video") {
  return useQuery<Article | Video>({
    queryKey: ["post", id],
    queryFn: () =>
      resourceFetch<Article | Video>(
        type === "video"
          ? `${BACKEND_URLS.RESOURCES.VIDEO_BY_ID}/${id}`
          : `${BACKEND_URLS.RESOURCES.POST_BY_ID}/${id}`,
      ),
    enabled: !!id,
  });
}
