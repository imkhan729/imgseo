import { motion } from "framer-motion";
import { Clock, ArrowRight, ExternalLink } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";

const tagConfig: Record<string, { dot: string; label: string; gradient: string }> = {
  "Image SEO":       { dot: "bg-violet-500",  label: "text-violet-700 dark:text-violet-300", gradient: "from-violet-600 via-violet-500 to-indigo-600" },
  "Google Business": { dot: "bg-blue-500",    label: "text-blue-700 dark:text-blue-300",     gradient: "from-blue-600 via-blue-500 to-cyan-600" },
  "Performance":     { dot: "bg-emerald-500", label: "text-emerald-700 dark:text-emerald-300", gradient: "from-emerald-600 via-teal-500 to-cyan-600" },
  "ALT Text":        { dot: "bg-amber-500",   label: "text-amber-700 dark:text-amber-300",   gradient: "from-amber-500 via-orange-500 to-rose-500" },
  "Strategy":        { dot: "bg-rose-500",    label: "text-rose-700 dark:text-rose-300",     gradient: "from-rose-600 via-pink-500 to-fuchsia-600" },
};

/* ── Featured card (first post) ── */
function FeaturedCard({ post }: { post: typeof blogPosts[0] }) {
  const cfg = tagConfig[post.tag] ?? tagConfig["Image SEO"];
  const href = `/blog/${post.slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="card-3d rounded-3xl border border-border/60 bg-background overflow-hidden"
      data-testid={`blog-card-${post.slug}`}
    >
      <div className="md:grid md:grid-cols-5">
        {/* Gradient panel */}
        <div className={`md:col-span-2 bg-gradient-to-br ${cfg.gradient} p-8 flex flex-col justify-between min-h-[200px] relative overflow-hidden`}>
          <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-white/70 mb-2">{post.tag}</span>
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <Clock className="h-3 w-3" /> {post.readTime} · {post.date}
            </div>
          </div>
          <div className="text-7xl font-black text-white/10 leading-none select-none relative z-10" style={{ fontFamily: "var(--app-font-display)" }}>
            01
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3 p-8 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-xl leading-snug mb-3">{post.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">{post.excerpt}</p>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`button-read-${post.slug}`}
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors shadow-md shadow-violet-500/20"
          >
            Read full article <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Regular card ── */
function BlogCard({ post, index }: { post: typeof blogPosts[0]; index: number }) {
  const cfg = tagConfig[post.tag] ?? tagConfig["Image SEO"];
  const href = `/blog/${post.slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="card-3d group rounded-3xl border border-border/60 bg-background overflow-hidden flex flex-col"
      data-testid={`blog-card-${post.slug}`}
    >
      <div className="p-6 flex flex-col flex-1">
        {/* Tag + read time */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
            <span className={`text-xs font-bold ${cfg.label}`}>{post.tag}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {post.readTime}
          </div>
        </div>

        <h3 className="font-black text-base leading-snug mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">{post.excerpt}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <span className="text-xs text-muted-foreground">{post.date}</span>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`button-read-${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Read <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export function Blog() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">

        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow mb-3">Resources</p>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl lg:text-5xl mb-2">From the Blog</h2>
            <p className="text-muted-foreground text-lg max-w-lg">
              Actionable image SEO guides for local businesses. Each article opens in a new tab.
            </p>
          </div>
          <a
            href="#tool"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors group"
          >
            Start optimizing <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Featured */}
        <div className="mb-5">
          <FeaturedCard post={blogPosts[0]} />
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {blogPosts.slice(1).map((post, idx) => (
            <BlogCard key={post.slug} post={post} index={idx + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
