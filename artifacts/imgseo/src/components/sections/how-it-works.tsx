import { motion } from "framer-motion";
import { Upload, PenLine, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Images",
    description: "Drag & drop your JPG, PNG, or WebP images into the tool. Multiple files supported — no size limit.",
  },
  {
    number: "02",
    icon: PenLine,
    title: "Enter Business Details",
    description: "Type your business name, target keyword, and location. The tool instantly generates SEO-optimized text.",
  },
  {
    number: "03",
    icon: Download,
    title: "Download Optimized Images",
    description: "Download each image individually or grab all of them as a ZIP — with SEO file names already applied.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Three steps. No account. No server. Done in under a minute.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="hidden md:block absolute top-14 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-0.5 bg-border" />
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <step.icon className="h-7 w-7" />
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
