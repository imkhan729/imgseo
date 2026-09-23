import { FileSearch, Gauge, Image, MapPin, Sparkles } from "lucide-react";

const pillars = [
  {
    number: "01",
    icon: FileSearch,
    accent: "text-violet-700 dark:text-violet-300",
    wash: "from-violet-500/16 via-indigo-500/8 to-transparent",
    ring: "border-violet-300/60 dark:border-violet-700/50",
    title: "Name Images Like Search Terms",
    summary: "Google reads the file name before it reads your page. Put the service and place name first.",
    points: [
      "Use lowercase words separated with hyphens",
      "Lead with the service keyword, then location",
      "Add business name only if it helps clarity",
    ],
    exampleLabel: "Example filename",
    example: "emergency-plumber-doha-qatar-quickfix.webp",
  },
  {
    number: "02",
    icon: Image,
    accent: "text-sky-700 dark:text-sky-300",
    wash: "from-sky-500/16 via-cyan-500/8 to-transparent",
    ring: "border-sky-300/60 dark:border-sky-700/50",
    title: "Write ALT Text for Humans First",
    summary: "Describe what is actually in the image, then naturally connect it to the service and place.",
    points: [
      "Keep it plain, specific, and readable",
      "Mention the business type and location once",
      "Avoid repeating the same keyword unnaturally",
    ],
    exampleLabel: "Example ALT text",
    example: '"Emergency plumber repairing a kitchen pipe in Doha, Qatar"',
  },
  {
    number: "03",
    icon: Gauge,
    accent: "text-emerald-700 dark:text-emerald-300",
    wash: "from-emerald-500/16 via-teal-500/8 to-transparent",
    ring: "border-emerald-300/60 dark:border-emerald-700/50",
    title: "Compress Before You Publish",
    summary: "Fast-loading pages rank better locally because heavy image payloads drag down Core Web Vitals.",
    points: [
      "Export in WebP for smaller public-facing images",
      "Aim for roughly 70-85% quality on most photos",
      "Keep common page images lean enough to load fast",
    ],
    exampleLabel: "Compression target",
    example: "2 MB original -> 180 KB WebP",
  },
  {
    number: "04",
    icon: MapPin,
    accent: "text-amber-700 dark:text-amber-300",
    wash: "from-amber-500/16 via-orange-500/8 to-transparent",
    ring: "border-amber-300/60 dark:border-amber-700/50",
    title: "Attach Location Signals",
    summary: "Geo metadata reinforces place relevance when you are optimizing images for local intent and GBP usage.",
    points: [
      "Embed GPS coordinates before download",
      "Use the actual business location when possible",
      "Pair geo data with strong filenames and ALT text",
    ],
    exampleLabel: "Example GPS data",
    example: "25.285447, 51.531040",
  },
];

export function SEOContent() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.10),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.88))] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_26%),linear-gradient(180deg,rgba(8,13,23,0.92),rgba(8,13,23,0.84))]" />

      <div className="container relative mx-auto px-4">
        <div className="rounded-[2.4rem] border border-border/60 bg-background/78 p-6 shadow-[0_34px_90px_-46px_rgba(15,23,42,0.42)] backdrop-blur md:p-8 lg:p-10">
          <div className="grid gap-8 border-b border-border/60 pb-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Local SEO Playbook
              </div>
              <h2 className="mt-5 max-w-3xl text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">Image SEO for Local Business</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                The highest-impact image signals are simple: better names, better ALT text, smaller files, and stronger local relevance. This section turns them into a clean operating system your team can repeat.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-border/60 bg-muted/30 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Framework</p>
                <p className="mt-2 text-lg font-black">4 signals</p>
                <p className="mt-1 text-sm text-muted-foreground">Name, describe, compress, geo-tag.</p>
              </div>
              <div className="rounded-[1.5rem] border border-border/60 bg-muted/30 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Best Output</p>
                <p className="mt-2 text-lg font-black">Compressed WebP</p>
                <p className="mt-1 text-sm text-muted-foreground">Lighter pages and cleaner delivery.</p>
              </div>
              <div className="rounded-[1.5rem] border border-border/60 bg-muted/30 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Best Use</p>
                <p className="mt-2 text-lg font-black">Local landing pages</p>
                <p className="mt-1 text-sm text-muted-foreground">Service, city, and GBP-oriented assets.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-background">
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pillar.wash} opacity-80`} />
                <div className="relative p-6 md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-black leading-none text-foreground/12" style={{ fontFamily: "var(--app-font-display)" }}>
                        {pillar.number}
                      </div>
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-background/85 ${pillar.ring}`}>
                        <pillar.icon className={`h-5 w-5 ${pillar.accent}`} />
                      </div>
                    </div>
                    <span className={`inline-flex rounded-full border bg-background/85 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] ${pillar.accent} ${pillar.ring}`}>
                      Priority
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-black leading-tight">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.summary}</p>

                  <ul className="mt-5 grid gap-2.5">
                    {pillar.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 rounded-2xl bg-background/78 px-4 py-3 text-sm text-foreground/88">
                        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${pillar.accent.replace("text-", "bg-").replace(" dark:bg-", "")}`} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 rounded-[1.4rem] border border-border/60 bg-foreground px-4 py-4 text-background">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-background/60">{pillar.exampleLabel}</p>
                    <p className="mt-2 break-all font-mono text-sm text-background/88">{pillar.example}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
