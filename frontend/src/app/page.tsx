"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAllPosts } from "../../lib/api";
import { BlogPost } from "../../lib/types";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1); // Track total number of pages

  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the search query and page from the URL params
  const searchQuery = searchParams.get("search") ?? "";
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1; // Default to page 1 if not present

  useEffect(() => {
    const fetchPosts = async (page: number) => {
      try {
        const response = await getAllPosts(page, searchQuery);
        const { posts, pagination } = response; 
        console.log(response, 'a ver loq ue traeess');
        setPosts(posts);
        setTotalPages(pagination.pageCount); // Set total pages
      } catch (error) {
        setError("Error fetching posts.");
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts(currentPage);
  }, [currentPage, searchQuery]); // Re-fetch when page or search query changes

  const handlePageChange = (newPage: number) => {
    // Update the page parameter in the URL
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", newPage.toString());
    router.push(`?${newParams.toString()}`);
    setLoading(true); // Show loader while fetching
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      {loading && (
        <div className="w-full flex items-center justify-center">
          <Loader />
        </div>
      )}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts && posts.length > 0 ? (
              posts.map((post: any) => (
                <div
                  key={post.id}
                  className="cursor-pointer bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <Link href={`/blogs/${post.slug}`} className="block">
                    {post.cover ? (
                      <div className="relative h-36 w-full">
                        <img
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${post.cover}`}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={() => console.log('Error loading image: ', `${process.env.NEXT_PUBLIC_STRAPI_URL}${post.cover}`)}
                        />
                      </div>
                    ) : (
                      <div className="relative h-36 w-full bg-gray-300">
                        {/* Imagen de reserva en caso de que no haya portada */}
                        <img
                          src='/next.svg'
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h2 className="text-lg font-semibold font-jet-brains text-white line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 mt-2 text-sm leading-6 line-clamp-3">
                        {post.description}
                      </p>
                      <p className="text-purple-400 text-sm mt-4 inline-block font-medium hover:underline">
                        Read More
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No posts available at the moment.</p>
            )}
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange} // Update page when pagination changes
          />
        </>
      )}
    </div>
  );
}
