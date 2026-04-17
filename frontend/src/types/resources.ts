export interface Article {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  description: string;
  content: string;
  authorId: string;
  authorName: string;
  mediaUrl: string | null;
  tags: string[];
  keywords: string[];
  views: number;
  status: "PUBLISHED" | "DRAFT";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Video {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  description: string;
  authorId: string;
  authorName: string;
  videoUrl: string;
  tags: string[];
  keywords: string[];
  views: number;
  status: "PUBLISHED" | "DRAFT";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: "BLOG" | "VIDEO";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export type CategoriesResponse = Category[];
