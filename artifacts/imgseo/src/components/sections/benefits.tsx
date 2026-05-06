import { motion } from "framer-motion";
import { Gauge, TrendingUp, MapPin, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: Gauge,
    title: "Faster Website Loading",
    body: "Smaller images mean faster page speed — Google's #1 ranking signal. WebP images can be 30–50% smaller than JPG with the same visual quality.",
  },
  {
    icon: TrendingUp,
    title: "Better Google Rankings",
    body: "SEO-optimized file names and ALT text tell Google exactly what your images are about, boosting relevance for local searches.",
  },
  {
    icon: MapPin,
    title: "Improved Local SEO",
    body: "Geo-tagged images and location-specific keywords help your business appear in 'near me' searches and Google Maps results.",
  },
  {
    icon: ShieldCheck,
    title: "No Privacy Risks",
    body: "Your images never leave your device. All processing happens in your browser's memory — deleted the moment you close the tab.",
  },
];

export function Benefits() {
  return (
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center mb-8 md:mb-0"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Why Image SEO Matters for Local Business
            </h2>
            <p className="text-muted-foreground text-lg">
              Most local businesses ignore image SEO entirely. That's your opportunity to outrank competitors with a tool that takes less than two minutes to use.
            </p>
          </motion.div>

          <div className="space-y-5">
            {benefits.map((b, idx) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-4 bg-background rounded-xl p-5 border shadow-sm"
              >
                <div className="shrink-0 mt-0.5 h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
