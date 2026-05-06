import { motion } from "framer-motion";
import { Utensils, Wrench, Home, Scissors, ShoppingBag, Car } from "lucide-react";

const cases = [
  { icon: Utensils, label: "Restaurants" },
  { icon: Wrench, label: "Plumbers" },
  { icon: Home, label: "Real Estate Agents" },
  { icon: Scissors, label: "Salons & Barbers" },
  { icon: ShoppingBag, label: "Local Shops" },
  { icon: Car, label: "Auto Services" },
];

export function UseCases() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Built for Every Local Business</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Whether you're a solo plumber or a multi-location salon, IMGSEO helps your images rank for what matters.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {cases.map((c, idx) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              className="flex flex-col items-center gap-3 bg-muted/40 border rounded-2xl py-6 px-3 text-center hover:bg-primary/5 hover:border-primary/30 transition-colors"
            >
              <c.icon className="h-7 w-7 text-primary" />
              <span className="text-sm font-medium">{c.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
