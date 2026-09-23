import { translationsEs } from "@/data/translations-es";
import { ToolPageConfig } from "@/lib/tool-pages";
import { FileArchive, Globe2, Layers3, MapPinned, Sparkles, Zap, ShieldCheck } from "lucide-react";

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
    icon: FileArchive,
    primaryKeyword: "convertidor webp gratis",
    secondaryKeywords: ["convertir imagen a webp", "convertir jpg a webp", "convertir png a webp"],
    schemaType: "WebApplication",
    featureBullets: [
      "Conversión 100% local en tu navegador sin límite de archivos",
      "Exporta a WebP de última generación conservando transparencia alfa",
      "Ahorra hasta un 80% de ancho de banda móvil y acelera la carga",
    ],
    stats: [
      { label: "Ahorro de peso", value: "Hasta -80%" },
      { label: "Procesamiento", value: "100% en navegador" },
      { label: "Compatibilidad", value: "97%+ global" },
    ],
    sections: [
      {
        id: "por-que-webp",
        title: "¿Por qué WebP es imprescindible para el SEO y la velocidad web?",
        body: "Google recomienda oficialmente el uso de formatos de imagen de última generación como WebP. Las imágenes tradicionales en JPG y PNG suelen representar más del 65% del peso total de una página web, lo que ralentiza el tiempo de carga en dispositivos móviles y perjudica las métricas Core Web Vitals (especialmente Largest Contentful Paint o LCP).",
        points: [
          "Archivos hasta un 35% más ligeros que JPEG con la misma calidad visual percibida.",
          "Soporte nativo para fondos transparentes (canal alfa) con un 70% menos de peso que los archivos PNG-24.",
          "Mejora directa de las puntuaciones de velocidad en Google PageSpeed Insights y reducción del porcentaje de rebote.",
        ],
        icon: Globe2,
      },
      {
        id: "casos-uso",
        title: "Dónde aplicar la optimización con formato WebP",
        body: "Cualquier sitio web con tráfico comercial o editorial se beneficia de WebP: tiendas online (Shopify, WooCommerce), blogs de WordPress, páginas de aterrizaje locales y galerías de productos.",
        points: [
          "Banners principales y fotos hero para lograr un LCP inferior a 2,5 segundos.",
          "Imágenes de catálogos y tiendas online para acelerar la navegación móvil y aumentar conversiones.",
          "Ilustraciones y capturas de pantalla en artículos para mantener un consumo de datos ligero.",
        ],
        icon: Layers3,
      },
    ],
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
    icon: MapPinned,
    primaryKeyword: "geolocalizar fotos gratis",
    secondaryKeywords: ["etiquetar fotos con gps", "añadir gps a fotos", "editor exif gps"],
    schemaType: "WebApplication",
    featureBullets: [
      "Incrusta latitud y longitud GPS directamente en los metadatos EXIF de tus fotos",
      "Mapa interactivo de precisión para buscar cualquier dirección o área de servicio",
      "100% privado en memoria del navegador: sin subida de fotos a servidores remotos",
    ],
    stats: [
      { label: "Impacto Local", value: "Google Pack 3" },
      { label: "Privacidad", value: "0 Envíos a nube" },
      { label: "Formato", value: "JPEG / EXIF" },
    ],
    sections: [
      {
        id: "importancia-geotagging",
        title: "¿Cómo impulsa el geoetiquetado de fotos el SEO local?",
        body: "Cuando Google rastrea tu ficha de Google Business Profile o tus páginas de aterrizaje locales, analiza múltiples señales de relevancia geográfica. Las imágenes con coordenadas GPS reales en su cabecera EXIF corroboran físicamente la ubicación de tus trabajos, tiendas y proyectos.",
        points: [
          "Verificación tangible de tu área de servicio ante los algoritmos de Google Maps.",
          "Mayor probabilidad de aparecer en el codiciado Local 3-Pack de búsquedas móviles.",
          "Estructuración de un clúster geográfico coherente combinando coordenadas, nombres de archivo y páginas de destino.",
        ],
        icon: Globe2,
      },
      {
        id: "mejores-practicas-locales",
        title: "Recomendaciones estratégicas para negocios de servicios",
        body: "Para fontaneros, electricistas, reformas o cerrajeros, no geolocalices todas las fotos en la misma oficina. Etiqueta cada fotografía en el barrio o municipio donde realmente se completó el servicio para expandir tu radio de visibilidad orgánica.",
        points: [
          "Geolocaliza de 3 a 5 fotos reales cada semana de trabajos recientes en tu zona.",
          "Combina las coordenadas GPS con nombres de archivo estructurados (ej. 'reforma-banos-madrid-norte.jpg').",
          "Publica las fotos geoetiquetadas tanto en Google Business Profile como en tu web.",
        ],
        icon: Sparkles,
      },
    ],
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
    icon: Zap,
    primaryKeyword: "comprimir imagenes online",
    secondaryKeywords: ["reducir tamaño de foto", "comprimir fotos gratis", "reducir kb de imagen"],
    schemaType: "WebApplication",
    featureBullets: [
      "Compresión por lotes ultrarrápida con descarga instantánea en archivo ZIP",
      "Control deslizante de calidad para equilibrar reducción de KB y nitidez perfecta",
      "Sin límites de tamaño, sin marcas de agua y 100% confidencial en tu dispositivo",
    ],
    stats: [
      { label: "Reducción", value: "70% a 90%" },
      { label: "Velocidad", value: "Instantánea" },
      { label: "Seguridad", value: "100% Local" },
    ],
    sections: [
      {
        id: "beneficios-compresion",
        title: "¿Por qué es crucial comprimir imágenes para mejorar el posicionamiento web?",
        body: "El algoritmo de Google clasifica la velocidad de carga de la página como un factor directo de posicionamiento. Cada segundo de retraso en la carga móvil incrementa la tasa de rebote en más de un 32% y reduce las tasas de conversión en tiendas online.",
        points: [
          "Reducción de hasta un 85% en el peso de fotos fotográficas JPEG y gráficos PNG.",
          "Carga inmediata en conexiones móviles lentas 3G y 4G.",
          "Menor consumo de transferencia de datos y ancho de banda en tu servidor de hosting.",
        ],
        icon: Globe2,
      },
      {
        id: "estandares-kb",
        title: "Límites y pesos recomendados en KB por tipo de imagen",
        body: "Para maximizar la experiencia de usuario y pasar las auditorías de Google PageSpeed Insights con 90+ puntos:",
        points: [
          "Imágenes hero y portadas: mantener por debajo de 150 KB.",
          "Fotografías de artículos y productos: entre 40 KB y 90 KB.",
          "Logotipos, iconos y miniaturas: menos de 25 KB.",
        ],
        icon: ShieldCheck,
      },
    ],
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

