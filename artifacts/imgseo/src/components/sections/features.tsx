import { motion } from "framer-motion";
import { Minimize2, FileImage, Tag, Type, Files, MapPin } from "lucide-react";

const features = [
  {
    icon: Minimize2,
    title: "Image Compression",
    description: "Reduce file size by up to 90% using HTML5 Canvas — no quality loss for your business images.",
  },
  {
    icon: FileImage,
    title: "Format Conversion",
    description: "Convert JPG and PNG to next-gen WebP format for faster page loads and better Core Web Vitals.",
  },
  {
    icon: Tag,
    title: "SEO File Naming",
    description: "Auto-generate keyword-rich file names like best-plumber-doha-qatar.webp that signal relevance to Google.",
  },
  {
    icon: Type,
    title: "ALT Text Generator",
    description: "Instantly create descriptive ALT text optimized for Google image search and accessibility.",
  },
  {
    icon: Files,
    title: "Bulk Processing",
    description: "Upload dozens of images at once, process them all, and download as a single ZIP file.",
  },
  {
    icon: MapPin,
    title: "Geo Tag Helper",
    description: "Generate location metadata for your images to boost visibility in local Google search results.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Everything You Need to Rank Locally
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Six powerful tools in one — all running privately inside your browser.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group relative bg-background border rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
