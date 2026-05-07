import { motion } from "framer-motion";
import { Upload, PenLine, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    gradient: "from-violet-500 to-indigo-600",
    shadow: "shadow-violet-500/25",
    num: "01",
    title: "Upload Your Images",
    description: "Drag & drop any image format — JPG, PNG, WebP, GIF, HEIC, AVIF and more. No file size limit, no account needed.",
  },
  {
    icon: PenLine,
    gradient: "from-indigo-500 to-blue-600",
    shadow: "shadow-indigo-500/25",
    num: "02",
    title: "Enter Business Details",
    description: "Type your keyword, city, and business name. SEO file names, ALT text, titles, and captions are generated instantly.",
  },
  {
    icon: Download,
    gradient: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/25",
    num: "03",
    title: "Download & Publish",
    description: "Download optimised images individually or as a ZIP — with GPS geo-tags embedded if you set a business location.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">

        <div className="text-center mb-16">
          <p className="eyebrow mb-3">Simple workflow</p>
          <h2 className="text-3xl font-black tracking-tight mb-4 md:text-4xl lg:text-5xl">
            Three steps. 60 seconds.
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            No account. No server. No waiting. Everything runs right in your browser.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">

          {/* Connector — desktop only */}
          <div className="hidden md:block absolute top-[2.75rem] left-[calc(16.66%+3.5rem)] right-[calc(16.66%+3.5rem)] h-px">
            <div className="w-full h-full bg-gradient-to-r from-violet-300 via-indigo-300 to-blue-300 dark:from-violet-700 dark:via-indigo-700 dark:to-blue-700" />
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className="relative mb-7">
                  <div className={`h-[5.5rem] w-[5.5rem] rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl ${step.shadow}`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  {/* Step badge */}
                  <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-foreground text-background text-xs font-extrabold flex items-center justify-center border-2 border-background shadow-md" style={{ fontFamily: "var(--app-font-display)" }}>
                    {idx + 1}
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA under steps */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-14"
          >
            <a
              href="#tool"
              className="btn-3d shine inline-flex items-center gap-2.5 h-12 px-8 rounded-full text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors"
            >
              Start Optimizing Free →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
