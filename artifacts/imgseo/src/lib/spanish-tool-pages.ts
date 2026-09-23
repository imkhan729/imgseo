import { translationsEs } from "@/data/translations-es";
import { ToolPageConfig } from "@/lib/tool-pages";

export const spanishToolConfigs: Record<string, ToolPageConfig> = {
  "webp-converter": {
    path: "/es/free-webp-converter",
    navLabel: translationsEs.tools.webpConverter.navLabel,
    metaTitle: translationsEs.tools.webpConverter.metaTitle,
    metaDescription: translationsEs.tools.webpConverter.metaDescription,
    h1: translationsEs.tools.webpConverter.title,
    heroEyebrow: "Convertidor de imágenes local",
    heroBody: "Convierte imágenes JPG, PNG, AVIF y otros formatos a WebP directamente en tu navegador. Reduce el peso de tus páginas y mejora el Core Web Vitals sin enviar archivos a servidores externos.",
    mode: "format-converter",
    defaultTargetFormat: "WEBP",
    accent: "bg-gradient-to-b from-sky-50 via-background to-background dark:from-sky-950/20",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
    primaryKeyword: "convertidor webp gratis",
    secondaryKeywords: ["convertir imagen a webp", "convertir jpg a webp", "convertir png a webp"],
    schemaType: "WebApplication",
    howToSteps: [
      {
        title: "Selecciona o arrastra tus imágenes",
        body: "Sube imágenes en formato JPG, PNG, BMP o AVIF. El procesamiento se ejecuta íntegramente en tu navegador.",
      },
      {
        title: "Ajusta la calidad WebP",
        body: "Elige el nivel de compresión deseado para lograr el equilibrio ideal entre nitidez visual y reducción de peso.",
      },
      {
        title: "Descarga al instante",
        body: "Guarda tus fotos en formato WebP individualmente o en un archivo ZIP sin límites ni esperas.",
      },
    ],
    faqs: [
      {
        q: "¿Por qué utilizar el formato WebP en lugar de JPG o PNG para SEO?",
        a: "WebP ofrece una compresión hasta un 35% más eficiente que JPEG manteniendo una fidelidad visual idéntica, lo que acelera el Largest Contentful Paint (LCP) y reduce drásticamente el tiempo de carga móvil.",
      },
      {
        q: "¿Se reduce la calidad de la foto al convertirla a WebP?",
        a: "No perceptiblemente. WebP utiliza algoritmos avanzados de codificación predictiva que conservan los detalles finos y degradados mientras eliminan datos innecesarios.",
      },
      {
        q: "¿Es compatible el formato WebP con todos los navegadores modernos y Google?",
        a: "Sí. WebP cuenta con compatibilidad total en Google Chrome, Safari, Firefox, Edge y dispositivos móviles Android e iOS (más del 97% del tráfico web mundial).",
      },
      {
        q: "¿Se suben mis fotos a algún servidor durante la conversión?",
        a: "No. Toda la transformación se realiza mediante la memoria local de tu navegador y Canvas API. Máxima privacidad garantizada sin retención externa.",
      },
      {
        q: "¿Puedo convertir varias imágenes a WebP en lote a la vez?",
        a: "Sí. Puedes arrastrar decenas de imágenes simultáneamente y descargarlas todas juntas en un archivo comprimido ZIP.",
      },
    ],
  },
  "geo-tagger": {
    path: "/es/free-geo-tagger",
    navLabel: translationsEs.tools.geoTagger.navLabel,
    metaTitle: translationsEs.tools.geoTagger.metaTitle,
    metaDescription: translationsEs.tools.geoTagger.metaDescription,
    h1: translationsEs.tools.geoTagger.title,
    heroEyebrow: "Geolocalización EXIF privada",
    heroBody: "Incrusta coordenadas GPS exactas en las cabeceras EXIF de tus fotos JPG de forma 100% confidencial en el navegador. Ideal para mejorar el posicionamiento en Google Maps y Google Business Profile.",
    mode: "geo-tagger",
    accent: "bg-gradient-to-b from-emerald-50 via-background to-background dark:from-emerald-950/20",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    primaryKeyword: "geolocalizar fotos gratis",
    secondaryKeywords: ["etiquetar fotos con gps", "añadir gps a fotos", "editor exif gps"],
    schemaType: "WebApplication",
    howToSteps: [
      {
        title: "Ubica tu negocio en el mapa",
        body: "Busca la dirección o desplaza el marcador interactivo para capturar las coordenadas exactas de latitud y longitud.",
      },
      {
        title: "Carga tus fotografías",
        body: "Arrastra las fotos de tus trabajos, productos o instalaciones que desees geolocalizar.",
      },
      {
        title: "Inyecta los datos GPS y descarga",
        body: "Descarga las imágenes con las etiquetas EXIF GPS perfectamente integradas.",
      },
    ],
    faqs: [
      {
        q: "¿Cómo ayuda la geolocalización de fotos (geotagging) al SEO local?",
        a: "Los metadatos GPS incrustados en la cabecera EXIF proporcionan a Google y a los algoritmos de mapas una confirmación verificable de la ubicación física donde opera tu negocio o servicio.",
      },
      {
        q: "¿Lee Google las coordenadas GPS EXIF para posicionar en Google Maps y GBP?",
        a: "Sí. Google extrae metadatos EXIF en Google Business Profile y búsquedas locales. Al combinarse con nombres de archivo optimizados y páginas de destino locales, refuerza la relevancia geográfica.",
      },
      {
        q: "¿Cómo añadir coordenadas GPS a fotos para Google Business Profile?",
        a: "Selecciona tu ubicación en nuestro mapa, sube tus fotos de trabajos o local comercial, genera las etiquetas GPS y descarga el archivo JPEG listo para subir a tu ficha de negocio.",
      },
      {
        q: "¿Qué formatos de imagen admiten metadatos GPS EXIF?",
        a: "El formato estándar universal para metadatos EXIF GPS es JPEG/JPG. Nuestra herramienta convierte y optimiza automáticamente las fotos en JPEG con compatibilidad EXIF total.",
      },
      {
        q: "¿Son privadas y seguras mis fotos y datos de localización?",
        a: "100% privadas. El procesamiento se ejecuta en el entorno seguro de tu navegador. Ninguna imagen o coordenada se envía a servidores de terceros.",
      },
    ],
  },
  "online-image-compressor": {
    path: "/es/free-online-image-compressor",
    navLabel: translationsEs.tools.compressor.navLabel,
    metaTitle: translationsEs.tools.compressor.metaTitle,
    metaDescription: translationsEs.tools.compressor.metaDescription,
    h1: translationsEs.tools.compressor.title,
    heroEyebrow: "Compresión por lotes en el navegador",
    heroBody: "Comprime imágenes JPG, PNG y WebP al instante. Ajusta el nivel de calidad visual y reduce el peso en KB de tus archivos sin límites de cantidad ni subida a servidores.",
    mode: "compressor",
    accent: "bg-gradient-to-b from-violet-50 via-background to-background dark:from-violet-950/20",
    badgeClass: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
    primaryKeyword: "comprimir imagenes online",
    secondaryKeywords: ["reducir tamaño de foto", "comprimir fotos gratis", "reducir kb de imagen"],
    schemaType: "WebApplication",
    howToSteps: [
      {
        title: "Arrastra tus imágenes",
        body: "Selecciona tantas fotos como desees sin preocuparte por límites de peso.",
      },
      {
        title: "Personaliza la calidad",
        body: "Usa el deslizador de calidad para encontrar la relación de compresión perfecta.",
      },
      {
        title: "Descarga en un clic",
        body: "Descarga individualmente o en un paquete ZIP ordenado.",
      },
    ],
    faqs: [
      {
        q: "¿Cómo reduce este compresor el tamaño en KB sin perder calidad visual?",
        a: "Utiliza algoritmos inteligentes de compresión en Canvas que eliminan información redundante de píxeles imperceptible para el ojo humano, reduciendo drásticamente el peso del archivo.",
      },
      {
        q: "¿Cuál es el peso recomendado en KB para imágenes de un sitio web?",
        a: "Para banners y cabeceras principales, se recomienda mantener el peso por debajo de 150KB–200KB; para fotos de artículos y galerías, entre 50KB y 100KB; y para miniaturas, menos de 30KB.",
      },
      {
        q: "¿Mejora la compresión de imágenes la puntuación en Google PageSpeed Insights?",
        a: "Sí. Las imágenes pesadas son la principal causa de retraso en la métrica Largest Contentful Paint (LCP). Comprimir tus fotos puede reducir el peso total de la página hasta un 80%.",
      },
      {
        q: "¿Existe límite en la cantidad de fotos o tamaño que puedo comprimir?",
        a: "No hay límites. La compresión corre localmente con el hardware de tu propio dispositivo, sin suscripciones, marcas de agua ni colas de espera.",
      },
      {
        q: "¿Es seguro comprimir fotos confidenciales de clientes?",
        a: "Totalmente seguro. Tus fotos nunca salen de tu ordenador ni se transfieren por internet.",
      },
    ],
  },
};
