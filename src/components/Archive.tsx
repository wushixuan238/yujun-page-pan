import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import {
  getPostsByCategory,
  getCategories,
  type PostMeta,
} from "../data/posts";
import { SPRING_PRESETS } from "../lib/animation";

const ArchiveCard = ({
  item,
  navigate,
}: {
  item: PostMeta;
  navigate: (path: string) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-card p-8 w-80 h-80 shadow-sm border border-border flex flex-col justify-between group hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer mx-auto"
      onClick={() => navigate(`/article/${item.slug}`)}
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <span className="font-mono text-[9px] tracking-[0.2em] text-primary font-bold uppercase opacity-60">
            {item.category}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground">
            {item.date}
          </span>
        </div>
        <h2 className="text-2xl font-headline leading-tight mb-4 text-foreground group-hover:text-primary transition-colors">
          {item.title}
        </h2>
        <p className="text-muted-foreground text-[13px] leading-relaxed font-body line-clamp-3 italic opacity-80 group-hover:opacity-100 transition-opacity">
          "{item.excerpt}"
        </p>
      </div>

      <div className="pt-6 border-t border-border flex justify-between items-center mt-auto">
        <span className="font-mono text-[9px] text-muted-foreground/50">
          {item.slug.toUpperCase()}
        </span>
        <div className="text-[10px] font-mono font-bold text-foreground flex items-center gap-2">
          EXPLORE <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </motion.div>
  );
};

const Archive = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isHoveringCategories, setIsHoveringCategories] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = getPostsByCategory(selectedCategory);
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  const categories = useMemo<string[]>(() => {
    return getCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-mono text-[11px] text-muted-foreground animate-pulse tracking-widest">
          FETCHING_ARCHIVE...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      {/* MINIMAL NAV */}
      <nav className="fixed top-0 left-0 right-0 h-20 px-12 flex justify-between items-center z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-4 w-px bg-border" />
          <h1 className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase">
            Documents / <span className="text-primary">{selectedCategory}</span>
          </h1>
        </div>
        <div className="font-mono text-[10px] text-muted-foreground">
          INDEXED_OBJECTS: {posts.length}
        </div>
      </nav>

      {/* CATEGORY FILTER (FLOATING PILLS) */}
      <div className="fixed bottom-12 left-12 z-50 flex items-center gap-3">
        {categories.map((cat, idx) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full font-mono text-[10px] tracking-widest border transition-all ${
              selectedCategory === cat
                ? "bg-foreground text-background border-foreground shadow-lg shadow-black/10"
                : "bg-background text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID */}
      <main className="max-w-7xl mx-auto px-12 pt-32 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {posts.map((item) => (
              <ArchiveCard key={item.id} item={item} navigate={navigate} />
            ))}
          </AnimatePresence>
        </div>

        {posts.length === 0 && (
          <div className="h-60 flex items-center justify-center">
            <span className="font-mono text-[11px] text-muted-foreground/40 uppercase tracking-widest">
              Void_Category
            </span>
          </div>
        )}
      </main>

      {/* BACKGROUND TEXT */}
      <div className="fixed bottom-0 right-0 p-12 pointer-events-none select-none overflow-hidden opacity-[0.03]">
        <h2 className="text-[20vw] font-headline font-bold leading-none text-foreground -rotate-12 translate-x-1/4 translate-y-1/4">
          ARCHIVE
        </h2>
      </div>
    </div>
  );
};

export default Archive;
