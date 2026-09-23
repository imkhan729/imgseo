import { ArrowRight, Compass, FileArchive, MapPinned, Sparkles } from "lucide-react";
import { getToolPath, type ToolMode } from "@/lib/tool-pages";

const guides: {
  id: ToolMode;
  eyebrow: string;
  title: string;
  icon: typeof FileArchive;
  accent: string;
  badge: string;
  copy: string;
  points: string[];
}[] = [
  {
    id: "webp-converter",
    eyebrow: "Speed-first format",
    title: "Free WebP Converter",
    icon: FileArchive,
    accent: "from-sky-500/20 via-cyan-500/10 to-transparent",
    badge: "text-sky-700 border-sky-300/60 bg-sky-50/80 dark:text-sky-300 dark:border-sky-700/50 dark:bg-sky-950/30",
    copy:
      "Convert heavy JPG and PNG files into clean WebP assets for faster page loads, lighter landing pages, and stronger Core Web Vitals. This free WebP converter helps local businesses publish smaller image files without losing the visual quality they need for service pages, location pages, and Google Business Profile support content.",
    points: [
      "Shrink image weight for faster mobile performance",
      "Prepare cleaner assets for service pages and blog content",
      "Support better user experience and page speed signals",
    ],
  },
  {
    id: "geo-tagger",
    eyebrow: "Local relevance",
    title: "Free Geo Tagger",
    icon: MapPinned,
    accent: "from-amber-500/20 via-orange-500/10 to-transparent",
    badge: "text-amber-700 border-amber-300/60 bg-amber-50/80 dark:text-amber-300 dark:border-amber-700/50 dark:bg-amber-950/30",
    copy:
      "Add latitude and longitude metadata directly into your images with a free geo tagger built for local SEO workflows. When paired with descriptive file names, accurate ALT text, and place-based landing pages, geo-tagged images can strengthen the local context around your brand assets before you upload them to your website or listings.",
    points: [
      "Embed GPS coordinates in-browser with no uploads",
      "Match photos to real business locations and service areas",
      "Combine metadata with filenames and captions for stronger local signals",
    ],
  },
  {
    id: "online-image-compressor",
    eyebrow: "Lean delivery",
    title: "Online Image Compressor",
    icon: Compass,
    accent: "from-emerald-500/20 via-teal-500/10 to-transparent",
    badge: "text-emerald-700 border-emerald-300/60 bg-emerald-50/80 dark:text-emerald-300 dark:border-emerald-700/50 dark:bg-emerald-950/30",
    copy:
      "Use the online image compressor to reduce large photo files before they slow down your homepage, local landing pages, and article templates. Smaller images help pages render faster, reduce bounce risk on mobile, and make it easier to keep visual content SEO-friendly while still looking polished and conversion-ready.",
    points: [
      "Control quality and export format from one tool",
      "Reduce page bloat across galleries, blogs, and hero sections",
      "Keep image SEO workflows fast for teams publishing often",
    ],
  },
];

export function ToolGuides() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,rgba(248,250,252,0.98),rgba(248,250,252,0.78))] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.10),transparent_28%),linear-gradient(180deg,rgba(8,13,23,0.94),rgba(8,13,23,0.82))]" />

      <div className="container relative mx-auto px-4">
        <div className="rounded-[2.4rem] border border-border/60 bg-background/80 p-6 shadow-[0_34px_90px_-46px_rgba(15,23,42,0.42)] backdrop-blur md:p-8 lg:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Tool Stack
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">Three free image SEO tools in one workflow</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              IMGSEO combines a free WebP converter, a free geo tagger, and an online image compressor inside one browser-based workflow. That means you can prep images for search visibility, local relevance, and page speed without sending files to a third-party server.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {guides.map((guide) => (
              <article
                id={guide.id}
                key={guide.id}
                className="relative scroll-mt-24 overflow-hidden rounded-[2rem] border border-border/60 bg-background"
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${guide.accent}`} />
                <div className="relative p-6 md:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] ${guide.badge}`}>
                      {guide.eyebrow}
                    </span>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-background/85">
                      <guide.icon className="h-5 w-5 text-foreground" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-2xl font-black leading-tight">{guide.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{guide.copy}</p>

                  <ul className="mt-5 space-y-2.5">
                    {guide.points.map((point) => (
                      <li key={point} className="rounded-2xl bg-muted/28 px-4 py-3 text-sm text-foreground/88">
                        {point}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={getToolPath(guide.id)}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-foreground"
                  >
                    Open the tool
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
