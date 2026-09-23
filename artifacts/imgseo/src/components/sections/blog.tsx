import { Calendar, User, Search, MapPin, Zap, Type, Target, Image as ImageIcon } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import { cn } from "@/lib/utils";

const tagConfig: Record<string, { wash: string; color: string; icon: any }> = {
  "Image SEO": { wash: "from-[#E6F4FA] to-[#F4FAFD]", color: "text-[#4CA7D1]", icon: Search },
  "Google Business": { wash: "from-emerald-100 to-emerald-50", color: "text-emerald-600", icon: MapPin },
  "Performance": { wash: "from-amber-100 to-orange-50", color: "text-orange-500", icon: Zap },
  "ALT Text": { wash: "from-indigo-100 to-indigo-50", color: "text-indigo-500", icon: Type },
  "Strategy": { wash: "from-rose-100 to-rose-50", color: "text-rose-500", icon: Target },
};

function BlogCard({ post }: { post: typeof blogPosts[0] }) {
  const href = `/blog/${post.slug}`;
  const cfg = tagConfig[post.tag] ?? { wash: "from-slate-100 to-slate-50", color: "text-slate-500", icon: ImageIcon };
  const Icon = cfg.icon;

  return (
    <a href={href} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header Image */}
      <div className="h-44 relative bg-slate-100 border-b border-slate-100 overflow-hidden">
        {post.image ? (
          <img 
            src={post.image} 
            alt={post.title} 
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className={cn("absolute inset-0 flex items-center justify-center bg-gradient-to-br", cfg.wash)}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/40 rounded-full blur-xl -ml-5 -mb-5" />
            <div className="relative bg-white/90 p-4 rounded-2xl shadow-sm backdrop-blur-sm group-hover:scale-105 transition-transform duration-300">
              <Icon className={cn("w-8 h-8", cfg.color)} />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
           <h3 className="text-[17px] font-bold text-slate-900 leading-snug group-hover:text-[#4CA7D1] transition-colors line-clamp-2">
             {post.title}
           </h3>
           <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
        </div>
        
        <div className="mb-3">
          <span className="inline-flex items-center rounded-md bg-[#EAF6FA] px-2.5 py-0.5 text-xs font-semibold text-[#4CA7D1]">
            {post.tag}
          </span>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mb-5 flex-1 leading-relaxed">
          {post.excerpt.split('.')[0]}... <span className="text-[#4CA7D1] font-medium">Read More</span>
        </p>

        <div className="flex justify-end mt-auto">
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
            <User className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </a>
  );
}

export function Blog() {
  return (
    <section id="blog" className="relative overflow-hidden py-24 bg-slate-50">
      <div className="container relative mx-auto px-4 max-w-[1200px]">
        
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full bg-[#EAF6FA] px-3 py-1 text-xs font-bold text-[#4CA7D1] mb-4 uppercase tracking-wider">
            Resources
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            From the Blog
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Practical image SEO strategies, optimization guides, and performance tips for local businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

      </div>
    </section>
  );
}
