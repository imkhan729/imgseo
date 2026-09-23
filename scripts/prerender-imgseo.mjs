import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { existsSync } from "node:fs";

const outputDir = existsSync(join(process.cwd(), "artifacts", "imgseo", "dist", "public"))
  ? join(process.cwd(), "artifacts", "imgseo", "dist", "public")
  : join(process.cwd(), "dist", "public");
const origin = "https://imageseo.cc";

const blogPosts = [
  {
    slug: "free-geo-tagger-fast-location-seo",
    title: "How to Use a Free Geo Tagger to Dominate Local SEO Fast",
    metaTitle: "Free Geo Tagger Tool: Fast Geo Tag Images for Local SEO | IMGSEO",
    description: "Learn how to embed GPS coordinates into your photos with a browser-based free geo tag tool to provide verifiable location metadata for your business.",
    dateISO: "2025-05-15",
    body: `
      <article>
        <h1>How to Use a Free Geo Tagger to Dominate Local SEO Fast</h1>
        <p>Adding GPS metadata to your images is a practical local SEO signal. Learn how to use a free geo tagger tool to process images instantly and securely in your browser.</p>
        <section>
          <h2>Why Every Local Business Needs a Fast Geo Tag Workflow</h2>
          <p>When you upload an image to Google Business Profile or your website, Google analyzes available data. One trust signal for local relevance is GPS metadata (EXIF data). If you operate a local service in a specific city, embedding accurate location coordinates provides authentic geographic context.</p>
        </section>
        <section>
          <h2>The Benefits of Using a Free Geo Tagger</h2>
          <p>IMGSEO provides an instant, map-driven interface that embeds accurate location coordinates directly into your photo's EXIF metadata. Because this is a client-side tool, your images are never uploaded to a remote server.</p>
        </section>
        <section>
          <h2>How to Geo Tag Your Images for Maximum SEO Impact</h2>
          <ol>
            <li>Find your exact business location or service area on the interactive map.</li>
            <li>Drop the pin to capture the precise latitude and longitude coordinates.</li>
            <li>Upload your local business photos into the free geo tagger interface.</li>
            <li>Embed GPS coordinates directly into the image EXIF header.</li>
            <li>Download your geo-tagged JPEG files locally.</li>
          </ol>
        </section>
      </article>
    `
  },
  {
    slug: "image-file-names-local-seo",
    title: "Why Image File Names Are the #1 Ignored Local SEO Ranking Factor",
    metaTitle: "Image File Naming for Local SEO: Rank Higher in Google Maps & Image Search | IMGSEO",
    description: "Boost your local search rankings by optimizing image file names. Learn the proven SEO naming formula to outrank local competitors on Google.",
    dateISO: "2025-05-01",
    body: `
      <article>
        <h1>Why Image File Names Are the #1 Ignored Local SEO Ranking Factor</h1>
        <p>Most businesses use generic file names like IMG_4392.jpg. Discover the exact SEO naming structure to increase organic local traffic and Google Maps visibility.</p>
        <section>
          <h2>Why Your Camera's File Names Are Hurting Your Rankings</h2>
          <p>Google's image search algorithm reads the file name as one of the first signals it uses to understand what an image depicts. A file named <code>best-plumber-doha-qatar.jpg</code> tells Google exactly what the image depicts.</p>
        </section>
        <section>
          <h2>The Exact Formula for SEO Image File Names</h2>
          <p>The proven formula for local SEO image file names is: <code>keyword-city-businessname.format</code></p>
          <ul>
            <li>All lowercase letters with hyphens separating words</li>
            <li>Primary service keyword first</li>
            <li>City and location second</li>
            <li>Business name last</li>
          </ul>
        </section>
      </article>
    `
  },
  {
    slug: "google-business-profile-photo-optimization",
    title: "How to Optimize Google Business Profile Photos for High Local Visibility",
    metaTitle: "GBP Photo Optimization Guide: Maximize Local SEO & Google Maps Traffic | IMGSEO",
    description: "Optimize your Google Business Profile (GBP) photos to improve click-through rates and local rankings. Learn the best image sizes, formats, and geo-tagging tips.",
    dateISO: "2025-04-01",
    body: `
      <article>
        <h1>How to Optimize Google Business Profile Photos for High Local Visibility</h1>
        <p>Your GBP photos directly influence Google Maps visibility and customer conversions. Learn the exact sizes, keywords, and metadata to use for maximum visibility.</p>
        <section>
          <h2>Why Google Business Profile Photos Matter</h2>
          <p>Active photo uploads signal that your business listing is verified and operational. Uploading clear photos of storefronts, services, and completed jobs builds relevance in local search.</p>
        </section>
        <section>
          <h2>Recommended Image Sizes for GBP</h2>
          <p>Google recommends minimum dimensions of 720x720px for square images. Compress images to under 1MB for fast loading across mobile connections.</p>
        </section>
      </article>
    `
  },
  {
    slug: "webp-vs-jpg-local-seo",
    title: "WebP vs JPG for SEO: Which Image Format Ranks Better in Google?",
    metaTitle: "WebP vs JPG for SEO: Speed Up Your Site & Improve Core Web Vitals | IMGSEO",
    description: "Switching to WebP improves site speed and Core Web Vitals. Discover why next-gen image formats are critical for local business SEO and search engine rankings.",
    dateISO: "2025-03-01",
    body: `
      <article>
        <h1>WebP vs JPG for SEO: Which Image Format Ranks Better in Google?</h1>
        <p>WebP images load up to 34% faster than JPG, directly improving Core Web Vitals. Find out how faster image loading speeds boost local SEO and mobile rankings.</p>
        <section>
          <h2>What Is WebP?</h2>
          <p>WebP is a modern image format developed by Google that provides superior lossless and lossy compression for images on the web, significantly reducing page weight.</p>
        </section>
        <section>
          <h2>Core Web Vitals Impact</h2>
          <p>Serving WebP images directly improves Largest Contentful Paint (LCP) by minimizing image byte transfer sizes.</p>
        </section>
      </article>
    `
  },
  {
    slug: "alt-text-local-seo-formula",
    title: "Writing Image ALT Text for SEO: The Formula That Actually Works",
    metaTitle: "Image ALT Text Best Practices for Local SEO & Accessibility | IMGSEO",
    description: "Write optimized image ALT text to improve local search visibility and accessibility. Learn the exact keyword formula to drive high-quality organic traffic.",
    dateISO: "2025-02-01",
    body: `
      <article>
        <h1>Writing Image ALT Text for SEO: The Formula That Actually Works</h1>
        <p>ALT text is essential for accessibility and search engine context. Learn the formula to describe images accurately for screen readers and Google.</p>
        <section>
          <h2>The Role of Alt Text</h2>
          <p>Alt text describes the visual content of an image for assistive technologies and search engine crawlers when visual elements cannot be rendered.</p>
        </section>
        <section>
          <h2>Best Practice Formula</h2>
          <p>Keep alt text descriptive, concise (under 125 characters), and naturally integrated with surrounding page context without keyword stuffing.</p>
        </section>
      </article>
    `
  },
  {
    slug: "image-seo-checklist-local-business",
    title: "The Ultimate 5-Minute Image SEO Checklist for Local Businesses",
    metaTitle: "Complete Image SEO Checklist: Optimize Photos for Local Search | IMGSEO",
    description: "Boost your organic visibility with our 5-minute image SEO checklist. Cover file naming, WebP compression, ALT text, and GPS geo-tagging all in one workflow.",
    dateISO: "2025-01-01",
    body: `
      <article>
        <h1>The Ultimate 5-Minute Image SEO Checklist for Local Businesses</h1>
        <p>Follow this comprehensive 5-step image optimization checklist before uploading photos: descriptive filenames, WebP conversion, compression, alt text, and GPS metadata.</p>
        <section>
          <h2>5-Step Workflow</h2>
          <ol>
            <li>Rename file with descriptive keywords and hyphens.</li>
            <li>Compress image to achieve optimal file size.</li>
            <li>Convert to WebP format for web delivery.</li>
            <li>Write accessible, descriptive alt text.</li>
            <li>Embed GPS metadata for location-relevant photos.</li>
          </ol>
        </section>
      </article>
    `
  }
];

