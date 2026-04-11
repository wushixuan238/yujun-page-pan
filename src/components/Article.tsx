import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getPostBySlug, type Post } from "../data/posts";
import { SPRING_PRESETS } from "../lib/animation";

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = () => {
      if (!slug) {
        setError("Invalid article slug");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = getPostBySlug(slug);
        if (data) {
          setPost(data);
        } else {
          setError("Article not found");
        }
      } catch (err: any) {
        console.error("Failed to fetch article:", err);
        setError(err.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#FAF9F6] text-[#1A1C19] flex items-center justify-center"
      >
        <div className="font-mono text-[11px] text-neutral-500">
          LOADING ARTICLE_DATA...
        </div>
      </motion.div>
    );
  }

  if (error || !post) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#FAF9F6] text-[#1A1C19] flex flex-col items-center justify-center gap-6"
      >
        <div className="font-mono text-[11px] text-red-500">
          {error || "Article not found"}
        </div>
        <button
          onClick={() => navigate("/archive")}
          className="text-[11px] font-mono font-bold text-[#324A49] hover:underline underline-offset-8 transition-all"
        >
          ← BACK_TO_ARCHIVE
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={SPRING_PRESETS.smooth}
      className="min-h-screen bg-[#FAF9F6] text-[#1A1C19] overflow-y-auto"
    >
      {/* Article Header */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/80 backdrop-blur-md border-b border-neutral-200/50">
        <div className="max-w-4xl mx-auto px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#324A49] hover:text-[#1A1C19] transition-colors font-mono text-[10px] tracking-widest uppercase font-bold"
          >
            <ArrowLeft size={16} />
            <span>BACK</span>
          </button>
          <div className="font-mono text-[9px] text-neutral-400 tracking-wider">
            {post.category} // {post.date}
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-8 py-16">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h1 className="text-5xl lg:text-6xl font-headline leading-tight mb-6 text-[#1A1C19]">
            {post.title}
          </h1>
          <p className="text-xl text-neutral-500 leading-relaxed font-body italic">
            {post.excerpt}
          </p>
        </motion.div>

        {/* Markdown Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-headline mt-12 mb-6 text-[#1A1C19]">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-headline mt-10 mb-4 text-[#1A1C19]">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-headline mt-8 mb-3 text-[#1A1C19]">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-6 leading-relaxed text-[#1A1C19]/80 font-body">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-6 space-y-2 text-[#1A1C19]/80">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-6 space-y-2 text-[#1A1C19]/80">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li>{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[#324A49] pl-6 py-2 my-6 italic text-neutral-600 bg-[#324A49]/5 rounded-r-lg">
                  {children}
                </blockquote>
              ),
              code: ({ className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match;
                return isInline ? (
                  <code
                    className="bg-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono text-[#C7254E]"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <code
                    className={`block bg-neutral-900 text-[#FAF9F6] p-6 rounded-lg overflow-x-auto my-6 font-mono text-sm ${className}`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => <pre className="mb-6">{children}</pre>,
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-[#324A49] hover:underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-[#1A1C19]">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-neutral-600">{children}</em>
              ),
              hr: () => <hr className="my-12 border-neutral-200" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>

        {/* Article Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-20 pt-12 border-t border-neutral-200/50"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/archive")}
              className="text-[11px] font-mono font-bold text-[#324A49] hover:underline underline-offset-8 transition-all"
            >
              ← BACK_TO_ARCHIVE
            </button>
            <div className="font-mono text-[9px] text-neutral-400">
              YUJUN@2026
            </div>
          </div>
        </motion.footer>
      </article>
    </motion.div>
  );
};

export default Article;
