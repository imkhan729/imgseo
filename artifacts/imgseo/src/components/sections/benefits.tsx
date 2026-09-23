import { Gauge, MapPin, ShieldCheck, TrendingUp } from "lucide-react";

const benefits = [
  {
    number: "01",
    icon: Gauge,
    accent: "text-violet-700 dark:text-violet-300",
    wash: "from-violet-500/16 via-indigo-500/8 to-transparent",
    ring: "border-violet-300/60 dark:border-violet-700/60",
    title: "Faster Website Loading",
    body: "Lighter image files improve page speed, reduce friction on mobile, and help protect Core Web Vitals where local pages often lose ground.",
  },
  {
    number: "02",
    icon: TrendingUp,
    accent: "text-sky-700 dark:text-sky-300",
    wash: "from-sky-500/16 via-cyan-500/8 to-transparent",
    ring: "border-sky-300/60 dark:border-sky-700/60",
    title: "Better Google Relevance",
    body: "Clear file names, ALT text, and compressed assets make it easier for Google to understand what the image shows and where it matters.",
  },
  {
    number: "03",
    icon: MapPin,
    accent: "text-amber-700 dark:text-amber-300",
    wash: "from-amber-500/16 via-orange-500/8 to-transparent",
    ring: "border-amber-300/60 dark:border-amber-700/60",
    title: "Stronger Local Signals",
    body: "Location-specific naming and GPS metadata reinforce service-area intent for city pages, map visibility, and local business profiles.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    accent: "text-emerald-700 dark:text-emerald-300",
    wash: "from-emerald-500/16 via-teal-500/8 to-transparent",
    ring: "border-emerald-300/60 dark:border-emerald-700/60",
    title: "No Privacy Tradeoff",
    body: "Everything runs inside the browser, so image optimization does not require uploading photos to another platform or third-party server.",
  },
];

export function Benefits() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.10),transparent_28%),linear-gradient(180deg,rgba(245,247,251,0.94),rgba(255,255,255,0.88))] dark:bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.08),transparent_28%),linear-gradient(180deg,rgba(8,13,23,0.92),rgba(8,13,23,0.84))]" />

      <div className="container relative mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="overflow-hidden rounded-[2.3rem] border border-border/60 bg-foreground text-background shadow-[0_34px_90px_-44px_rgba(15,23,42,0.55)]">
            <div className="relative p-6 md:p-8 lg:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
              <div className="relative">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-background/58">Why It Matters</p>
                <h2 className="mt-5 max-w-xl text-3xl font-black tracking-tight md:text-4xl lg:text-[2.9rem]">
                  Why Image SEO Matters for Local Business
                </h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-background/76">
                  Most local competitors still upload raw photos with weak names, heavy file sizes, and no location context. That creates a simple opening: cleaner image SEO can improve visibility without changing your whole site.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/12 bg-white/6 p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-background/52">Competitive Gap</p>
                    <p className="mt-2 text-2xl font-black">Underused</p>
                    <p className="mt-2 text-sm leading-6 text-background/68">Many local businesses ignore image optimization completely.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/12 bg-white/6 p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-background/52">Execution Time</p>
                    <p className="mt-2 text-2xl font-black">Minutes</p>
                    <p className="mt-2 text-sm leading-6 text-background/68">The lift is usually small compared with the ranking signal it adds.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-background shadow-sm">
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${benefit.wash}`} />
                <div className="relative p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-black leading-none text-foreground/10" style={{ fontFamily: "var(--app-font-display)" }}>
                        {benefit.number}
                      </span>
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-background/88 ${benefit.ring}`}>
                        <benefit.icon className={`h-5 w-5 ${benefit.accent}`} />
                      </div>
                    </div>
                    <span className={`inline-flex rounded-full border bg-background/88 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] ${benefit.accent} ${benefit.ring}`}>
                      Impact
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-black leading-tight">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{benefit.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
