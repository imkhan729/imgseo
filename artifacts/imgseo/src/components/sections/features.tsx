import { motion } from "framer-motion";
import { Minimize2, FileImage, Tag, Type, Files, MapPin } from "lucide-react";

const features = [
  {
    icon: Minimize2,
    gradient: "from-violet-500 to-indigo-600",
    title: "Smart Compression",
    description: "Reduce file size by up to 90% using HTML5 Canvas — zero server uploads, zero privacy risk.",
  },
  {
    icon: FileImage,
    gradient: "from-blue-500 to-cyan-500",
    title: "Format Conversion",
    description: "Convert any image to WebP, JPEG, or PNG. WebP delivers 30–40% smaller files for better Core Web Vitals.",
  },
  {
    icon: Tag,
    gradient: "from-emerald-500 to-teal-500",
    title: "SEO File Naming",
    description: "Auto-generate keyword-rich names like best-plumber-doha.webp that Google reads as strong ranking signals.",
  },
  {
    icon: Type,
    gradient: "from-amber-500 to-orange-500",
    title: "ALT Text Generator",
    description: "Instantly create descriptive ALT text optimized for Google image search and WCAG accessibility.",
  },
  {
    icon: Files,
    gradient: "from-rose-500 to-pink-500",
    title: "Bulk Processing",
    description: "Upload dozens of images at once, process them all in parallel, and download a single ZIP.",
  },
  {
    icon: MapPin,
    gradient: "from-purple-500 to-fuchsia-500",
    title: "GPS Geo Tagging",
    description: "Embed real GPS EXIF coordinates into your images in-browser — no third-party tools needed.",
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
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
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="card-3d group relative bg-background border rounded-2xl p-6 cursor-default"
            >
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} shadow-md`}>
                <f.icon className="h-5.5 w-5.5 text-white" />
              </div>
              <h3 className="font-bold text-base mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              {/* subtle gradient shine on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/3 to-transparent" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
