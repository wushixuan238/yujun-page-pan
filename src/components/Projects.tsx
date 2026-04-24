import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { SPRING_PRESETS } from "../lib/animation";

const Projects = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
      transition={SPRING_PRESETS.smooth}
      className="min-h-screen bg-background text-foreground font-body selection:bg-primary selection:text-primary-foreground relative"
    >
      <main className="max-w-7xl mx-auto px-12 pt-32 pb-48 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <h1 className="text-6xl font-headline font-bold mb-6 tracking-tight">
            LABS
          </h1>
          <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
            A curated collection of my work, experiments, and technical explorations.
            Currently architecting this space to better showcase the "How" behind the "What".
          </p>
        </motion.div>

        {/* Placeholder Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Real Project: Amazon Prime Pilot */}
          <div className="group aspect-[4/3] bg-card border border-border rounded-2xl p-8 flex flex-col justify-center items-center text-center hover:border-primary/40 transition-all">
            <div className="font-mono text-[10px] tracking-widest text-primary mb-4 uppercase font-bold">
              BUILDING...
            </div>
            <h3 className="text-2xl font-headline mb-4">Amazon Prime Pilot</h3>
            <div className="w-12 h-px bg-primary/30 mb-4" />
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              An AI-powered agentic system designed for large-scale Amazon operations.
              Focusing on automated data analysis and shadow execution workflows.
            </p>
          </div>

          {[2, 3].map((i) => (
            <div
              key={i}
              className="group aspect-[4/3] bg-card border border-border rounded-2xl p-8 flex flex-col justify-center items-center text-center hover:border-primary/40 transition-all cursor-wait opacity-60"
            >
              <div className="font-mono text-[10px] tracking-widest text-primary/40 mb-4 uppercase">
                Building...
              </div>
              <h3 className="text-2xl font-headline mb-4 opacity-40">Project_{i.toString().padStart(2, '0')}</h3>
              <div className="w-12 h-px bg-border opacity-40 mb-4" />
              <p className="text-sm text-muted-foreground/40 font-body">
                Detailed case study and technical breakdown coming soon.
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Return Button - matching other pages */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING_PRESETS.smooth, delay: 0.2 }}
          className="flex items-center gap-2 p-1 bg-foreground/90 dark:bg-neutral-800/90 backdrop-blur-md rounded-full shadow-lg border border-white/10"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 text-background dark:text-foreground hover:bg-white/10 rounded-full transition-all group"
            aria-label="Back to home"
          >
            <ArrowLeft size={18} className="group-active:scale-90 transition-transform" />
            <span className="font-mono text-[10px] tracking-widest uppercase font-bold">
              Return
            </span>
          </button>
        </motion.div>
      </div>

      {/* Background Decor */}
      <div className="fixed bottom-0 left-0 p-12 pointer-events-none select-none overflow-hidden opacity-[0.03]">
        <h2 className="text-[20vw] font-headline font-bold leading-none text-foreground rotate-12 -translate-x-1/4 translate-y-1/4">
          LABS
        </h2>
      </div>
    </motion.div>
  );
};

export default Projects;
