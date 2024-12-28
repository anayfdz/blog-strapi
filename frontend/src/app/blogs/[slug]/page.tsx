"use client";
import { useEffect, useState } from "react";
import { getPostBySlug } from "../../../../lib/api"; // Import your API function
import { useRouter } from "next/navigation";
import { BlogPost } from "../../../../lib/types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { FaClipboard } from "react-icons/fa"; // Import your chosen icon
import Loader from "../../../components/Loader";
import moment from "moment";
import { toast } from "react-hot-toast";
import React from "react";

// Handle copy to clipboard
const handleCopyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!"); // Show toast on success
  } catch (err) {
    console.error("Failed to copy code: ", err);
  }

};

type Params = {
  slug: string;
};

const BlogPostPage = ({ params }: { params: Promise<Params> }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  const router = useRouter();

 


  // Desenredar params usando React.use()
  const { slug: paramSlug } = React.use(params);

  useEffect(() => {
    if (paramSlug) {
      console.log("Setting slug from params:", paramSlug);
      setSlug(paramSlug); // Establecer el slug del parámetro
    }
  }, [paramSlug]);

  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        try {
          console.log("Fetching post with slug:", slug); // Log the slug being used to fetch the post
          const fetchedPost = await getPostBySlug(slug); // Aquí usamos el slug en lugar de params.slug
          setPost(fetchedPost);
        } catch (err) {
          setError("Error fetching post.");
          console.error("Error fetching post:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]); // Dependencia de slug para hacer la consulta cuando cambia

  if (loading)
    return (
      <div className="max-w-screen-md mx-auto flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error) return <p className="max-w-screen-md mx-auto">Error: {error}</p>;
  if (!post) return <p className="max-w-screen-md mx-auto">No post found.</p>;
   // Convert content from structured format to a plain string
   const getContentString = (content: any) => {
    if (Array.isArray(content)) {
      return content.map((item: any) => item.children?.map((child: any) => child.text).join(" ")).join("\n");
    }
    return content || "";
  };

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <h1 className="text-4xl leading-[60px] capitalize text-center font-bold text-purple-800 font-jet-brains">
        {post.title}
      </h1>
      <div className="w-full flex items-center justify-center font-light">
        Published: {moment(post.createdAt).fromNow()}
      </div>

      {/* Categories Section */}
      {post.categories && post.categories.length > 0 && (
        <div className="flex flex-wrap space-x-2 my-4">
          {post.categories.map(({ name, documentId }) => (
            <span
              key={documentId}
              className="border border-purple-900 font-medium px-2 py-2 text-sm"
            >
              {name}
            </span>
          ))}
        </div>
      )}

      {post.cover.url && (
        <div className="relative h-72 w-full my-4">
          <img
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${post.cover.url}`}
            alt={post.title}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
      )}
      <p className="text-gray-300 leading-[32px] tracking-wide italic mt-2 mb-6">
        {post.description}
      </p>
      <Markdown
        className={"leading-[40px] max-w-screen-lg prose prose-invert"}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            return !inline && match ? (
              <div className="relative">
                <button
                  onClick={() => handleCopyCode(codeString)}
                  className="absolute top-2 right-2 bg-gray-700 text-white p-1 rounded-md hover:bg-gray-600"
                  title="Copy to clipboard"
                >
                  <FaClipboard color="#fff" />
                </button>
                <SyntaxHighlighter
                  style={dracula}
                  PreTag="div"
                  language={match[1]}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {getContentString(post.content)}
      </Markdown>
      <button
        onClick={() => router.back()}
        className="text-purple-800 mt-4 inline-block hover:underline"
      >
        Back to Blogs
      </button>
    </div>
  );
};

export default BlogPostPage;
