import { Utensils, Wrench, Home, Scissors, ShoppingBag, Car } from "lucide-react";
import { cn } from "@/lib/utils";

const cases = [
  { 
    icon: Utensils, 
    label: "Restaurants & Cafes", 
    desc: "Geo-tag menu items and interior shots to dominate 'food near me' local map packs.",
    iconColor: "text-orange-500 dark:text-orange-400",
    gradient: "from-orange-500/5 dark:from-orange-500/20 to-transparent",
  },
  { 
    icon: Wrench, 
    label: "Home Services", 
    desc: "Compress and optimize before-and-after project photos for blazing-fast service pages.",
    iconColor: "text-blue-500 dark:text-blue-400",
    gradient: "from-blue-500/5 dark:from-blue-500/20 to-transparent",
  },
  { 
    icon: Home, 
    label: "Real Estate", 
    desc: "Bulk convert massive property listing galleries to WebP without losing visual quality.",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    gradient: "from-emerald-500/5 dark:from-emerald-500/20 to-transparent",
  },
  { 
    icon: Scissors, 
    label: "Salons & Spas", 
    desc: "Add GPS metadata to your portfolio images to attract clients in your specific zip code.",
    iconColor: "text-pink-500 dark:text-pink-400",
    gradient: "from-pink-500/5 dark:from-pink-500/20 to-transparent",
  },
  { 
    icon: ShoppingBag, 
    label: "Retail Shops", 
    desc: "Generate perfectly named product images to rank high in Google Image Search.",
    iconColor: "text-violet-500 dark:text-violet-400",
    gradient: "from-violet-500/5 dark:from-violet-500/20 to-transparent",
  },
  { 
    icon: Car, 
    label: "Auto Dealers", 
    desc: "Process hundreds of inventory photos locally in seconds. No uploading required.",
    iconColor: "text-cyan-500 dark:text-cyan-400",
    gradient: "from-cyan-500/5 dark:from-cyan-500/20 to-transparent",
  },
];

export function UseCases() {
  return (
    <section className="relative py-32 bg-slate-50 dark:bg-[#0B0F19] overflow-hidden transition-colors duration-300">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#4CA7D1]/5 dark:bg-[#4CA7D1]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative mx-auto px-4 max-w-6xl z-10">
        <div className="text-center mb-20">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 mb-6 backdrop-blur-sm uppercase tracking-wider shadow-sm dark:shadow-none">
            Universal Compatibility
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 text-slate-900 dark:text-white">
            Built for Every Local Business
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you run a solo plumbing business or manage a multi-location real estate agency, IMGSEO gives your visual assets the exact data Google needs to rank them higher.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c) => (
            <div
              key={c.label}
              className="group relative rounded-3xl border border-slate-200 bg-white p-8 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04] transition-all duration-500 shadow-sm hover:shadow-md dark:shadow-none"
            >
              {/* Card Hover Glow */}
              <div className={cn("absolute inset-0 rounded-3xl bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", c.gradient)} />
              
              <div className="relative z-10 flex flex-col gap-5">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 dark:bg-white/5 dark:border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-sm dark:shadow-none", c.iconColor)}>
                  <c.icon className="w-6 h-6" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-400 transition-all">
                    {c.label}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {c.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