const pages = {
  "/": {
    title: "IMGSEO | Free Image Optimizer, Geo Tagger & WebP Converter for SEO",
    description: "Compress, convert, and geotag images in your browser with free client-side tools for lighter files, useful metadata, and privacy-conscious publishing.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>Free Image SEO Tools: Converter, Compressor & Geo Tagger</h1>
        <p>Optimize website images locally in your browser. Convert to WebP, compress JPG and PNG files, embed GPS EXIF metadata, and generate SEO-optimized filenames without server uploads.</p>
        <section>
          <h2>Core Image SEO Utilities</h2>
          <ul>
            <li><a href="/free-webp-converter">Free WebP Converter</a> — Convert JPG and PNG images to WebP format instantly.</li>
            <li><a href="/free-online-image-compressor">Free Image Compressor</a> — Reduce image weight with adjustable quality controls.</li>
            <li><a href="/free-geo-tagger">Free Geo Tagger</a> — Embed GPS coordinates into photo EXIF headers locally.</li>
            <li><a href="/image-seo">Image SEO Guide</a> — Practical best practices for alt text, dimensions, and Core Web Vitals.</li>
          </ul>
        </section>
      </main>
    `
  },
  "/free-webp-converter": {
    title: "Free WebP Converter Online | JPG & PNG to WebP | IMGSEO",
    description: "Convert JPG and PNG images to WebP in your browser. Reduce file size for faster pages without uploading your files.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>Free WebP Converter Online</h1>
        <p>Convert JPG, PNG, and other image formats to WebP directly in your browser. Improve Core Web Vitals (LCP) and reduce page weight without uploading files to remote servers.</p>
        <section>
          <h2>Conversion Paths</h2>
          <ul>
            <li><a href="/jpg-to-webp">JPG to WebP Converter</a> — Dedicated photographic JPEG to WebP conversion.</li>
            <li><a href="/png-to-webp">PNG to WebP Converter</a> — Convert graphic assets while preserving alpha transparency.</li>
          </ul>
        </section>
        <section>
          <h2>Why WebP Matters for SEO</h2>
          <p>WebP delivers 25% to 34% smaller file sizes compared to JPEG at equivalent visual quality, speeding up load times across mobile devices.</p>
        </section>
      </main>
    `
  },
  "/free-geo-tagger": {
    title: "Free Geo Tagger | Add GPS Metadata to Photos | IMGSEO",
    description: "Add GPS coordinates and optional descriptions to image metadata in your browser. Process photos locally with IMGSEO's free geo tagger.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>Free Geo Tagger Tool</h1>
        <p>Embed latitude, longitude, and location metadata into JPEG photo EXIF headers directly in your browser. 100% private with no server file retention.</p>
        <section>
          <h2>How to Geo Tag Images</h2>
          <ol>
            <li>Select location on the interactive map or enter coordinates.</li>
            <li>Upload JPEG images to the client-side tool.</li>
            <li>Embed GPS coordinates and download updated images.</li>
          </ol>
        </section>
      </main>
    `
  },
  "/free-online-image-compressor": {
    title: "Free Online Image Compressor | Compress Images in Browser | IMGSEO",
    description: "Compress JPG, PNG, and WebP images online with quality controls and local browser processing. No image upload required.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>Free Online Image Compressor</h1>
        <p>Compress JPG, PNG, and WebP images in your browser. Balance visual clarity and file size for faster web performance and lower bounce rates.</p>
        <section>
          <h2>Compression Features</h2>
          <ul>
            <li>Batch image compression with instant ZIP download</li>
            <li>Adjustable quality slider for precise byte savings</li>
            <li>100% private browser processing with zero server uploads</li>
          </ul>
        </section>
      </main>
    `
  },
  "/jpg-to-webp": {
    title: "JPG to WebP Converter | Free Online Tool | IMGSEO",
    description: "Convert JPG images to WebP online in your browser. Choose quality, compare file sizes, and download without uploading your files.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>JPG to WebP Converter</h1>
        <p>Convert photographic JPG/JPEG files to lightweight WebP assets. Reduce bandwidth overhead while maintaining crisp visual fidelity.</p>
        <section>
          <h2>When to Convert JPG to WebP</h2>
          <p>WebP provides superior compression for photographic imagery, preventing DCT compression blockiness and accelerating Largest Contentful Paint.</p>
        </section>
      </main>
    `
  },
  "/png-to-webp": {
    title: "PNG to WebP Converter | Free Online Tool | IMGSEO",
    description: "Convert PNG images to WebP online in your browser. Keep transparency where supported and download locally processed files.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>PNG to WebP Converter</h1>
        <p>Convert PNG graphics, screenshots, and logos to WebP while preserving full alpha channel transparency.</p>
        <section>
          <h2>Transparency Preservation</h2>
          <p>WebP supports both lossy and lossless alpha transparency, slashing PNG-24 file sizes by up to 70%.</p>
        </section>
      </main>
    `
  },
  "/compress-jpg": {
    title: "Compress JPG Images Online | Free Browser Tool | IMGSEO",
    description: "Compress JPG images online with adjustable quality and local browser processing. Download smaller JPG files without uploading them.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>Compress JPG Images Online</h1>
        <p>Optimize JPEG images locally. Eliminate unnecessary metadata and tune quantization matrices for optimal web delivery.</p>
      </main>
    `
  },
  "/compress-image-to-kb": {
    title: "Compress Image to 20KB, 50KB, 100KB, 200KB Online | IMGSEO",
    description: "Compress JPG, PNG, and WebP images to exact target sizes (20KB, 50KB, 100KB, 200KB) in your browser. Free batch compression with zero uploads.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>Compress Image to Exact KB Online</h1>
        <p>Reduce photo file sizes to exact target limits like 20KB, 50KB, 100KB, or 200KB directly in your browser. 100% private, free batch processing with no server uploads.</p>
        <section>
          <h2>Features</h2>
          <ul>
            <li>Precise target size control (20KB, 50KB, 100KB, 200KB, 500KB presets)</li>
            <li>Client-side iterative binary search compression algorithm</li>
            <li>Batch upload and instant ZIP archive download</li>
            <li>100% private in-browser image processing</li>
          </ul>
        </section>
      </main>
    `
  },
  "/image-seo": {
    title: "Image SEO Guide: Alt Text, File Names & Performance | IMGSEO",
    description: "Learn practical image SEO: descriptive file names, useful alt text, responsive dimensions, WebP, crawlability, and performance.",
    schemaType: "Article",
    body: `
      <main>
        <article>
          <h1>Image SEO: The Practical Guide to Alt Text, Dimensions, and Next-Gen Formats</h1>
          <p>Image SEO is the practice of giving visual assets the right page context, descriptive alt text, crawlable URLs, and efficient modern file formats.</p>
          <section>
            <h2>1. Write Alt Text for Accessibility and Context</h2>
            <p>Describe what matters in the image for users who cannot see it. Avoid keyword stuffing and maintain natural language.</p>
          </section>
          <section>
            <h2>2. Use Descriptive, Hyphenated File Names</h2>
            <p>Replace generic camera filenames with concise, hyphenated keywords that accurately reflect image content.</p>
          </section>
          <section>
            <h2>3. Serve Next-Gen Formats (WebP / AVIF)</h2>
            <p>Convert legacy JPG and PNG assets to WebP to reduce byte transfer and improve Core Web Vitals (LCP).</p>
          </section>
        </article>
      </main>
    `
  },
  "/privacy": {
    title: "Privacy Policy | IMGSEO",
    description: "Learn how IMGSEO processes images locally in your browser and which third-party map and location services the geo tagger uses.",
    schemaType: "WebPage",
    body: `
      <main>
        <h1>Privacy Policy</h1>
        <p>IMGSEO operates client-side image optimization utilities. Your photos and metadata are processed locally in your browser memory and are never transmitted, stored, or logged on our servers.</p>
      </main>
    `
  },
  "/terms": {
    title: "Terms of Use | IMGSEO",
    description: "Review the terms for using IMGSEO's browser-based image conversion, compression, and metadata tools.",
    schemaType: "WebPage",
    body: `
      <main>
        <h1>Terms of Use</h1>
        <p>Review the terms of use for IMGSEO browser-based utilities. All tools are provided free of charge for personal and commercial website optimization.</p>
      </main>
    `
  },
  // ─── Spanish (es) Pilot Pages ───
  "/es": {
    title: "Herramientas SEO para Imágenes Gratis y Privadas | ImageSEO",
    description: "Optimiza, comprime, convierte a WebP y geolocaliza imágenes directamente en tu navegador. 100% privado, rápido y sin límites de subida en ImageSEO.cc.",
    schemaType: "WebApplication",
    lang: "es",
    body: `
      <main>
        <h1>Herramientas SEO para Imágenes Gratuitas y 100% Privadas en el Navegador</h1>
        <p>Optimiza imágenes para tu sitio web directamente en tu navegador. Convierte a WebP, comprime fotos JPG y PNG, incrusta metadatos EXIF GPS y genera nombres de archivo para SEO sin subir archivos a servidores.</p>
        <section>
          <h2>Herramientas Principales</h2>
          <ul>
            <li><a href="/es/free-webp-converter">Convertidor WebP Gratis</a> — Transforma imágenes a formato WebP ligero al instante.</li>
            <li><a href="/es/free-online-image-compressor">Compresor de Imágenes Online</a> — Reduce el peso de fotos con control total de calidad.</li>
            <li><a href="/es/free-geo-tagger">Geolocalizador GPS de Fotos</a> — Añade coordenadas GPS en cabeceras EXIF de forma privada.</li>
            <li><a href="/es/image-seo">Guía de SEO para Imágenes</a> — Consejos de optimización, texto alt y Core Web Vitals.</li>
          </ul>
        </section>
      </main>
    `
  },
  "/es/free-webp-converter": {
    title: "Convertidor WebP Gratis Online — Sin Límites | ImageSEO",
    description: "Convierte imágenes a formato WebP moderno al instante en tu navegador. Reduce el peso de tus fotos conservando máxima calidad visual sin subir archivos a servidores.",
    schemaType: "WebApplication",
    lang: "es",
    body: `
      <main>
        <h1>Convertidor WebP Gratis y Rápido en el Navegador</h1>
        <p>Convierte fotos JPG, PNG y AVIF al formato WebP de Google sin enviarlas a la nube. Acelera tu tienda o blog conservando total nitidez.</p>
        <section>
          <h2>Opciones de Conversión</h2>
          <ul>
            <li><a href="/es/jpg-to-webp">Convertir JPG a WebP</a> — Optimización fotográfica de última generación.</li>
            <li><a href="/es/png-to-webp">Convertir PNG a WebP</a> — Mantén transparencia con un 80% menos de peso.</li>
          </ul>
        </section>
      </main>
    `
  },
  "/es/jpg-to-webp": {
    title: "Convertir JPG a WebP Online Gratis — Rápido y Privado | ImageSEO",
    description: "Convierte fotos JPG a formato WebP ligero al instante. Acelera tu sitio web con compresión de última generación 100% procesada en tu navegador.",
    schemaType: "WebApplication",
    lang: "es",
    body: `
      <main>
        <h1>Convertir JPG a WebP Gratis Online</h1>
        <p>Transforma archivos JPEG a WebP sin esperas. Reduce los tiempos de carga móvil y mejora tus métricas de Google PageSpeed.</p>
      </main>
    `
  },
  "/es/png-to-webp": {
    title: "Convertir PNG a WebP Online Gratis — Conserva Transparencia | ImageSEO",
    description: "Convierte archivos PNG a WebP conservando fondos transparentes y reduciendo el tamaño del archivo hasta un 80% sin pérdida perceptible.",
    schemaType: "WebApplication",
    lang: "es",
    body: `
      <main>
        <h1>Convertir PNG a WebP con Transparencia</h1>
        <p>Optimiza gráficos, ilustraciones y logotipos transparentes convirtiéndolos a WebP con canal alfa intacto.</p>
      </main>
    `
  },
  "/es/free-geo-tagger": {
    title: "Geolocalizar Fotos Online Gratis — Editor EXIF GPS | ImageSEO",
    description: "Añade coordenadas GPS y metadatos EXIF a tus fotos para potenciar el SEO local y Google Business Profile. Mapa interactivo 100% privado en el navegador.",
    schemaType: "WebApplication",
    lang: "es",
    body: `
      <main>
        <h1>Geolocalizador de Fotos y Editor EXIF GPS Gratis</h1>
        <p>Incrusta latitud y longitud en fotos JPEG para verificar la relevancia geográfica de tu negocio local ante Google.</p>
      </main>
    `
  },
  "/es/free-online-image-compressor": {
    title: "Compresor de Imágenes Online Gratis — Rápido y Seguro | ImageSEO",
    description: "Comprime fotos JPG, PNG y WebP por lotes sin perder calidad visual. Optimización 100% local en tu navegador sin registro ni almacenamiento en servidores.",
    schemaType: "WebApplication",
    lang: "es",
    body: `
      <main>
        <h1>Compresor de Imágenes Online Gratis y Sin Límites</h1>
        <p>Comprime lotes enteros de fotos JPG, PNG y WebP sin colas ni límites de archivo. Procesamiento local instantáneo.</p>
      </main>
    `
  },
  "/es/compress-jpg": {
    title: "Comprimir JPG Online Gratis — Reduce Tamaño sin Perder Calidad | ImageSEO",
    description: "Reduce el peso en KB de tus imágenes JPG manteniendo una nitidez impecable. Procesamiento por lotes instantáneo y totalmente seguro.",
    schemaType: "WebApplication",
    lang: "es",
    body: `
      <main>
        <h1>Comprimir Fotos JPG Gratis Online</h1>
        <p>Optimiza fotografías JPG reduciendo el espacio en disco sin degradar los colores ni los detalles visuales.</p>
      </main>
    `
  },
  "/es/compress-image-to-kb": {
    title: "Comprimir Fotos a 20KB, 50KB, 100KB, 200KB Online | ImageSEO",
    description: "Comprime fotos JPG, PNG y WebP a límites exactos en KB directamente en tu navegador. 100% privado, gratis y sin subir archivos.",
    schemaType: "WebApplication",
    lang: "es",
    body: `
      <main>
        <h1>Comprimir Fotos a KB Exactos Online</h1>
        <p>Reduce el tamaño de tus fotos a límites estrictos como 20KB, 50KB, 100KB o 200KB para portales de empleo, trámites públicos y tiendas online.</p>
      </main>
    `
  },
  "/es/image-seo": {
    title: "Guía Definitiva de SEO para Imágenes (2025) — Posicionamiento y Velocidad | ImageSEO",
    description: "Aprende a optimizar imágenes para Google: formatos WebP, compresión sin pérdida, etiquetas alt, nombres de archivo descriptivos y geolocalización EXIF.",
    schemaType: "Article",
    lang: "es",
    body: `
      <main>
        <article>
          <h1>Guía Completa de SEO para Imágenes y Optimización Web</h1>
          <p>El SEO para imágenes consiste en proporcionar el contexto adecuado a los motores de búsqueda mediante texto alternativo descriptivo, nombres de archivo estructurados y formatos ligeros de nueva generación.</p>
          <section>
            <h2>1. Escribe texto alternativo útil (Alt Text)</h2>
            <p>Describe el contenido relevante de la imagen con naturalidad, evitando la acumulación de palabras clave forzadas.</p>
          </section>
          <section>
            <h2>2. Nombres de archivo descriptivos</h2>
            <p>Reemplaza nombres genéricos por términos descriptivos separados con guiones (por ejemplo: reparacion-tejados-madrid.webp).</p>
          </section>
          <section>
            <h2>3. Utiliza WebP para mayor velocidad</h2>
            <p>WebP acelera la carga de tus páginas en dispositivos móviles, optimizando la métrica Core Web Vitals (LCP).</p>
          </section>
        </article>
      </main>
    `
  },
  // ─── Portuguese (pt) Pages ───
  "/pt": {
    title: "Ferramentas de SEO para Imagens Grátis e Rápidas | ImageSEO",
    description: "Otimize, comprima, converta para WebP e adicione geotags às suas fotos direto no navegador. 100% privado, ilimitado e sem enviar arquivos a servidores.",
    schemaType: "WebApplication",
    lang: "pt",
    body: `<main><h1>Ferramentas de SEO para Imagens Grátis e 100% Privadas</h1><p>Otimize fotos para a web no seu navegador. Converta para WebP, diminua o tamanho em KB de JPG e PNG e adicione coordenadas EXIF GPS.</p></main>`
  },
  "/pt/free-webp-converter": {
    title: "Conversor WebP Grátis Online — Rápido e Sem Limites | ImageSEO",
    description: "Converta fotos para o formato WebP moderno instantaneamente. Reduza o peso do seu site mantendo excelente qualidade visual com processamento local seguro.",
    schemaType: "WebApplication",
    lang: "pt",
    body: `<main><h1>Conversor WebP Grátis Online no Navegador</h1><p>Transforme fotos JPG e PNG em WebP com velocidade instantânea sem subir arquivos a servidores.</p></main>`
  },
  "/pt/jpg-to-webp": {
    title: "Converter JPG em WebP Online Grátis — Rápido e Seguro | ImageSEO",
    description: "Transforme imagens JPG em WebP super leves. Melhore o Core Web Vitals e o tempo de carregamento da sua loja ou blog com processamento 100% no navegador.",
    schemaType: "WebApplication",
    lang: "pt",
    body: `<main><h1>Converter JPG em WebP Grátis Online</h1><p>Conversão fotográfica rápida de JPEG para WebP.</p></main>`
  },
  "/pt/png-to-webp": {
    title: "Converter PNG em WebP Online Grátis — Mantém Fundo Transparente | ImageSEO",
    description: "Converta imagens PNG para WebP mantendo a transparência alfa e diminuindo drasticamente o tamanho do arquivo sem perda de nitidez.",
    schemaType: "WebApplication",
    lang: "pt",
    body: `<main><h1>Converter PNG em WebP com Transparência</h1><p>Mantenha transparência com até 80% menos peso.</p></main>`
  },
  "/pt/free-geo-tagger": {
    title: "Adicionar Localização em Fotos Grátis — Editor EXIF GPS | ImageSEO",
    description: "Insira coordenadas GPS e metadatos EXIF em fotos para impulsionar o SEO local e o Perfil da Empresa no Google. Mapa interativo 100% privado.",
    schemaType: "WebApplication",
    lang: "pt",
    body: `<main><h1>Geotag de Fotos e Editor EXIF GPS Grátis</h1><p>Adicione coordenadas de latitude e longitude às suas fotos locais.</p></main>`
  },
  "/pt/free-online-image-compressor": {
    title: "Compressor de Imagens Online Grátis — Diminuir Tamanho de Fotos | ImageSEO",
    description: "Comprima fotos JPG, PNG e WebP em lote mantendo alta qualidade. Ferramenta rápida, segura e sem limites de upload com processamento local no navegador.",
    schemaType: "WebApplication",
    lang: "pt",
    body: `<main><h1>Compressor de Imagens Online Grátis e Ilimitado</h1><p>Reduza o tamanho em KB de fotos mantendo nitidez visual.</p></main>`
  },
  "/pt/compress-jpg": {
    title: "Comprimir JPG Online Grátis — Reduzir Tamanho de Foto | ImageSEO",
    description: "Diminua o tamanho em KB de imagens JPG sem perder detalhes visuais. Processamento em lote super veloz e totalmente confidencial.",
    schemaType: "WebApplication",
    lang: "pt",
    body: `<main><h1>Comprimir Fotos JPG Grátis Online</h1><p>Comprima arquivos JPG sem perder detalhes visuais.</p></main>`
  },
  "/pt/compress-image-to-kb": {
    title: "Comprimir Foto para 20KB, 50KB, 100KB, 200KB Online | ImageSEO",
    description: "Diminua o tamanho de fotos JPG, PNG e WebP para metas exatas em KB diretamente no navegador. 100% gratuito e seguro.",
    schemaType: "WebApplication",
    lang: "pt",
    body: `<main><h1>Comprimir Foto para KB Exato Online</h1><p>Reduza o tamanho para limites de formulários e cadastros governamentais.</p></main>`
  },
  "/pt/image-seo": {
    title: "Guia Completo de SEO para Imagens (2025) — Otimização e Velocidade | ImageSEO",
    description: "Domine a otimização de imagens para o Google: formato WebP, compressão sem perda, texto alternativo (alt), nomes de arquivo e metadados EXIF de localização.",
    schemaType: "Article",
    lang: "pt",
    body: `<main><article><h1>Guia Completo de SEO para Imagens e Performance Web</h1><p>Boas práticas de alt text, nomes de arquivos, WebP e Core Web Vitals.</p></article></main>`
  },

  // ─── Arabic (ar) Pages (RTL) ───
  "/ar": {
    title: "أدوات سيو الصور وتحسين السرعة مجانًا وبخصوصية كاملة | ImageSEO",
    description: "اضغط الصور، حولها إلى صيغة WebP الحديثة، وأضف إحداثيات GPS مباشرة من متصفحك. أداة مجانية 100% وبخصوصية تامة دون رفع ملفاتك إلى خوادم خارجية.",
    schemaType: "WebApplication",
    lang: "ar",
    body: `<main><h1>أدوات سيو الصور وتحسين السرعة مجانًا وبخصوصية تامة</h1><p>أدوات احترافية لتحسين وضغط وتحويل الصور إلى WebP وإضافة إحداثيات GPS في المتصفح دون رفعها لأي خادم.</p></main>`
  },
  "/ar/free-webp-converter": {
    title: "محول صور WebP مجاني أونلاين — بدون قيود حجم | ImageSEO",
    description: "حول الصور إلى صيغة WebP فائقة الخفة على الفور. سرّع موقعك الإلكتروني مع الحفاظ على دقة وجودة الصورة بمعالجة محلية آمنة داخل متصفحك.",
    schemaType: "WebApplication",
    lang: "ar",
    body: `<main><h1>محول صور WebP مجاني وسريع في المتصفح</h1><p>تحويل فوري إلى صيغة WebP لتسريع تحميل المواقع وتحسين نتائج محركات البحث.</p></main>`
  },
  "/ar/jpg-to-webp": {
    title: "تحويل JPG إلى WebP أونلاين مجانًا — سريع وخاص | ImageSEO",
    description: "حول صور JPG إلى WebP لتقليل حجم الصفحات وتحسين سرعة تحميل موقعك وترتيبك في محرك بحث جوجل بدون إعلانات مزعجة.",
    schemaType: "WebApplication",
    lang: "ar",
    body: `<main><h1>تحويل JPG إلى WebP مجانًا أونلاين</h1><p>تحويل صور JPG إلى WebP فائقة الخفة.</p></main>`
  },
  "/ar/png-to-webp": {
    title: "تحويل PNG إلى WebP أونلاين مجانًا — الحفاظ على الخلفية الشفافة | ImageSEO",
    description: "حول ملفات PNG إلى WebP مع الحفاظ الكامل على الخلفية الشفافة وتقليل الحجم بنسبة تصل إلى 80% لتسريع تجربة المستخدم.",
    schemaType: "WebApplication",
    lang: "ar",
    body: `<main><h1>تحويل PNG إلى WebP مع الحفاظ على الشفافية</h1><p>تقليل حجم صور PNG مع الحفاظ على الشفافية.</p></main>`
  },
  "/ar/free-geo-tagger": {
    title: "إضافة إحداثيات GPS للصور أونلاين مجانًا — معدل EXIF | ImageSEO",
    description: "أضف إحداثيات جغرافية وبيانات الموقع لصورك لتعزيز السيو المحلي ونتائج Google Business Profile عبر خريطة تفاعلية آمنة في المتصفح.",
    schemaType: "WebApplication",
    lang: "ar",
    body: `<main><h1>إضافة إحداثيات GPS وتعديل بيانات EXIF للصور مجانًا</h1><p>تثبيت بيانات الموقع الجغرافي داخل الصور لدعم السيو المحلي.</p></main>`
  },
  "/ar/free-online-image-compressor": {
    title: "ضغط الصور أونلاين مجانًا — تقليل حجم الصور بدون فقدان الجودة | ImageSEO",
    description: "اضغط صور JPG و PNG و WebP دفعة واحدة مع الاحتفاظ بأعلى جودة بصرية. معالجة سريعة وآمنة 100% داخل المتصفح دون حفظ أي بيانات.",
    schemaType: "WebApplication",
    lang: "ar",
    body: `<main><h1>برنامج ضغط الصور أونلاين مجانًا وبلا حدود</h1><p>تصغير حجم صور JPG و PNG مع الحفاظ على الجودة البصرية.</p></main>`
  },
  "/ar/compress-jpg": {
    title: "ضغط صور JPG مجانًا — تصغير حجم صور JPEG | ImageSEO",
    description: "قلل حجم ملفات صور JPG بالكيلوبايت مع الحفاظ على وضوح التفاصيل وسرعة الفتح على الهواتف وأجهزة الكمبيوتر.",
    schemaType: "WebApplication",
    lang: "ar",
    body: `<main><h1>ضغط صور JPG أونلاين مجانًا</h1><p>تقليل حجم صور JPG بالكيلوبايت.</p></main>`
  },
  "/ar/compress-image-to-kb": {
    title: "تقليل حجم الصورة بالكيلوبايت (20KB, 50KB, 100KB) أونلاين | ImageSEO",
    description: "اضغط الصور إلى أحجام دقيقة بالكيلوبايت مثل 20KB أو 50KB أو 100KB مباشرة في متصفحك مجانًا.",
    schemaType: "WebApplication",
    lang: "ar",
    body: `<main><h1>تقليل حجم الصور بالكيلوبايت أونلاين</h1><p>ضغط دقيق للصور لمواقع التقديم والمعاملات الحكومية.</p></main>`
  },
  "/ar/image-seo": {
    title: "دليل سيو الصور الكامل (2025) — تحسين ترتيب الصور وسرعة المواقع | ImageSEO",
    description: "تعلم كيفية تصدر نتائج بحث الصور في جوجل: صيغة WebP، ضغط الصور، النص البديل Alt Text، أسماء الملفات، وإضافة بيانات الموقع الجغرافي EXIF.",
    schemaType: "Article",
    lang: "ar",
    body: `<main><article><h1>الدليل الشامل لتحسين سيو الصور وسرعة المواقع</h1><p>دليل تحسين النص البديل وأسماء الملفات واستخدام WebP لتحسين ترتيب محركات البحث.</p></article></main>`
  },

  // ─── Indonesian (id) Pages ───
  "/id": {
    title: "Tools SEO Gambar Gratis & Kompres Foto Cepat | ImageSEO",
    description: "Optimasi, kompres foto, ubah format ke WebP, dan tambahkan geotag GPS langsung di browser Anda. Cepat, tanpa batas ukuran, dan 100% aman tanpa simpan ke server.",
    schemaType: "WebApplication",
    lang: "id",
    body: `<main><h1>Tools SEO Gambar Gratis & 100% Privasi di Browser</h1><p>Optimasi gambar website langsung di browser Anda. Ubah ke WebP, kompres foto, dan pasang geotag EXIF GPS.</p></main>`
  },
  "/id/free-webp-converter": {
    title: "Konverter WebP Gratis Online — Ubah Gambar ke WebP | ImageSEO",
    description: "Ubah gambar menjadi format WebP modern secara instan. Perkacil ukuran file gambar dan percepat loading website toko online atau blog Anda.",
    schemaType: "WebApplication",
    lang: "id",
    body: `<main><h1>Konverter WebP Gratis & Cepat di Browser</h1><p>Ubah foto JPG dan PNG ke WebP instan tanpa upload ke server.</p></main>`
  },
  "/id/jpg-to-webp": {
    title: "Ubah JPG ke WebP Online Gratis — Cepat & Privasi Aman | ImageSEO",
    description: "Konversi foto JPG ke WebP super ringan dalam hitungan detik. Tingkatkan performa Core Web Vitals tanpa upload file ke server eksternal.",
    schemaType: "WebApplication",
    lang: "id",
    body: `<main><h1>Ubah JPG ke WebP Gratis Online</h1><p>Konversi foto JPG ke format WebP ringan.</p></main>`
  },
  "/id/png-to-webp": {
    title: "Ubah PNG ke WebP Online Gratis — Pertahankan Transparansi | ImageSEO",
    description: "Ubah gambar PNG ke WebP dengan latar belakang transparan tetap terjaga sempurna dan ukuran file jauh lebih kecil.",
    schemaType: "WebApplication",
    lang: "id",
    body: `<main><h1>Ubah PNG ke WebP Transparan</h1><p>Ubah PNG ke WebP dengan latar belakang transparan tetap utuh.</p></main>`
  },
  "/id/free-geo-tagger": {
    title: "Tambah Lokasi Foto Online Gratis — Edit EXIF GPS | ImageSEO",
    description: "Tambahkan koordinat GPS dan lokasi akurat pada foto untuk memperkuat SEO lokal dan profil Google Bisnisku. Menggunakan peta interaktif yang aman di browser.",
    schemaType: "WebApplication",
    lang: "id",
    body: `<main><h1>Geotag Foto & Edit Metadata EXIF GPS Gratis</h1><p>Sematkan koordinat latitude dan longitude pada foto untuk SEO lokal.</p></main>`
  },
  "/id/free-online-image-compressor": {
    title: "Kompres Foto Online Gratis — Perkecil Ukuran Foto Cepat | ImageSEO",
    description: "Kompres banyak foto JPG, PNG, dan WebP sekaligus tanpa mengurangi ketajaman visual. 100% diproses di browser tanpa antrean dan tanpa batas upload.",
    schemaType: "WebApplication",
    lang: "id",
    body: `<main><h1>Kompres Foto Online Gratis & Tanpa Batas</h1><p>Perkecil ukuran KB foto secara instan di browser.</p></main>`
  },
  "/id/compress-jpg": {
    title: "Kompres JPG Online Gratis — Perkecil Ukuran File JPG | ImageSEO",
    description: "Kecilkan ukuran KB foto JPG dengan kualitas visual tetap tajam. Sangat cepat, gratis, dan menjaga privasi penuh foto Anda.",
    schemaType: "WebApplication",
    lang: "id",
    body: `<main><h1>Kompres JPG Online Gratis</h1><p>Kecilkan ukuran file foto JPG tanpa pecah.</p></main>`
  },
  "/id/compress-image-to-kb": {
    title: "Kompres Foto 100KB, 200KB Online Gratis | ImageSEO",
    description: "Kompres foto ke ukuran target 20KB, 50KB, 100KB, 200KB langsung di browser untuk daftar CPNS, marketplace, dan formulir.",
    schemaType: "WebApplication",
    lang: "id",
    body: `<main><h1>Kompres Foto ke KB Target Online</h1><p>Kecilkan foto ke 100KB atau 200KB untuk pendaftaran online.</p></main>`
  },
  "/id/image-seo": {
    title: "Panduan Lengkap SEO Gambar (2025) — Cara Optimasi Gambar Website | ImageSEO",
    description: "Pelajari cara optimasi gambar untuk Google: format WebP, kompresi tanpa pecah, teks alt, penamaan file ramah SEO, dan metadata lokasi geotag EXIF.",
    schemaType: "Article",
    lang: "id",
    body: `<main><article><h1>Panduan Lengkap SEO Gambar & Optimasi Performa Web</h1><p>Panduan lengkap alt text, WebP, penamaan file, dan geotag GPS di Indonesia.</p></article></main>`
  },

  // ─── Hindi (hi) Pages ───
  "/hi": {
    title: "मुफ़्त इमेज एसईओ टूल्स और फोटो कम्प्रेसर | ImageSEO",
    description: "ब्राउज़र में सीधे फ़ोटो कम्प्रेस करें, WebP में बदलें और GPS लोकेशन जोड़ें। 100% मुफ़्त, बिना सर्वर अपलोड और बिना किसी साइज़ लिमिट के उपयोग करें।",
    schemaType: "WebApplication",
    lang: "hi",
    body: `<main><h1>मुफ़्त इमेज एसईओ टूल्स — 100% सुरक्षित और तेज़ ब्राउज़र टूल्स</h1><p>बिना सर्वर अपलोड के अपनी तस्वीरों को WebP में बदलें, फ़ोटो कम्प्रेस करें और GPS लोकेशन जोड़ें।</p></main>`
  },
  "/hi/free-webp-converter": {
    title: "WebP कनवर्टर मुफ़्त ऑनलाइन — इमेज को WebP में बदलें | ImageSEO",
    description: "अपनी तस्वीरों को आधुनिक WebP फॉर्मेट में तुरंत बदलें। बिना क्वालिटी खोए वेबसाइट और ब्लॉग की लोडिंग स्पीड को सुपरफास्ट बनाएं।",
    schemaType: "WebApplication",
    lang: "hi",
    body: `<main><h1>फ़ोटो को WebP में बदलने का मुफ़्त कनवर्टर</h1><p>JPG और PNG फ़ोटो को हल्के WebP फॉर्मेट में तुरंत बदलें।</p></main>`
  },
  "/hi/jpg-to-webp": {
    title: "JPG से WebP कनवर्टर ऑनलाइन — फ़ोटो का साइज़ घटाएं | ImageSEO",
    description: "JPG इमेज को हल्के WebP फॉर्मेट में तुरंत बदलें। 100% सुरक्षित ब्राउज़र प्रोसेसिंग के साथ वेबसाइट रैंकिंग और स्पीड बेहतर करें।",
    schemaType: "WebApplication",
    lang: "hi",
    body: `<main><h1>JPG से WebP कनवर्टर मुफ़्त ऑनलाइन</h1><p>JPG फ़ोटो को WebP में बदलें।</p></main>`
  },
  "/hi/png-to-webp": {
    title: "PNG से WebP कनवर्टर ऑनलाइन मुफ़्त — पारदर्शी फ़ाइलें बनाएं | ImageSEO",
    description: "PNG फ़ोटो को WebP में कन्वर्ट करें और ट्रांसपेरेंट बैकग्राउंड सुरक्षित रखते हुए फ़ाइल साइज़ 80% तक कम करें।",
    schemaType: "WebApplication",
    lang: "hi",
    body: `<main><h1>PNG से WebP कनवर्टर (पारदर्शी बैकग्राउंड के साथ)</h1><p>पारदर्शी बैकग्राउंड के साथ PNG को WebP में बदलें।</p></main>`
  },
  "/hi/free-geo-tagger": {
    title: "फ़ोटो में GPS लोकेशन जोड़ें — मुफ़्त EXIF जियोटैगर | ImageSEO",
    description: "लोकल एसईओ और Google Business Profile के लिए फ़ोटो में सटीक GPS कोऑर्डिनेट्स और EXIF डेटा जोड़ें। इंटरएक्टिव मैप के साथ 100% सुरक्षित।",
    schemaType: "WebApplication",
    lang: "hi",
    body: `<main><h1>फ़ोटो में लोकेशन डालने और EXIF GPS एडिट करने का मुफ़्त टूल</h1><p>लोकल एसईओ और गूगल मैप्स के लिए तस्वीरों में लोकेशन जोड़ें।</p></main>`
  },
  "/hi/free-online-image-compressor": {
    title: "फोटो का साइज कम करें — मुफ़्त इमेज कम्प्रेसर ऑनलाइन | ImageSEO",
    description: "JPG, PNG और WebP तस्वीरों को एक साथ कम्प्रेस करें बिना क्लेरिटी खोए। सरकारी फॉर्म, जॉब पोर्टल और वेबसाइट के लिए तुरंत साइज़ कम करें।",
    schemaType: "WebApplication",
    lang: "hi",
    body: `<main><h1>फोटो का साइज कम करने का मुफ़्त ऑनलाइन टूल</h1><p>सरकारी फॉर्म और वेबसाइट के लिए फ़ोटो का साइज़ KB में कम करें।</p></main>`
  },
  "/hi/compress-jpg": {
    title: "JPG फ़ोटो कम्प्रेसर ऑनलाइन — बिना क्वालिटी खोए साइज़ घटाएं | ImageSEO",
    description: "JPG इमेज का साइज़ KB में कम करें। तेज़, सुरक्षित और सीधे आपके ब्राउज़र में चलने वाला बिना किसी लिमिट का टूल।",
    schemaType: "WebApplication",
    lang: "hi",
    body: `<main><h1>JPG फ़ोटो कम्प्रेस करें मुफ़्त ऑनलाइन</h1><p>JPG तस्वीरों का साइज़ कम करें बिना धुंधला किए।</p></main>`
  },
  "/hi/compress-image-to-kb": {
    title: "फोटो का साइज 20KB, 50KB, 100KB कैसे करें ऑनलाइन | ImageSEO",
    description: "ऑनलाइन सरकारी फॉर्म और परीक्षाओं के लिए फ़ोटो का साइज़ 20KB, 50KB, 100KB में बदलें। 100% मुफ़्त और सुरक्षित।",
    schemaType: "WebApplication",
    lang: "hi",
    body: `<main><h1>फोटो का साइज 20KB, 50KB, 100KB करें</h1><p>सरकारी परीक्षाओं (SSC, UPSC, रेलवे) के लिए फ़ोटो और सिग्नेचर का साइज़ सेट करें।</p></main>`
  },
  "/hi/image-seo": {
    title: "इमेज एसईओ गाइड (2025) — गूगल में फ़ोटो रैंक कैसे करें | ImageSEO",
    description: "सिखिए गूगल सर्च में इमेज कैसे रैंक करें: WebP फॉर्मेट, इमेज कम्प्रेशन, ऑल्ट टेक्स्ट (Alt Text), सही फ़ाइल नाम और EXIF जियोटैगिंग का पूरा तरीका।",
    schemaType: "Article",
    lang: "hi",
    body: `<main><article><h1>इमेज एसईओ और वेबसाइट स्पीड ऑप्टिमाइजेशन की पूरी गाइड</h1><p>गूगल में फोटो रैंक कराने के तरीके: ऑल्ट टेक्स्ट, फ़ाइल का सही नाम और WebP फॉर्मेट।</p></article></main>`
  }
};

