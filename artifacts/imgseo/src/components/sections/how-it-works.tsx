import { Download, PenLine, Upload } from "lucide-react";

const steps = [
  {
    icon: Upload,
    gradient: "from-violet-500 to-indigo-600",
    shadow: "shadow-violet-500/25",
    title: "Upload Your Images",
    description: "Drag & drop any image format — JPG, PNG, WebP, GIF, HEIC, AVIF and more. No file size limit, no account needed.",
  },
  {
    icon: PenLine,
    gradient: "from-indigo-500 to-blue-600",
    shadow: "shadow-indigo-500/25",
    title: "Enter Business Details",
    description: "Type your keyword, city, and business name. SEO file names, ALT text, titles, and captions are generated instantly.",
  },
  {
    icon: Download,
    gradient: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/25",
    title: "Download & Publish",
    description: "Download optimised images individually or as a ZIP — with GPS geo-tags embedded if you set a business location.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <p className="eyebrow mb-3">Simple workflow</p>
          <h2 className="mb-4 text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">Three steps. 60 seconds.</h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            No account. No server. No waiting. Everything runs right in your browser.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute left-[calc(16.66%+3.5rem)] right-[calc(16.66%+3.5rem)] top-[2.75rem] hidden h-px md:block">
            <div className="h-full w-full bg-gradient-to-r from-violet-300 via-indigo-300 to-blue-300 dark:from-violet-700 dark:via-indigo-700 dark:to-blue-700" />
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="relative mb-7">
                  <div className={`flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-3xl bg-gradient-to-br ${step.gradient} shadow-xl ${step.shadow}`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div
                    className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-foreground text-xs font-extrabold text-background shadow-md"
                    style={{ fontFamily: "var(--app-font-display)" }}
                  >
                    {index + 1}
                  </div>
                </div>

                <h3 className="mb-3 text-lg font-bold">{step.title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <a
              href="#tool"
              className="btn-3d shine inline-flex h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 text-sm font-bold text-white transition-colors hover:from-violet-500 hover:to-indigo-500"
            >
              Start Optimizing Free →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
