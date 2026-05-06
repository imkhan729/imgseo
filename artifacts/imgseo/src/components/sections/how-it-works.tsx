import { motion } from "framer-motion";
import { Upload, PenLine, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    gradient: "from-violet-500 to-indigo-600",
    title: "Upload Your Images",
    description: "Drag & drop any image format — JPG, PNG, WebP, GIF, HEIC and more. No file size limit, no account needed.",
  },
  {
    icon: PenLine,
    gradient: "from-indigo-500 to-blue-600",
    title: "Enter Business Details",
    description: "Type your keyword, city, and business name. SEO file names, ALT text, and captions are generated instantly.",
  },
  {
    icon: Download,
    gradient: "from-blue-500 to-cyan-600",
    title: "Download & Upload",
    description: "Download optimised WebP images individually or as a ZIP — with GPS geo-tags embedded if you set a location.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Three steps. No account. No server. Done in under 60 seconds.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connector line */}
          <div className="hidden md:block absolute top-[2.75rem] left-[calc(16.66%+3.5rem)] right-[calc(16.66%+3.5rem)] h-px bg-gradient-to-r from-violet-300 via-indigo-300 to-blue-300 dark:from-violet-800 dark:via-indigo-800 dark:to-blue-800" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`relative mb-6 h-20 w-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl`}>
                  <step.icon className="h-8 w-8 text-white" />
                  <div className="absolute -top-2.5 -right-2.5 h-7 w-7 rounded-full bg-foreground text-background text-xs font-extrabold flex items-center justify-center shadow-md border-2 border-background">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2.5">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
