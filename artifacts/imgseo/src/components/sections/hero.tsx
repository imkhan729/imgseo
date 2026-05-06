import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Optimize Images for Local SEO — <span className="text-primary">100% Free & Private</span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Compress, convert, and generate SEO-ready images directly in your browser. No upload required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto" asChild data-testid="button-hero-cta">
              <a href="#tool">
                Upload Image <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-12 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2"><Lock className="h-4 w-4" /> No Upload Required</div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4" /> 100% Free</div>
            <div className="flex items-center gap-2"><Globe className="h-4 w-4" /> Runs In Your Browser</div>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Private & Secure</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
