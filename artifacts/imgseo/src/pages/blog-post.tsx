import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Tag, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  ListOrdered, 
  HelpCircle, 
  Lightbulb, 
  Table as TableIcon 
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

      // Canonical link
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = `${window.location.origin}/blog/${post.slug}`;

      // Article Schema
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.metaDescription,
        "image": `${window.location.origin}${post.image}`,
        "datePublished": post.dateISO,
        "dateModified": post.dateISO,
        "author": {
          "@type": "Organization",
          "name": post.author,
          "url": window.location.origin
        },
        "publisher": {
          "@type": "Organization",
          "name": "IMGSEO",
          "url": window.location.origin,
          "logo": {
            "@type": "ImageObject",
            "url": `${window.location.origin}/favicon.svg`
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${window.location.origin}/blog/${post.slug}`
        }
      };

      let schemaScript = document.getElementById("blog-article-schema") as HTMLScriptElement | null;
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.id = "blog-article-schema";
        schemaScript.type = "application/ld+json";
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(articleSchema, null, 2);

      // FAQ Schema
      if (post.faqs && post.faqs.length > 0) {
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": post.faqs.map((f) => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a
            }
          }))
        };

        let faqScript = document.getElementById("blog-faq-schema") as HTMLScriptElement | null;
        if (!faqScript) {
          faqScript = document.createElement("script");
          faqScript.id = "blog-faq-schema";
          faqScript.type = "application/ld+json";
          document.head.appendChild(faqScript);
        }
        faqScript.textContent = JSON.stringify(faqSchema, null, 2);
      }
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
        <div className="container mx-auto px-4 py-14 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to IMGSEO Tools
            </Link>

            <div className="flex items-center gap-2.5 mb-5">
              <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.pill}`}>{post.tag}</span>
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight mb-5 md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-7">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground border-t border-border/40 pt-5">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> {post.readTime}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> {post.date}</span>
              <span className="flex items-center gap-1.5"><Tag className="h-4 w-4 text-primary" /> {post.author}</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-14 max-w-4xl">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="space-y-12"
          >
            {/* Featured Image */}
            {post.image && (
              <div className="w-full aspect-[2/1] md:aspect-[2.4/1] overflow-hidden rounded-[2rem] border border-border/60 shadow-md bg-muted/20">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  decoding="async"
                  className="w-full h-full object-cover" 
                />
              </div>
            )}

            {/* Key Takeaways Box (AEO / LLM Summary) */}
            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <div className="rounded-3xl border border-violet-200 dark:border-violet-900/60 bg-gradient-to-br from-violet-50/70 via-indigo-50/40 to-background dark:from-violet-950/30 dark:via-indigo-950/20 dark:to-background p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4 text-violet-700 dark:text-violet-300 font-extrabold text-base md:text-lg">
                  <Lightbulb className="h-5 w-5 shrink-0 text-violet-600 dark:text-violet-400" />
                  Key Takeaways & Executive Summary
                </div>
                <ul className="space-y-3">
                  {post.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-foreground/90 leading-relaxed">
                      <CheckCircle2 className="h-5 w-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Table of Contents */}
            <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-base mb-4 text-foreground">
                <ListOrdered className="h-4 w-4 text-primary" />
                Table of Contents
              </div>
              <nav className="grid sm:grid-cols-2 gap-2 text-sm">
                {post.body.map((section, idx) => (
                  <a
                    key={idx}
                    href={`#section-${idx}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 duration-200"
                  >
                    <span className="text-xs font-mono font-bold text-primary/70">{idx + 1}.</span>
                    <span className="line-clamp-1">{section.h2}</span>
                  </a>
                ))}
                {post.faqs && post.faqs.length > 0 && (
                  <a
                    href="#faqs-section"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-1 hover:translate-x-1 duration-200 font-medium"
                  >
                    <span className="text-xs font-mono font-bold text-primary/70">FAQ.</span>
                    <span>Frequently Asked Questions</span>
                  </a>
                )}
              </nav>
            </div>

            {/* Post Body Sections */}
            {post.body.map((section, idx) => (
              <section key={idx} id={`section-${idx}`} className="space-y-5 scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground border-b border-border/40 pb-3">
                  {section.h2}
                </h2>

                {section.paragraphs?.map((p, i) => (
                  <p key={i} className="text-base md:text-lg text-muted-foreground leading-relaxed">{p}</p>
                ))}

                {section.htmlParagraphs?.map((p, i) => (
                  <p 
                    key={`html-${i}`} 
                    className="text-base md:text-lg text-muted-foreground leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: p }} 
                  />
                ))}

                {/* Data Table */}
                {section.table && (
                  <div className="my-6">
                    {section.table.caption && (
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <TableIcon className="h-3.5 w-3.5 text-primary" />
                        {section.table.caption}
                      </p>
                    )}
                    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/60">
                            {section.table.headers.map((h, hi) => (
                              <th key={hi} className="p-3.5 font-bold text-foreground first:pl-5 last:pr-5">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {section.table.rows.map((row, ri) => (
                            <tr key={ri} className="hover:bg-muted/30 transition-colors">
                              {row.map((cell, ci) => (
                                <td key={ci} className="p-3.5 align-top text-muted-foreground first:pl-5 first:font-semibold first:text-foreground last:pr-5">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Code Snippet */}
                {section.code && (
                  <div className="rounded-2xl bg-muted/50 border border-border px-5 py-4 font-mono text-sm text-primary font-bold overflow-x-auto">
                    {section.code}
                  </div>
                )}

                {/* List Items */}
                {section.list && (
                  <ul className="space-y-3 my-4">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-base text-muted-foreground leading-relaxed">
                        <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Pro Tip Callout */}
                {section.tip && (
                  <div className="rounded-2xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 p-5 text-sm md:text-base text-amber-900 dark:text-amber-200 leading-relaxed shadow-sm">
                    <strong className="font-extrabold flex items-center gap-1.5 mb-1.5 text-amber-950 dark:text-amber-100">
                      💡 Pro Tip & Best Practice:
                    </strong>
                    {section.tip}
                  </div>
                )}
              </section>
            ))}

            {/* People Also Ask / FAQ Accordion */}
            {post.faqs && post.faqs.length > 0 && (
              <section id="faqs-section" className="mt-16 pt-10 border-t border-border space-y-6 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">Frequently Asked Questions</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Quick answers based on current search engine guidelines & research</p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-3">
                  {post.faqs.map((faq, fi) => (
                    <AccordionItem 
                      key={fi} 
                      value={`faq-${fi}`} 
                      className="border border-border/80 rounded-2xl px-5 bg-card/60 overflow-hidden"
                    >
                      <AccordionTrigger className="font-bold text-base md:text-lg hover:no-underline py-4 text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed pb-5">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}
          </motion.article>

          {/* In-article Tool CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 rounded-3xl bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-600 p-8 md:p-10 text-white text-center shadow-xl"
          >
            <Zap className="h-10 w-10 mx-auto mb-3 opacity-90" />
            <h3 className="text-2xl md:text-3xl font-black mb-3">Optimize Your Images in Seconds</h3>
            <p className="text-base opacity-90 mb-6 max-w-lg mx-auto">
              Put these image SEO tactics into action right now — free, private, client-side, in under 60 seconds.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="/free-webp-converter"
                className="px-6 py-3 rounded-full bg-white text-violet-700 text-sm font-bold hover:bg-white/90 transition-colors shadow-md"
              >
                WebP Converter →
              </a>
              <a
                href="/free-geo-tagger"
                className="px-6 py-3 rounded-full bg-violet-800/60 hover:bg-violet-800/80 text-white text-sm font-bold transition-colors border border-white/20"
              >
                Free Geo Tagger →
              </a>
              <a
                href="/compress-image-to-kb"
                className="px-6 py-3 rounded-full bg-violet-800/60 hover:bg-violet-800/80 text-white text-sm font-bold transition-colors border border-white/20"
              >
                Compress to KB →
              </a>
            </div>
          </motion.div>

          {/* Related articles */}
          {related.length > 0 && (
            <div className="mt-16 pt-10 border-t border-border">
              <h2 className="text-2xl font-black mb-6">Related Image SEO Guides</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {related.map((rel) => {
                  const relCfg = tagConfig[rel.tag] ?? tagConfig["Image SEO"];
                  return (
                    <a
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      className="card-3d group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card hover:border-primary/40 transition-all hover:shadow-md"
                    >
                      {rel.image && (
                        <div className="h-36 w-full overflow-hidden border-b border-border/60 bg-muted/20">
                          <img 
                            src={rel.image} 
                            alt={rel.title} 
                            loading="lazy" 
                            decoding="async" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`h-1.5 w-1.5 rounded-full ${relCfg.dot}`} />
                          <span className="text-xs font-bold text-muted-foreground">{rel.tag}</span>
                        </div>
                        <h3 className="font-bold text-sm leading-snug mb-3 group-hover:text-primary transition-colors flex-1">{rel.title}</h3>
                        <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-auto">
                          Read Guide <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
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
