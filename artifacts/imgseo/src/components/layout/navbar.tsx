import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTheme } from "next-themes";
import { Moon, Sun, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">IMGSEO</span>
        </div>
        
        <nav className="hidden md:flex gap-6">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} data-testid="button-theme-toggle">
            {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button asChild data-testid="button-nav-cta">
            <a href="#tool">Open Tool</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
