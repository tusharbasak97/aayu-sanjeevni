import type {
  Blog,
  Event,
  SeoMeta,
  Media,
  Admin,
  EventGallery,
} from "@prisma/client";

// Extended types with relations
export type BlogWithRelations = Blog & {
  author: Pick<Admin, "id" | "name">;
  seo: SeoMeta | null;
  media: { media: Media }[];
};

export type EventWithRelations = Event & {
  author: Pick<Admin, "id" | "name">;
  seo: SeoMeta | null;
  gallery: (EventGallery & { media: Media })[];
};

// Form types for admin panel
export interface BlogFormData {
  title: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  status: "DRAFT" | "PUBLISHED";
  seo: SeoFormData;
}

export interface EventFormData {
  title: string;
  description: string;
  location?: string;
  eventDate: string;
  eventEndDate?: string;
  status: "UPCOMING" | "ONGOING" | "PAST";
  seo: SeoFormData;
}

export interface SeoFormData {
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string;
  canonicalUrl?: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Service card type
export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}
