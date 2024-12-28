import axios, { AxiosInstance } from "axios";
import { UserBlogPostData } from "./types";
import { CiLineHeight } from "react-icons/ci";

export const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_STRAPI_URL}`,
});

export const getAllPosts = async (
  page: number = 1,
  searchQuery: string = ""
) => {
  try {
    // If search query exists, filter posts based on title
    const searchFilter = searchQuery
      ? `&filters[title][$containsi]=${searchQuery}`
      : ""; // Search filter with the title
    // Fetch posts with pagination and populate the required fields
    const response = await api.get(
      `api/blogs?populate=cover&pagination[page]=${page}&pagination[pageSize]=${process.env.NEXT_PUBLIC_PAGE_LIMIT}${searchFilter}`
    );
    console.log("API Response:", response);
    return {
      posts: response.data.data.map((post: any) => ({
        id: post.id,
        title: post.title,
        description: post.description,
        cover: post.cover?.url,
        slug: post.slug,
        content: post.content
      })),
      pagination: response.data.meta.pagination, // Return data and include pagination data
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw new Error("Server error"); // Error handling
  }
};

// Get post by slug
export const getPostBySlug = async (slug: string) => {
  console.log("Inside getPostBySlug with slug:", slug);
  try {
    const response = await api.get(
      `/api/blogs?filters[slug][$eq]=${slug}&populate=*`
    );
    console.log("API Response by slug:", response);
    if (response.data.data.length > 0) {
      const post = response.data.data[0]; // Return the post data

      return {
        id: post.id,
        title: post.title,
        description: post.description,
        cover: post.cover, // Correct access to cover URL
        content: post.content,
        slug: post.slug,
        createdAt: post.createdAt, // Incluye createdAt
        author: post.author, // Incluye author
        categories: post.categories,
      };
    }
    throw new Error("Post not found.");
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Server error");
  }
};

// Get all posts categories
export const getAllCategories = async () => {
  try {
    const response = await api.get("api/categories"); 
    return response.data.data; // Return all categories
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Server error");
  }
};

// Upload image with correct structure for referencing in the blog
export const uploadImage = async (image: File, refId: number) => {
  try {
    const formData = new FormData();
    formData.append("files", image);
    formData.append("ref", "api::blog.blog"); // ref: Strapi content-type name (in this case 'blog')
    formData.append("refId", refId.toString()); // refId: Blog post ID
    formData.append("field", "cover"); // field: Image field name in the blog

    const response = await api.post("api/upload", formData); // Strapi route to upload files and images
    const uploadedImage = response.data[0];
    return uploadedImage; // Return full image metadata
  } catch (err) {
    console.error("Error uploading image:", err);
    throw err;
  }
};

// Create a blog post and handle all fields
export const createPost = async (postData: UserBlogPostData) => {
  try {
    const reqData = { data: { ...postData } }; // Strapi required format to post data
    const response = await api.post("api/blogs", reqData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
};