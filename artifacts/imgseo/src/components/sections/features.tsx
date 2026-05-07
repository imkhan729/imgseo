import { motion } from "framer-motion";
import { Minimize2, FileImage, Tag, Type, Files, MapPin } from "lucide-react";

const features = [
  {
    icon: Minimize2,
    gradient: "from-violet-500 to-indigo-600",
    num: "01",
    title: "Smart Compression",
    description: "Reduce file size by up to 90% using HTML5 Canvas — zero server uploads, zero privacy risk. Quality slider gives you full control.",
    wide: true,
  },
  {
    icon: FileImage,
    gradient: "from-blue-500 to-cyan-500",
    num: "02",
    title: "Format Conversion",
    description: "Convert any image to WebP, JPEG, or PNG. WebP delivers 30–40% smaller files for better Core Web Vitals.",
  },
  {
    icon: Tag,
    gradient: "from-emerald-500 to-teal-500",
    num: "03",
    title: "SEO File Naming",
    description: "Auto-generate keyword-rich names like best-plumber-doha.webp that Google reads as strong ranking signals.",
  },
  {
    icon: Type,
    gradient: "from-amber-500 to-orange-500",
    num: "04",
    title: "ALT Text Generator",
    description: "Instantly create descriptive ALT text optimised for Google image search and WCAG accessibility.",
  },
  {
    icon: Files,
    gradient: "from-rose-500 to-pink-500",
    num: "05",
    title: "Bulk ZIP Download",
    description: "Upload dozens of images, process them all, and download a single ZIP — one click.",
  },
  {
    icon: MapPin,
    gradient: "from-purple-500 to-fuchsia-500",
    num: "06",
    title: "GPS Geo Tagging",
    description: "Embed real GPS EXIF coordinates into your JPEG images in-browser. No ExifTool. No third-party uploads.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/25">
      <div className="container mx-auto px-4">

        <div className="text-center mb-14">
          <p className="eyebrow mb-3">What you get</p>
          <h2 className="text-3xl font-black tracking-tight mb-4 md:text-4xl lg:text-5xl">
            Six tools. One browser tab.
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything a local business needs to rank higher in Google image search — no installs, no accounts.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {features.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07, duration: 0.4 }}
              className={`card-3d group relative bg-background rounded-3xl border border-border/60 overflow-hidden p-7 flex flex-col gap-5 ${
                f.wide ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Decorative number */}
              <span className="absolute top-5 right-6 text-6xl font-black text-foreground/4 select-none leading-none" style={{ fontFamily: "var(--app-font-display)" }}>
                {f.num}
              </span>

              {/* Icon */}
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} shadow-lg`}>
                <f.icon className="h-5.5 w-5.5 text-white" />
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2 leading-snug">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>

              {/* Hover accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
