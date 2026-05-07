import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { blogPosts, getPostBySlug } from "@/data/blog-posts";

const tagConfig: Record<string, { dot: string; pill: string }> = {
  "Image SEO":       { dot: "bg-violet-500",  pill: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  "Google Business": { dot: "bg-blue-500",    pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  "Performance":     { dot: "bg-emerald-500", pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  "ALT Text":        { dot: "bg-amber-500",   pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  "Strategy":        { dot: "bg-rose-500",    pill: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug ?? "");

  useEffect(() => {
    if (post) {
      document.title = post.metaTitle;
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = post.metaDescription;

      // canonical
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = `${window.location.origin}/blog/${post.slug}`;
    }
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-black mb-4">Article not found</h1>
            <Link href="/" className="text-primary font-bold hover:underline">← Back to home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const cfg = tagConfig[post.tag] ?? tagConfig["Image SEO"];
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <header className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to IMGSEO
            </Link>

            <div className="flex items-center gap-2.5 mb-5">
              <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.pill}`}>{post.tag}</span>
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight mb-5 md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-7">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readTime}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {post.date}</span>
              <span className="flex items-center gap-1.5"><Tag className="h-4 w-4" /> {post.author}</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="space-y-12"
          >
            {post.body.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-xl font-black tracking-tight md:text-2xl">{section.h2}</h2>

                {section.paragraphs?.map((p, i) => (
                  <p key={i} className="text-base text-muted-foreground leading-relaxed">{p}</p>
                ))}

                {section.code && (
                  <div className="rounded-2xl bg-foreground/5 border border-border px-5 py-4 font-mono text-sm text-primary font-bold">
                    {section.code}
                  </div>
                )}

                {section.list && (
                  <ul className="space-y-2.5">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.tip && (
                  <div className="rounded-2xl border border-amber-200/70 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/25 px-5 py-4 text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                    <strong className="font-bold block mb-1">Pro tip:</strong>
                    {section.tip}
                  </div>
                )}
              </section>
            ))}
          </motion.article>

          {/* In-article CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 rounded-3xl bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-600 p-8 text-white text-center"
          >
            <Zap className="h-8 w-8 mx-auto mb-3 opacity-80" />
            <h3 className="text-xl font-extrabold mb-2">Ready to optimise your images?</h3>
            <p className="text-sm opacity-80 mb-6 max-w-sm mx-auto">
              Put everything in this article into practice — free, in your browser, in under 60 seconds.
            </p>
            <a
              href="/#tool"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-violet-700 text-sm font-bold hover:bg-white/90 transition-colors shadow-lg"
            >
              Try IMGSEO Free →
            </a>
          </motion.div>

          {/* Related articles */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-black mb-6">More articles</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((rel) => {
                  const relCfg = tagConfig[rel.tag] ?? tagConfig["Image SEO"];
                  return (
                    <a
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-3d group block rounded-2xl border border-border/60 bg-background p-5 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`h-1.5 w-1.5 rounded-full ${relCfg.dot}`} />
                        <span className="text-xs font-bold text-muted-foreground">{rel.tag}</span>
                      </div>
                      <h3 className="font-bold text-sm leading-snug mb-2 group-hover:text-primary transition-colors">{rel.title}</h3>
                      <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