// Add blog posts to pages map
for (const post of blogPosts) {
  pages[`/blog/${post.slug}`] = {
    title: post.metaTitle,
    description: post.description,
    schemaType: "Article",
    dateISO: post.dateISO,
    body: `<main>${post.body}</main>`
  };
}

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const template = await readFile(join(outputDir, "index.html"), "utf8");

// Clean base template: extract base shell without hardcoded tags
const cleanTemplate = template
  .replace(/<title>[\s\S]*?<\/title>/i, "{{TITLE}}")
  .replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i, "{{DESCRIPTION}}")
  .replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i, "{{CANONICAL}}")
  .replace(/<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i, "{{OG_URL}}")
  .replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i, "{{OG_TITLE}}")
  .replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i, "{{OG_DESC}}")
  .replace(/<meta\s+name=["']twitter:url["']\s+content=["'][^"']*["']\s*\/?>/i, "{{TWITTER_URL}}")
  .replace(/<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i, "{{TWITTER_TITLE}}")
  .replace(/<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i, "{{TWITTER_DESC}}")
  .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i, "{{SCHEMA}}")
  .replace(/<div\s+id=["']root["']>[\s\S]*?<\/div>/i, "{{ROOT_CONTENT}}");

const supportedLangCodes = ["en", "es", "pt", "ar", "id", "hi"];

for (const [route, page] of Object.entries(pages)) {
  const canonical = `${origin}${route === "/" ? "/" : route}`;
  const titleTag = `<title>${escapeHtml(page.title)}</title>`;
  const descTag = `<meta name="description" content="${escapeHtml(page.description)}" />`;
  const canonicalTag = `<link rel="canonical" href="${canonical}" />`;
  const ogUrlTag = `<meta property="og:url" content="${canonical}" />`;
  const ogTitleTag = `<meta property="og:title" content="${escapeHtml(page.title)}" />`;
  const ogDescTag = `<meta property="og:description" content="${escapeHtml(page.description)}" />`;
  const twitterUrlTag = `<meta name="twitter:url" content="${canonical}" />`;
  const twitterTitleTag = `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`;
  const twitterDescTag = `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`;

  // Language & Direction
  const pageLang = page.lang || (route.startsWith("/es") ? "es" : route.startsWith("/pt") ? "pt" : route.startsWith("/ar") ? "ar" : route.startsWith("/id") ? "id" : route.startsWith("/hi") ? "hi" : "en");
  const pageDir = pageLang === "ar" ? "rtl" : "ltr";

  // Reciprocal Hreflang Tag Generation
  const baseRoute = route.replace(/^\/(es|pt|ar|id|hi)/, "") || "/";
  let hreflangTags = "";
  for (const langCode of supportedLangCodes) {
    const langRoute = langCode === "en" ? baseRoute : (baseRoute === "/" ? `/${langCode}` : `/${langCode}${baseRoute}`);
    hreflangTags += `\n    <link rel="alternate" hreflang="${langCode}" href="${origin}${langRoute === "/" ? "/" : langRoute}" />`;
  }
  const defaultRoute = baseRoute;
  hreflangTags += `\n    <link rel="alternate" hreflang="x-default" href="${origin}${defaultRoute === "/" ? "/" : defaultRoute}" />`;

  let schemaObj;
  if (page.schemaType === "Article") {
    schemaObj = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": page.title,
      "description": page.description,
      "url": canonical,
      "datePublished": page.dateISO || "2026-09-23",
      "dateModified": "2026-09-23",
      "author": {
        "@type": "Organization",
        "name": "IMGSEO Team",
        "url": origin
      },
      "publisher": {
        "@type": "Organization",
        "name": "IMGSEO",
        "url": origin,
        "logo": {
          "@type": "ImageObject",
          "url": `${origin}/favicon.svg`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonical
      }
    };
  } else if (page.schemaType === "WebApplication") {
    schemaObj = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": page.title,
      "url": canonical,
      "description": page.description,
      "applicationCategory": "UtilitiesApplication, SEOApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires HTML5 Canvas and JavaScript",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      }
    };
  } else {
    schemaObj = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": page.title,
      "url": canonical,
      "description": page.description
    };
  }

  const schemaTag = `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;
  const rootContent = `<div id="root">${page.body}</div>`;

  let html = cleanTemplate
    .replace("{{TITLE}}", titleTag)
    .replace("{{DESCRIPTION}}", descTag)
    .replace("{{CANONICAL}}", `${canonicalTag}${hreflangTags}`)
    .replace("{{OG_URL}}", ogUrlTag)
    .replace("{{OG_TITLE}}", ogTitleTag)
    .replace("{{OG_DESC}}", ogDescTag)
    .replace("{{TWITTER_URL}}", twitterUrlTag)
    .replace("{{TWITTER_TITLE}}", twitterTitleTag)
    .replace("{{TWITTER_DESC}}", twitterDescTag)
    .replace("{{SCHEMA}}", schemaTag)
    .replace("{{ROOT_CONTENT}}", rootContent);

  // Set html lang and dir attribute
  html = html.replace(/<html[^>]*>/i, `<html lang="${pageLang}" dir="${pageDir}">`);

  const relativeDir = route === "/" ? "" : route.replace(/^\//, "");
  const targetDir = join(outputDir, relativeDir);
  await mkdir(targetDir, { recursive: true });
  await writeFile(join(targetDir, "index.html"), html, "utf8");
}

// Generate 404.html
const notFoundHtml = cleanTemplate
  .replace("{{TITLE}}", "<title>Page Not Found | IMGSEO</title>")
  .replace("{{DESCRIPTION}}", '<meta name="description" content="The requested IMGSEO page could not be found." />')
  .replace("{{CANONICAL}}", `<link rel="canonical" href="${origin}/404.html" />`)
  .replace("{{OG_URL}}", `<meta property="og:url" content="${origin}/404.html" />`)
  .replace("{{OG_TITLE}}", '<meta property="og:title" content="Page Not Found | IMGSEO" />')
  .replace("{{OG_DESC}}", '<meta property="og:description" content="The requested IMGSEO page could not be found." />')
  .replace("{{TWITTER_URL}}", `<meta name="twitter:url" content="${origin}/404.html" />`)
  .replace("{{TWITTER_TITLE}}", '<meta name="twitter:title" content="Page Not Found | IMGSEO" />')
  .replace("{{TWITTER_DESC}}", '<meta name="twitter:description" content="The requested IMGSEO page could not be found." />')
  .replace("{{SCHEMA}}", "")
  .replace("{{ROOT_CONTENT}}", '<div id="root"><main><h1>Page Not Found</h1><p>The requested page could not be found.</p><p><a href="/">Return to IMGSEO Home</a></p></main></div>');

await writeFile(join(outputDir, "404.html"), notFoundHtml, "utf8");

console.log(`Successfully prerendered ${Object.keys(pages).length} routes + 404.html to ${outputDir}`);
