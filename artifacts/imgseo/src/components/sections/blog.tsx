import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

const posts = [
  {
    tag: "Image SEO",
    title: "Why Image File Names Are the #1 Ignored Local SEO Factor",
    excerpt: "Most local businesses upload photos straight from their camera with names like IMG_4392.jpg. Here's why that's costing them rankings — and how to fix it in 60 seconds.",
    readTime: "4 min read",
    date: "May 2025",
  },
  {
    tag: "Google Business",
    title: "How to Optimize Google Business Profile Photos for Maximum Local Visibility",
    excerpt: "Your GBP photos influence both rankings and click-through rate. We break down exactly which images to upload, what sizes to use, and how to name them for maximum impact.",
    readTime: "6 min read",
    date: "Apr 2025",
  },
  {
    tag: "Performance",
    title: "WebP vs JPG for Local Business Websites: Which Format Ranks Better?",
    excerpt: "WebP images load up to 34% faster than JPG. Google's Core Web Vitals score directly affects local ranking. Here's how to switch formats without breaking your site.",
    readTime: "5 min read",
    date: "Mar 2025",
  },
  {
    tag: "ALT Text",
    title: "Writing ALT Text for Local SEO: The Formula That Actually Works",
    excerpt: "ALT text is free ranking real estate — and almost no local business uses it correctly. We share the exact formula we use to generate ALT text that drives image search traffic.",
    readTime: "3 min read",
    date: "Feb 2025",
  },
  {
    tag: "Strategy",
    title: "The 5-Minute Image SEO Checklist Every Local Business Owner Should Use",
    excerpt: "Before uploading any image to your website or Google Business Profile, run through this 5-step checklist. It takes 5 minutes and can dramatically improve your local rankings.",
    readTime: "3 min read",
    date: "Jan 2025",
  },
];

const tagColors: Record<string, string> = {
  "Image SEO": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "Google Business": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Performance": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "ALT Text": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Strategy": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export function Blog() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">From the Blog</h2>
            <p className="text-muted-foreground">Actionable image SEO guides for local businesses.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, idx) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-background border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${tagColors[post.tag] ?? "bg-muted text-muted-foreground"}`}>
                {post.tag}
              </span>
              <h3 className="font-bold text-base leading-snug mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {post.readTime}
                </span>
                <span>{post.date}</span>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {posts.slice(3).map((post, idx) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-background border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex gap-4"
            >
              <span className={`self-start shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${tagColors[post.tag] ?? "bg-muted text-muted-foreground"}`}>
                {post.tag}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-sm leading-snug mb-1 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <span className="text-xs text-muted-foreground">{post.readTime} · {post.date}</span>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
