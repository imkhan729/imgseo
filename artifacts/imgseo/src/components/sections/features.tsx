import { FileImage, Files, MapPin, Minimize2, Tag, Type } from "lucide-react";

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
    <section id="features" className="bg-muted/25 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <p className="eyebrow mb-3">What you get</p>
          <h2 className="mb-4 text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">Six tools. One browser tab.</h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Everything a local business needs to rank higher in Google image search — no installs, no accounts.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`card-3d group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border/60 bg-background p-7 ${
                feature.wide ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <span
                className="absolute right-6 top-5 select-none text-6xl font-black leading-none text-foreground/4"
                style={{ fontFamily: "var(--app-font-display)" }}
              >
                {feature.num}
              </span>

              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                <feature.icon className="h-5.5 w-5.5 text-white" />
              </div>

              <div>
                <h3 className="mb-2 text-lg font-bold leading-snug">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity duration-200 group-hover:opacity-100`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
