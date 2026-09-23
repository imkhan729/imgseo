import { useState, useMemo } from "react";
import { ArrowRight, BookOpen, Calendar, Clock, Search, Sparkles, Tag, User } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SeoHead } from "@/components/seo/seo-head";
import { blogPosts, type BlogPost } from "@/data/blog-posts";

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogPosts.forEach((post) => {
      if (post.tag) tags.add(post.tag);
    });
    return ["All", ...Array.from(tags)];
  }, []);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesTag = selectedTag === "All" || post.tag === selectedTag;
      const matchesSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    });
  }, [searchQuery, selectedTag]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "IMGSEO Image Optimization & SEO Blog",
    "url": "https://imageseo.cc/blog",
    "description": "Expert guides, technical deep-dives, and performance studies on image SEO, Core Web Vitals, WebP conversion, and local search rankings.",
    "publisher": {
      "@type": "Organization",
      "name": "IMGSEO",
      "url": "https://imageseo.cc",
      "logo": {
        "@type": "ImageObject",
        "url": "https://imageseo.cc/favicon.svg"
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SeoHead
        title="Image SEO & Web Performance Blog — Guides & Tutorials | IMGSEO"
        description="In-depth guides, research studies, and actionable tutorials on image SEO, WebP conversion, GPS geotagging, Core Web Vitals (LCP), and Google rankings."
        path="/blog"
        schema={schema}
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-violet-50/50 via-background to-background dark:from-violet-950/20 px-4 py-16 md:py-24">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-bold text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Latest SEO & Performance Articles
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl">
              Image SEO & Web Performance <span className="text-gradient">Blog</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Technical guides, empirical benchmarks, and actionable frameworks to help you optimize visual assets, master Core Web Vitals, and dominate organic search.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-10 max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles on WebP, LCP, geotagging, alt text..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              {/* Tag Chips */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      selectedTag === tag
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Article Grid */}
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-6xl">
            {filteredPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
                <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No articles found</h3>
                <p className="mt-2 text-sm text-slate-500">Try searching for a different keyword or reset the category filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag("All");
                  }}
                  className="mt-6 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    {/* Thumbnail Image */}
                    {post.image && (
                      <a href={`/blog/${post.slug}`} className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 block">
                        <img
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                            <Tag className="h-3 w-3" />
                            {post.tag}
                          </span>
                        </div>
                      </a>
                    )}

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 line-clamp-2">
                        <a href={`/blog/${post.slug}`}>{post.title}</a>
                      </h2>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800/80">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <User className="h-3.5 w-3.5" />
                          {post.author}
                        </span>
                        <a
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-sm font-bold text-violet-600 transition-transform group-hover:translate-x-1 dark:text-violet-400"
                        >
                          Read Article
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
