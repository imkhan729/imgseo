import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Benefits } from "@/components/sections/benefits";
import { FAQ } from "@/components/sections/faq";
import { UseCases } from "@/components/sections/use-cases";
import { SEOContent } from "@/components/sections/seo-content";
import { ToolGuides } from "@/components/sections/tool-guides";
import { SeoHead } from "@/components/seo/seo-head";

const CompleteOptimizer = lazy(() =>
  import("@/components/tool/complete-optimizer").then((module) => ({ default: module.CompleteOptimizer })),
);
const Blog = lazy(() => import("@/components/sections/blog").then((module) => ({ default: module.Blog })));

export default function Home() {
  const toolSectionRef = useRef<HTMLDivElement>(null);
  const blogSectionRef = useRef<HTMLDivElement>(null);
  const [shouldLoadTool, setShouldLoadTool] = useState(false);
  const [shouldLoadBlog, setShouldLoadBlog] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#tool") {
      setShouldLoadTool(true);
      return;
    }

    const toolSection = toolSectionRef.current;
    if (!toolSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoadTool(true);
        observer.disconnect();
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(toolSection);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const blogSection = blogSectionRef.current;
    if (!blogSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoadBlog(true);
        observer.disconnect();
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(blogSection);
    return () => observer.disconnect();
  }, []);

  return (
    <div id="top" className="flex min-h-screen flex-col bg-slate-50">
      <SeoHead
        title="Free Image SEO Tools: Compress, Convert & Geotag | IMGSEO"
        description="Use free browser-based tools to compress images, convert to WebP, and add GPS metadata. Processing happens locally for a privacy-conscious image SEO workflow."
        path="/"
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <div id="tool" ref={toolSectionRef} className="scroll-mt-16 px-4 py-8 relative z-10 -mt-16">
          {shouldLoadTool ? (
            <Suspense fallback={<ToolSectionSkeleton />}>
              <CompleteOptimizer />
            </Suspense>
          ) : (
            <ToolSectionSkeleton />
          )}
        </div>
        <Features />
        <HowItWorks />
        <ToolGuides />
        <Benefits />
        <UseCases />
        <SEOContent />
        <FAQ />
        <div id="blog" ref={blogSectionRef} className="scroll-mt-16">
          {shouldLoadBlog ? (
            <Suspense fallback={<SectionSkeleton heightClassName="h-96" />}>
              <Blog />
            </Suspense>
          ) : (
            <SectionSkeleton heightClassName="h-96" />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ToolSectionSkeleton() {
  return (
    <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm md:p-8">
      <div className="mb-5 space-y-2">
        <div className="h-3 w-28 rounded-full bg-slate-200" />
        <div className="h-8 max-w-md rounded-full bg-slate-200" />
        <div className="h-4 max-w-2xl rounded-full bg-slate-100" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="h-10 rounded-2xl bg-slate-200" />
          <div className="h-10 rounded-2xl bg-slate-200" />
          <div className="h-40 rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

function SectionSkeleton({ heightClassName }: { heightClassName: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 space-y-3 text-center">
        <div className="mx-auto h-3 w-28 rounded-full bg-slate-200" />
        <div className="mx-auto h-8 max-w-md rounded-full bg-slate-200" />
        <div className="mx-auto h-4 max-w-2xl rounded-full bg-slate-100" />
      </div>
      <div className={`rounded-3xl bg-slate-100 ${heightClassName}`} />
    </div>
  );
}
