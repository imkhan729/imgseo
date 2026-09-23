import type { LucideIcon } from "lucide-react";
import { Compass, FileArchive, Globe2, Layers3, MapPinned, ScanSearch, Sparkles, TimerReset } from "lucide-react";

export type ToolMode = "webp-converter" | "geo-tagger" | "online-image-compressor" | "format-converter" | "compressor" | string;

export interface ToolPageStep {
  title: string;
  body: string;
}

export interface ToolPageConfig {
  mode: ToolMode;
  path: string;
  navLabel?: string;
  shortLabel?: string;
  title?: string;
  h1?: string;
  metaTitle: string;
  description?: string;
  metaDescription?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroBody?: string;
  heroGradient?: string;
  accent?: string;
  accentClass?: string;
  badgeClass?: string;
  icon?: LucideIcon;
  featureBullets?: string[];
  stats?: { label: string; value: string }[];
  sections?: {
    id: string;
    title: string;
    body: string;
    points: string[];
    icon: LucideIcon;
  }[];
  faq?: { question: string; answer: string }[];
  faqs?: { q: string; a: string }[];
  howToSteps?: ToolPageStep[];
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  schemaType?: string;
  defaultTargetFormat?: string;
}

export const toolPageConfigs: Record<ToolMode, ToolPageConfig> = {
  "webp-converter": {
    mode: "webp-converter",
    path: "/free-webp-converter",
    navLabel: "WebP Converter",
    shortLabel: "WebP",
    title: "Free WebP Converter",
    metaTitle: "Free WebP Converter: Convert Image to WebP Online for SEO",
    description:
      "Fast, free WebP converter tool. Convert JPG and PNG images in your browser for lighter files, improved page performance, and a privacy-conscious publishing workflow.",
    heroEyebrow: "Speed-first image workflow",
    heroTitle: "Free WebP converter built to skyrocket Core Web Vitals",
    heroDescription:
      "Turn oversized JPG and PNG files into lightweight WebP assets. Improve page load performance and keep images visually sharp for blogs, service pages, and other content.",
    heroGradient:
      "from-sky-500/20 via-cyan-400/10 to-transparent",
    accentClass:
      "text-sky-700 border-sky-300/60 bg-sky-50/80 dark:text-sky-300 dark:border-sky-700/50 dark:bg-sky-950/30",
    icon: FileArchive,
    featureBullets: [
      "Convert images locally in the browser with no upload queue",
      "Export to WebP, JPEG, or PNG from one simple conversion flow",
      "Download single files or batch exports after conversion",
    ],
    stats: [
      { label: "Best for", value: "Web performance" },
      { label: "Ideal output", value: "Service pages" },
      { label: "Processing", value: "Client-side only" },
    ],
    sections: [
      {
        id: "why-webp",
        title: "Why WebP matters for image SEO",
        body:
          "Image SEO is not just about a keyword in the file name. Search performance and user engagement both improve when images render quickly, especially on mobile connections where oversized JPG files slow down first contentful paint and increase bounce risk.",
        points: [
          "Smaller WebP files help pages feel faster without requiring design compromises.",
          "Lighter media supports stronger Core Web Vitals across service and city landing pages.",
          "Fast-loading images make it easier to scale visual content across blogs, portfolios, and GBP support pages.",
        ],
        icon: Globe2,
      },
      {
        id: "use-webp",
        title: "Where to use a WebP converter",
        body:
          "The highest-value WebP use cases are pages that combine a lot of visuals with commercial intent. Homepage hero images, before-and-after galleries, local landing pages, and FAQ screenshots all benefit when the same visual quality ships at a much smaller file size.",
        points: [
          "Compress hero media before publishing on location pages.",
          "Convert blog illustrations so article templates stay lean.",
          "Prepare multiple sizes for featured cards, testimonials, and gallery blocks.",
        ],
        icon: Layers3,
      },
      {
        id: "workflow-webp",
        title: "A practical WebP workflow for local businesses",
        body:
          "A clean workflow usually starts with file naming, followed by conversion and quality tuning. That gives you an image that is easy for search engines to understand and fast for users to load, which is the balance most local sites miss.",
        points: [
          "Rename images with a descriptive keyword and city before export.",
          "Use WebP for your website and keep JPEG only where legacy compatibility is required.",
          "Batch process fresh uploads so every new page keeps the same performance standard.",
        ],
        icon: TimerReset,
      },
    ],
    faq: [
      {
        question: "Is this WebP converter completely free and unlimited?",
        answer:
          "Yes. The converter runs 100% locally in your browser sandbox, requires no account or subscription, and allows unlimited conversions with zero file queues.",
      },
      {
        question: "Does converting JPG or PNG to WebP reduce image quality?",
        answer:
          "WebP delivers up to 30-35% smaller file sizes compared to standard JPEG while preserving indistinguishable visual sharpness. You can also tune the quality slider to match your exact visual requirements.",
      },
      {
        question: "Are WebP images supported by Google and all modern browsers?",
        answer:
          "Yes. WebP is fully supported across Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, Opera, and iOS/Android mobile browsers (covering over 97% of global web users).",
      },
      {
        question: "How does WebP format improve Google Core Web Vitals and SEO rankings?",
        answer:
          "Because WebP files are significantly lighter, they accelerate Largest Contentful Paint (LCP) and First Contentful Paint (FCP), decreasing mobile bounce rates and providing direct positive ranking signals.",
      },
      {
        question: "Does the WebP converter upload my images to any server?",
        answer:
          "No. All encoding happens in your browser memory using HTML5 Canvas APIs. Your private images and confidential client assets never leave your computer.",
      },
      {
        question: "Can I convert multiple images to WebP in bulk and download a ZIP?",
        answer:
          "Yes. You can drag and drop multiple JPG, PNG, AVIF, or BMP files simultaneously and download all converted WebP files in a single organized ZIP archive.",
      },
    ],
  },
  "geo-tagger": {
    mode: "geo-tagger",
    path: "/free-geo-tagger",
    navLabel: "Free Geo Tagger",
    shortLabel: "Geo Tagger",
    title: "Free Geo Tagger Tool",
    metaTitle: "Free Geo Tagger Tool: Fast Geo Tag Images for Local SEO",
    description:
      "Add GPS metadata to photos with a free browser-based geo tagger. Pin a location, embed latitude and longitude in JPEG EXIF data, and download the result locally.",
    heroEyebrow: "Local relevance workflow",
    heroTitle: "Fast geotagger tool for embedding GPS coordinates in seconds",
    heroDescription:
      "Use this free geo tagger to embed GPS coordinates directly into your image files before you publish them. Create a powerful local SEO signal that aligns photos with real places and service areas for Google Maps dominance.",
    heroGradient:
      "from-amber-500/20 via-orange-400/10 to-transparent",
    accentClass:
      "text-amber-700 border-amber-300/60 bg-amber-50/80 dark:text-amber-300 dark:border-amber-700/50 dark:bg-amber-950/30",
    icon: MapPinned,
    featureBullets: [
      "Search or pin a location and write GPS coordinates into image metadata",
      "Keep geo-tagging private by processing directly in the browser",
      "Pair place data with image SEO text for a stronger local publishing workflow",
    ],
    stats: [
      { label: "Best for", value: "Local SEO" },
      { label: "Ideal output", value: "GBP photos" },
      { label: "Metadata", value: "GPS EXIF" },
    ],
    sections: [
      {
        id: "why-geo",
        title: "Why geo-tagged images matter",
        body:
          "Geo tagging helps tie a photo to a specific place. While it is not a magic ranking switch on its own, it supports a broader local relevance strategy when used alongside accurate landing pages, strong business information, descriptive captions, and consistent location targeting.",
        points: [
          "GPS metadata adds another layer of place-based context to your image files.",
          "Geo-tagged photos fit naturally into Google Business Profile and city-page workflows.",
          "Location-aware images are easier to organize across multiple branches or service zones.",
        ],
        icon: ScanSearch,
      },
      {
        id: "where-geo",
        title: "Best use cases for a geo tagger",
        body:
          "Businesses with physical locations, field teams, or neighborhood-level service coverage get the most value from geo-tagged photos. Storefronts, completed jobs, team-on-site shots, and event coverage all benefit from stronger location context.",
        points: [
          "Tag storefront photos before adding them to your website or listings.",
          "Use location-specific job photos on service and area pages.",
          "Organize multi-location image libraries with distinct coordinates per branch.",
        ],
        icon: Compass,
      },
      {
        id: "workflow-geo",
        title: "How to combine geo-tagging with on-page SEO",
        body:
          "The strongest workflow is to geo-tag the photo, name it clearly, and place it on a page that matches the location intent. That stack gives you metadata, descriptive text, and page-level context working together instead of in isolation.",
        points: [
          "Write a useful file name with service, business, and city terms.",
          "Use matching alt text and captions so metadata and on-page copy point in the same direction.",
          "Keep photo sets organized by location to avoid reusing the same generic image everywhere.",
        ],
        icon: Sparkles,
      },
    ],
    faq: [
      {
        question: "What is image geo tagging and how does it help local SEO?",
        answer:
          "Geo tagging embeds latitude and longitude coordinates into your image's EXIF metadata header. Search engines and map algorithms use this geographical data to verify that your service photos were captured in your target service area or city.",
      },
      {
        question: "Does Google read GPS EXIF coordinates in photos for ranking?",
        answer:
          "Google's image search and local entity algorithms extract and parse EXIF metadata. When combined with localized filenames, ALT text, and matching landing page content, geotagged images provide a cohesive trust signal for local pack rankings.",
      },
      {
        question: "How do I add GPS coordinates to photos for Google Business Profile (GBP)?",
        answer:
          "Use our interactive map to pin your business address, upload your storefront or completed job photos, click embed GPS, and upload the exported JPEG directly to your Google Business Profile photo library.",
      },
      {
        question: "Which image formats support GPS EXIF embedding?",
        answer:
          "JPEG/JPG natively supports the EXIF standard for GPS latitude, longitude, and altitude tags. PNG and WebP formats use different chunk formats, so our tool automatically outputs optimized JPEG files with full EXIF compliance.",
      },
      {
        question: "Are my uploaded photos and business coordinates private?",
        answer:
          "Yes 100%. All EXIF manipulation occurs client-side inside your browser sandbox. No photo or location data is ever transmitted, logged, or saved on our servers.",
      },
      {
        question: "Can I geotag photos in batch and download them all at once?",
        answer:
          "Yes. You can select multiple images, apply a single location pin or coordinates, and download all geotagged images individually or packed into a ZIP file.",
      },
    ],
  },
  "online-image-compressor": {
    mode: "online-image-compressor",
    path: "/free-online-image-compressor",
    navLabel: "Image Compressor",
    shortLabel: "Compressor",
    title: "Free Online Image Compressor",
    metaTitle: "Free Online Image Compressor for SEO: Fast & Private",
    description:
      "Free online image compressor. Reduce image file size without losing quality for faster page speed, mobile optimization, and improved Core Web Vitals scores.",
    heroEyebrow: "Performance-focused compression",
    heroTitle: "Online image compressor for lightning-fast page loading",
    heroDescription:
      "Compress image files in your browser before publishing. Tune quality, preserve visual detail, and create smaller assets for blogs, landing pages, and galleries.",
    heroGradient:
      "from-emerald-500/20 via-teal-400/10 to-transparent",
    accentClass:
      "text-emerald-700 border-emerald-300/60 bg-emerald-50/80 dark:text-emerald-300 dark:border-emerald-700/50 dark:bg-emerald-950/30",
    icon: Compass,
    featureBullets: [
      "Compress images locally without handing files to a third-party service",
      "Balance visual quality and file size with simple export controls",
      "Support faster templates across image-heavy commercial pages",
    ],
    stats: [
      { label: "Best for", value: "Page speed" },
      { label: "Ideal output", value: "Blog and gallery assets" },
      { label: "Control", value: "Quality slider" },
    ],
    sections: [
      {
        id: "why-compress",
        title: "Why image compression matters",
        body:
          "Image compression is one of the fastest ways to improve site speed without changing your design. Large photos add unnecessary weight to the page, which hurts mobile UX, slows rendering, and weakens the quality signals tied to real user performance.",
        points: [
          "Smaller files reduce page bloat and improve loading consistency.",
          "Compression helps keep templates lean as editors add more visuals over time.",
          "A fast image workflow is easier to maintain than retroactive cleanup after pages get heavy.",
        ],
        icon: TimerReset,
      },
      {
        id: "where-compress",
        title: "What to compress first",
        body:
          "The best targets are any images that repeat across templates or appear above the fold. Hero banners, team photos, customer proof sections, article headers, and service illustrations often carry the most weight and the most SEO value at the same time.",
        points: [
          "Start with homepage and service-page hero images.",
          "Compress featured blog images and reusable section graphics.",
          "Reduce gallery and testimonial image weight before publishing in bulk.",
        ],
        icon: Layers3,
      },
      {
        id: "workflow-compress",
        title: "A sustainable image compression workflow",
        body:
          "Compression works best when it is part of publishing, not an afterthought. Teams that process images before upload keep their media library cleaner, their page builder faster, and their site less prone to cumulative performance drift.",
        points: [
          "Set a standard quality range for routine uploads.",
          "Combine compression with format conversion for the biggest savings.",
          "Use consistent export settings so page speed stays predictable across the site.",
        ],
        icon: Globe2,
      },
    ],
    faq: [
      {
        question: "How does this image compressor reduce file size without losing quality?",
        answer:
          "The tool uses intelligent lossy and lossless Canvas compression algorithms to remove redundant color and pixel data that the human eye cannot perceive, drastically reducing byte size while retaining crisp clarity.",
      },
      {
        question: "What is the recommended image file size for website SEO?",
        answer:
          "For optimal page speed and Google PageSpeed Insights scores, aim for banner/hero images under 150KB–200KB, blog illustrations under 100KB, and thumbnails under 30KB.",
      },
      {
        question: "Does compressing images improve Google PageSpeed Insights and Core Web Vitals?",
        answer:
          "Yes. Image weight is the #1 cause of slow Largest Contentful Paint (LCP). Compressing your media can slash total page weight by 60–80%, immediately lifting your PageSpeed scores.",
      },
      {
        question: "Which image formats can I compress with this tool?",
        answer:
          "You can compress JPG, JPEG, PNG, and WebP files. You can also convert between formats during compression (e.g. converting heavy PNG to lightweight WebP).",
      },
      {
        question: "Is there any limit on file quantity or image dimensions?",
        answer:
          "No. Because compression runs locally using your device hardware, there are no artificial file upload limits, subscription barriers, or daily quotas.",
      },
      {
        question: "Are my photos uploaded to any server or stored anywhere?",
        answer:
          "Never. All compression operations run 100% on the client side in your web browser. Your private images are never transferred over the network.",
      },
    ],
  },
};

export const toolPageList = Object.values(toolPageConfigs);

export function getToolConfigByPath(path: string) {
  return toolPageList.find((config) => config.path === path);
}

export function getToolPath(mode: ToolMode) {
  return toolPageConfigs[mode].path;
}
