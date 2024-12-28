// export Interface for Image Data
export interface ImageData {
  id: number;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

// export Interface for Author Data
export interface Author {
  id: number; // Assuming each author has a unique ID
  name: string;
  email: string;
  avatar: ImageData; // Assuming the author has
}

// export Interface for Category Data
export interface Category {
  documentId: string; // Assuming each category has a unique ID
  name: string;
  description: string; // Optional description
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string; // rich markdown text
  createdAt: string; // ISO date string
  cover: ImageData; // Assuming this is the structure of your featured image
  author: Author; // The author of the blog post
  categories: Category[]; // An array of categories associated with the post
}

export interface UserBlogPostData {
  title: string;
  slug: string;
  description: string;
  content: string; //  rich markdown text
}

// Example response structure when fetching posts
export interface BlogPostResponse {
  data: BlogPost[];
}

// Example response structure when fetching a single post
export interface SingleBlogPostResponse {
  data: BlogPost; // The single blog post object
}


interface PostData {
  id: number;
  documentId: string;
  title: string;
  description: string;
  content: any[];  // Dependiendo de lo que venga en `content`, tal vez podrías detallar más este tipo.
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cover: {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    url: string;
  };
}

interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface ApiResponse {
  data: PostData[];
  meta: {
    pagination: Pagination;
  };
}
