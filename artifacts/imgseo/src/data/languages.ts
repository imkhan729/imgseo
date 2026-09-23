export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  dir: "ltr" | "rtl";
  flag: string;
  isDefault?: boolean;
}

export const supportedLanguages: LanguageConfig[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    dir: "ltr",
    flag: "🇺🇸",
    isDefault: true,
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    dir: "ltr",
    flag: "🇪🇸",
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    dir: "ltr",
    flag: "🇧🇷",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    dir: "rtl",
    flag: "🇸🇦",
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    dir: "ltr",
    flag: "🇮🇩",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    dir: "ltr",
    flag: "🇮🇳",
  },
];

export const defaultLanguage = supportedLanguages[0];

export const coreRoutes = [
  "",
  "free-webp-converter",
  "jpg-to-webp",
  "png-to-webp",
  "free-geo-tagger",
  "free-online-image-compressor",
  "compress-jpg",
  "compress-image-to-kb",
  "image-seo",
  "privacy",
  "terms",
];

export function getLanguageFromPath(pathname: string): LanguageConfig {
  const cleanPath = pathname.replace(/^\//, "");
  const segments = cleanPath.split("/");
  const firstSegment = segments[0];

  const matched = supportedLanguages.find((lang) => lang.code === firstSegment && !lang.isDefault);
  return matched || defaultLanguage;
}

export function getEquivalentPath(currentPath: string, targetLangCode: string): string {
  const currentLang = getLanguageFromPath(currentPath);
  let baseRoute = currentPath;

  if (currentLang.code !== "en") {
    // Remove the /es, /pt, etc. prefix
    baseRoute = currentPath.replace(new RegExp(`^/${currentLang.code}`), "") || "/";
  }

  // Ensure leading slash
  if (!baseRoute.startsWith("/")) {
    baseRoute = `/${baseRoute}`;
  }

  if (targetLangCode === "en") {
    return baseRoute;
  }

  return baseRoute === "/" ? `/${targetLangCode}` : `/${targetLangCode}${baseRoute}`;
}
