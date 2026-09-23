import { useEffect } from "react";

interface SeoHeadProps {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
  schema?: Record<string, any> | null;
}

function upsertMeta(selector: string, create: () => HTMLMetaElement, content: string) {
  const el = document.head.querySelector<HTMLMetaElement>(selector) ?? create();
  el.setAttribute("content", content);
}

export function SeoHead({ title, description, path = "/", noindex = false, schema = null }: SeoHeadProps) {
  useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const ogTitleMeta = document.head.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const ogDescriptionMeta = document.head.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const twitterTitleMeta = document.head.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    const twitterDescriptionMeta = document.head.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
    const twitterCardMeta = document.head.querySelector<HTMLMetaElement>('meta[name="twitter:card"]');
    const canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const robotsMeta = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');

    const previousDescription = descriptionMeta?.getAttribute("content") ?? "";
    const previousOgTitle = ogTitleMeta?.getAttribute("content") ?? "";
    const previousOgDescription = ogDescriptionMeta?.getAttribute("content") ?? "";
    const previousTwitterTitle = twitterTitleMeta?.getAttribute("content") ?? "";
    const previousTwitterDescription = twitterDescriptionMeta?.getAttribute("content") ?? "";
    const previousTwitterCard = twitterCardMeta?.getAttribute("content") ?? "";
    const previousCanonical = canonicalLink?.getAttribute("href") ?? "";
    const previousRobots = robotsMeta?.getAttribute("content");

    document.title = title;

    upsertMeta(
      'meta[name="description"]',
      () => {
        const meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
        return meta;
      },
      description,
    );

    upsertMeta(
      'meta[property="og:title"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:title");
        document.head.appendChild(meta);
        return meta;
      },
      title,
    );

    upsertMeta(
      'meta[property="og:description"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:description");
        document.head.appendChild(meta);
        return meta;
      },
      description,
    );

    upsertMeta(
      'meta[name="twitter:title"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "twitter:title");
        document.head.appendChild(meta);
        return meta;
      },
      title,
    );

    upsertMeta(
      'meta[name="twitter:description"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "twitter:description");
        document.head.appendChild(meta);
        return meta;
      },
      description,
    );

    upsertMeta(
      'meta[name="twitter:card"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "twitter:card");
        document.head.appendChild(meta);
        return meta;
      },
      "summary_large_image",
    );

    const canonicalHref = typeof window === "undefined" ? path : new URL(path, window.location.origin).toString();
    const link = canonicalLink ?? document.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", canonicalHref);
    if (!canonicalLink) document.head.appendChild(link);

    if (noindex) {
      upsertMeta(
        'meta[name="robots"]',
        () => {
          const meta = document.createElement("meta");
          meta.name = "robots";
          document.head.appendChild(meta);
          return meta;
        },
        "noindex, nofollow"
      );
    } else if (robotsMeta) {
      robotsMeta.remove();
    }

    let schemaScript: HTMLScriptElement | null = null;
    if (schema) {
      schemaScript = document.head.querySelector<HTMLScriptElement>('script[id="dynamic-schema"]');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.type = "application/ld+json";
        schemaScript.id = "dynamic-schema";
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    }

    return () => {
      document.title = previousTitle;
      if (descriptionMeta) descriptionMeta.setAttribute("content", previousDescription);
      if (ogTitleMeta) ogTitleMeta.setAttribute("content", previousOgTitle);
      if (ogDescriptionMeta) ogDescriptionMeta.setAttribute("content", previousOgDescription);
      if (twitterTitleMeta) twitterTitleMeta.setAttribute("content", previousTwitterTitle);
      if (twitterDescriptionMeta) twitterDescriptionMeta.setAttribute("content", previousTwitterDescription);
      if (twitterCardMeta) twitterCardMeta.setAttribute("content", previousTwitterCard);
      if (canonicalLink) canonicalLink.setAttribute("href", previousCanonical);
      
      const currentRobots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
      if (previousRobots) {
        if (!currentRobots) {
          const m = document.createElement("meta");
          m.name = "robots";
          document.head.appendChild(m);
          m.setAttribute("content", previousRobots);
        } else {
          currentRobots.setAttribute("content", previousRobots);
        }
      } else if (currentRobots) {
        currentRobots.remove();
      }

      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [description, path, title, noindex, schema]);

  return null;
}
