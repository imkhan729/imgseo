import { ToolPageConfig } from "@/lib/tool-pages";

export const portugueseToolConfigs: Record<string, ToolPageConfig> = {
  "webp-converter": {
    path: "/pt/free-webp-converter",
    navLabel: "Conversor WebP",
    metaTitle: "Conversor WebP Grátis Online — Rápido e Sem Limites | ImageSEO",
    metaDescription: "Converta fotos para o formato WebP moderno instantaneamente. Reduza o peso do seu site mantendo excelente qualidade visual com processamento local seguro.",
    h1: "Conversor WebP Grátis Online no Navegador",
    heroEyebrow: "Conversão local no navegador",
    heroBody: "Transforme imagens JPG, PNG, AVIF e outros formatos em WebP diretamente no navegador. Melhore o Core Web Vitals e o tempo de carregamento sem enviar arquivos para servidores.",
    mode: "format-converter",
    defaultTargetFormat: "WEBP",
    accent: "bg-gradient-to-b from-sky-50 via-background to-background dark:from-sky-950/20",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
    primaryKeyword: "conversor webp gratis",
    secondaryKeywords: ["converter imagem para webp", "converter jpg em webp", "converter png em webp"],
    schemaType: "WebApplication",
    howToSteps: [
      { title: "Selecione ou arraste suas fotos", body: "Carregue imagens JPG, PNG ou AVIF com total privacidade." },
      { title: "Ajuste a qualidade WebP", body: "Escolha a taxa de compressão ideal entre nitidez e tamanho reduzido." },
      { title: "Baixe instantaneamente", body: "Salve os arquivos WebP individualmente ou em arquivo ZIP compacto." },
    ],
    faqs: [
      {
        q: "Por que converter imagens para WebP no SEO?",
        a: "O formato WebP gera arquivos até 35% menores que o JPEG com a mesma fidelidade visual, melhorando o Largest Contentful Paint (LCP) e a velocidade mobile.",
      },
      {
        q: "A qualidade da imagem diminui ao converter para WebP?",
        a: "Não perceptivelmente. O WebP utiliza algoritmos preditivos avançados que preservam bordas e gradientes removendo dados redundantes.",
      },
      {
        q: "O formato WebP é compatível com todos os navegadores modernos?",
        a: "Sim. Google Chrome, Safari, Firefox, Edge e navegadores mobile no Android e iOS oferecem suporte completo ao WebP (mais de 97% dos usuários globais).",
      },
      {
        q: "As minhas fotos são enviadas para algum servidor durante a conversão?",
        a: "Não. Toda a conversão ocorre localmente na memória do seu navegador via HTML5 Canvas. Total privacidade e segurança.",
      },
      {
        q: "Posso converter várias imagens para WebP em lote de uma só vez?",
        a: "Sim. Você pode arrastar dezenas de fotos simultaneamente e baixá-las em um único arquivo ZIP consolidado.",
      },
    ],
  },
  "geo-tagger": {
    path: "/pt/free-geo-tagger",
    navLabel: "Geotag GPS",
    metaTitle: "Adicionar Localização em Fotos Grátis — Editor EXIF GPS | ImageSEO",
    metaDescription: "Insira coordenadas GPS e metadatos EXIF em fotos para impulsionar o SEO local e o Perfil da Empresa no Google. Mapa interativo 100% privado.",
    h1: "Geotag de Fotos e Editor EXIF GPS Grátis",
    heroEyebrow: "Editor EXIF GPS 100% confidencial",
    heroBody: "Insira latitude e longitude em fotos JPEG diretamente no seu navegador. Melhore a relevância local no Google Maps e Google Meu Negócio.",
    mode: "geo-tagger",
    accent: "bg-gradient-to-b from-emerald-50 via-background to-background dark:from-emerald-950/20",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    primaryKeyword: "adicionar localizacao em foto",
    secondaryKeywords: ["geotag foto gratis", "editor exif gps", "colocar localizacao em imagem"],
    schemaType: "WebApplication",
    howToSteps: [
      { title: "Encontre seu local no mapa", body: "Digite o endereço ou mova o marcador para capturar as coordenadas exatas." },
      { title: "Carregue as fotografias", body: "Arraste as fotos que deseja marcar geograficamente." },
      { title: "Injete os dados EXIF e baixe", body: "Baixe os arquivos JPEG com as coordenadas GPS embutidas." },
    ],
    faqs: [
      {
        q: "Como o geotagging de fotos ajuda no SEO local?",
        a: "As coordenadas GPS embutidas no cabeçalho EXIF confirmam para os motores de busca o local geográfico real onde seu serviço ou empresa opera.",
      },
      {
        q: "O Google lê dados GPS EXIF para ranquear no Google Maps e Perfil da Empresa?",
        a: "Sim. O Google analisa metadados EXIF como um sinal de relevância geográfica, especialmente quando combinado com nomes de arquivo locais e páginas correspondentes.",
      },
      {
        q: "Como adicionar coordenadas GPS em fotos do Google Meu Negócio?",
        a: "Defina o local no mapa interativo, carregue as fotos do seu estabelecimento, gere as tags GPS e faça upload das imagens JPEG geradas no seu perfil.",
      },
      {
        q: "Quais formatos de imagem suportam metadados EXIF GPS?",
        a: "O padrão universal com suporte nativo a EXIF GPS é o JPEG/JPG. Nossa ferramenta gera arquivos JPEG perfeitamente compatíveis.",
      },
      {
        q: "Minhas fotos e dados de localização ficam salvos em algum lugar?",
        a: "Não. Toda a inserção de metadados ocorre 100% no seu próprio navegador. Nada é enviado para a nuvem.",
      },
    ],
  },
  "online-image-compressor": {
    path: "/pt/free-online-image-compressor",
    navLabel: "Compressor de Fotos",
    metaTitle: "Compressor de Imagens Online Grátis — Diminuir Tamanho de Fotos | ImageSEO",
    metaDescription: "Comprima fotos JPG, PNG e WebP em lote mantendo alta qualidade. Ferramenta rápida, segura e sem limites de upload com processamento local no navegador.",
    h1: "Compressor de Imagens Online Grátis e Ilimitado",
    heroEyebrow: "Compressão de imagens no navegador",
    heroBody: "Comprima várias fotos JPG, PNG e WebP de uma só vez sem fila nem perda visual perceptível. 100% no seu dispositivo.",
    mode: "compressor",
    accent: "bg-gradient-to-b from-violet-50 via-background to-background dark:from-violet-950/20",
    badgeClass: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
    primaryKeyword: "comprimir fotos online",
    secondaryKeywords: ["diminuir tamanho de foto", "reduzir tamanho de imagem", "comprimir jpg"],
    schemaType: "WebApplication",
    howToSteps: [
      { title: "Arraste suas imagens", body: "Selecione quantas fotos quiser sem limites de upload." },
      { title: "Ajuste o controle de qualidade", body: "Defina o nível de compressão desejado." },
      { title: "Baixe com um clique", body: "Baixe individualmente ou em arquivo ZIP consolidado." },
    ],
    faqs: [
      {
        q: "Como este compressor reduz o tamanho do arquivo sem perder qualidade?",
        a: "Ele utiliza algoritmos inteligentes de compressão Canvas que removem dados imperceptíveis ao olho humano, reduzindo os KBs drasticamente.",
      },
      {
        q: "Qual o tamanho de arquivo recomendado para imagens de websites?",
        a: "Imagens de destaque e banners devem ficar abaixo de 150KB–200KB; fotos de artigos abaixo de 100KB; e ícones ou miniaturas abaixo de 30KB.",
      },
      {
        q: "Comprimir imagens melhora o PageSpeed Insights do Google?",
        a: "Sim. O peso das imagens é a causa mais comum de lentidão no LCP. A compressão pode reduzir o peso total da página em até 80%.",
      },
      {
        q: "Existe limite no número de fotos ou tamanho para comprimir?",
        a: "Não há limites. A ferramenta roda com o poder de processamento do seu próprio aparelho, sem planos pagos nem cadastros.",
      },
      {
        q: "É seguro comprimir fotos comerciais e confidenciais?",
        a: "Totalmente seguro. Os arquivos nunca saem da memória local do seu navegador.",
      },
    ],
  },
};

export const arabicToolConfigs: Record<string, ToolPageConfig> = {
  "webp-converter": {
    path: "/ar/free-webp-converter",
    navLabel: "محول WebP",
    metaTitle: "محول صور WebP مجاني أونلاين — بدون قيود حجم | ImageSEO",
    metaDescription: "حول الصور إلى صيغة WebP فائقة الخفة على الفور. سرّع موقعك الإلكتروني مع الحفاظ على دقة وجودة الصورة بمعالجة محلية آمنة داخل متصفحك.",
    h1: "محول صور WebP مجاني وسريع في المتصفح",
    heroEyebrow: "معالجة محلية داخل المتصفح",
    heroBody: "حول صور JPG و PNG و AVIF إلى صيغة WebP الحديثة مباشرة داخل متصفحك لتقليل حجم الصفحات وتسريع تجربة المستخدم دون رفع ملفاتك إلى خوادم خارجية.",
    mode: "format-converter",
    defaultTargetFormat: "WEBP",
    accent: "bg-gradient-to-b from-sky-50 via-background to-background dark:from-sky-950/20",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
    primaryKeyword: "تحويل الصور الى webp",
    secondaryKeywords: ["تحويل jpg الى webp", "تحويل png الى webp", "برنامج تحويل webp"],
    schemaType: "WebApplication",
    howToSteps: [
      { title: "اختر أو اسحب الصور", body: "قم برفع الصور بأي صيغة مباشرة دون انتظار." },
      { title: "حدد جودة التحويل", body: "اختر نسبة الضغط والجودة المناسبة لاحتياجاتك." },
      { title: "حمّل الصور فورًا", body: "احفظ الصور بصيغة WebP بشكل فردي أو في ملف ZIP." },
    ],
    faqs: [
      {
        q: "لماذا يفضل استخدام صيغة WebP لتحسين السيو وتجربة المستخدم؟",
        a: "توفر صيغة WebP ضغطًا أعلى بنسبة تصل إلى 35% مقارنة بـ JPEG مع الحفاظ الكامل على نقاء الصورة، مما يسرع تحميل الموقع ويحسن مؤشرات Core Web Vitals.",
      },
      {
        q: "هل تقل جودة الصورة عند تحويلها إلى صيغة WebP؟",
        a: "لا، تحافظ خوارزميات WebP على وضوح التفاصيل الدقيقة والألوان مع التخلص الذكي من البيانات غير الضرورية.",
      },
      {
        q: "هل تدعم جميع المتصفحات الحديثة صيغة WebP؟",
        a: "نعم، تدعم متصفحات Google Chrome وSafari وFirefox وEdge وجميع متصفحات الهواتف الذكية صيغة WebP بنسبة تتجاوز 97%.",
      },
      {
        q: "هل يتم رفع صوري إلى أي خادم خارجي أثناء التحويل؟",
        a: "لا على الإطلاق. تتم كل عمليات التحويل والمعالجة محليًا داخل ذاكرة متصفحك لضمان أقصى درجات الخصوصية والأمان.",
      },
      {
        q: "هل يمكنني تحويل مجموعة صور معًا وتنزيلها في ملف مضغوط؟",
        a: "نعم، يمكنك سحب عشرات الصور دفعة واحدة وتحويلها وتنزيلها معًا في ملف ZIP بضغطة زر.",
      },
    ],
  },
  "geo-tagger": {
    path: "/ar/free-geo-tagger",
    navLabel: "تحديد موقع GPS",
    metaTitle: "إضافة إحداثيات GPS للصور أونلاين مجانًا — معدل EXIF | ImageSEO",
    metaDescription: "أضف إحداثيات جغرافية وبيانات الموقع لصورك لتعزيز السيو المحلي ونتائج Google Business Profile عبر خريطة تفاعلية آمنة في المتصفح.",
    h1: "إضافة إحداثيات GPS وتعديل بيانات EXIF للصور مجانًا",
    heroEyebrow: "تعديل بيانات EXIF بخصوصية تامة",
    heroBody: "أضف خطوط الطول والعرض للصور لدعم السيو المحلي وتحسين ظهور نشاطك في خرائط جوجل Google Maps.",
    mode: "geo-tagger",
    accent: "bg-gradient-to-b from-emerald-50 via-background to-background dark:from-emerald-950/20",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    primaryKeyword: "إضافة إحداثيات للصورة",
    secondaryKeywords: ["تحديد موقع الصورة gps", "تعديل بيانات exif للصور", "جيو تاج للصور"],
    schemaType: "WebApplication",
    howToSteps: [
      { title: "حدد الموقع على الخريطة", body: "ابحث عن العنوان أو حرك المؤشر للحصول على الإحداثيات الدقيقة." },
      { title: "ارفع الصور", body: "اسحب صور أعمالك أو منتجاتك المراد تحديد موقعها." },
      { title: "احفظ وحمّل الصور", body: "حمّل الصور الجاهزة المدمج بها بيانات الموقع الجغرافي." },
    ],
    faqs: [
      {
        q: "كيف تساعد إضافة إحداثيات GPS للصور (Geotagging) في السيو المحلي؟",
        a: "تمنح بيانات GPS المدمجة في ترويسة EXIF محركات البحث دليلاً جغرافيًا موثوقًا على موقع التقاط الصور ومقر نشاطك التجاري لتعزيز الظهور المحلي.",
      },
      {
        q: "هل يقرأ جوجل إحداثيات GPS في الصور لتحسين ترتيب الخرائط ونشاطي التجاري؟",
        a: "نعم، يستخرج جوجل بيانات EXIF في الملفات المرفوعة إلى Google Business Profile لدعم الثقة الجغرافية وتطابق الموقع.",
      },
      {
        q: "كيف أضيف إحداثيات GPS لصور الملف التجاري في جوجل؟",
        a: "حدد عنوان متجرك على الخريطة التفاعلية، ارفع صور المتجر أو الأعمال المنجزة، ثم اضغط حفظ وحمّل ملفات JPEG المدمجة لرفعها مباشرة إلى صفحتك.",
      },
      {
        q: "ما هي صيغ الصور التي تدعم بيانات EXIF GPS؟",
        a: "صيغة JPEG/JPG هي المعيار العالمي الأساسي لبيانات EXIF GPS، وتقوم أداتنا بتصدير صور JPEG متوافقة تمامًا.",
      },
      {
        q: "هل صوري وموقعي الجغرافي في أمان وسرية تامة؟",
        a: "نعم بنسبة 100%، تتم كافة العمليات داخل متصفحك دون إرسال أي ملف أو إحداثيات إلى خوادمنا.",
      },
    ],
  },
  "online-image-compressor": {
    path: "/ar/free-online-image-compressor",
    navLabel: "ضغط الصور",
    metaTitle: "ضغط الصور أونلاين مجانًا — تقليل حجم الصور بدون فقدان الجودة | ImageSEO",
    metaDescription: "اضغط صور JPG و PNG و WebP دفعة واحدة مع الاحتفاظ بأعلى جودة بصرية. معالجة سريعة وآمنة 100% داخل المتصفح دون حفظ أي بيانات.",
    h1: "برنامج ضغط الصور أونلاين مجانًا وبلا حدود",
    heroEyebrow: "ضغط الصور محليًا في المتصفح",
    heroBody: "قلل حجم ملفات الصور بالكيلوبايت دفعة واحدة مع الحفاظ على وضوح التفاصيل دون قيود أو إعلانات مزعجة.",
    mode: "compressor",
    accent: "bg-gradient-to-b from-violet-50 via-background to-background dark:from-violet-950/20",
    badgeClass: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
    primaryKeyword: "ضغط الصور مجانا",
    secondaryKeywords: ["تقليل حجم الصور", "ضغط صور jpg", "تصغير حجم الصور بالكيلوبايت"],
    schemaType: "WebApplication",
    howToSteps: [
      { title: "اسحب الصور", body: "اختر أي عدد من الصور دفعة واحدة دون حدود حجم." },
      { title: "تحكم بالجودة", body: "اضبط مؤشر الجودة للوصول إلى أفضل توازن." },
      { title: "حمّل الصور بنقرة واحدة", body: "احفظ الصور فورًا على جهازك بأمان تام." },
    ],
    faqs: [
      {
        q: "كيف يقوم هذا البرنامج بضغط الصور دون الإضرار بجودتها؟",
        a: "يستخدم خوارزميات ضغط ذكية تتخلص من درجات البكسل والبيانات غير المرئية للعين البشرية، مما يقلل الحجم بالكيلوبايت بنسبة هائلة مع الحفاظ على صفاء الصورة.",
      },
      {
        q: "ما هو الحجم المثالي لصور صفحات المواقع والمتاجر الإلكترونية؟",
        a: "ينصح بإبقاء صور البانر الرئيسية أقل من 150-200 كيلوبايت، وصور المقالات والمنتجات أقل من 100 كيلوبايت، والرموز والأيقونات أقل من 30 كيلوبايت.",
      },
      {
        q: "هل يساعد ضغط الصور في رفع تقييم Google PageSpeed؟",
        a: "نعم، الصور الثقيلة هي المسبب الأكبر لبطء تحميل الصفحات. ضغط الصور يقلل استهلاك الباندويث ويسرع مؤشر Largest Contentful Paint (LCP).",
      },
      {
        q: "هل توجد أي حدود لعدد الصور أو حد أقصى للحجم؟",
        a: "لا توجد أي قيود، فالضغط يعتمد على معالج جهازك مباشرة، ومتاح مجانًا بدون اشتراكات أو علامات مائية.",
      },
      {
        q: "هل يتم الاحتفاظ بصوري أو رفعها إلى أي مكان؟",
        a: "أبدًا، جميع عمليات المعالجة تجري محليًا داخل متصفحك ولا تمر عبر الإنترنت مطلقًا.",
      },
    ],
  },
};

export const indonesianToolConfigs: Record<string, ToolPageConfig> = {
  "webp-converter": {
    path: "/id/free-webp-converter",
    navLabel: "Konverter WebP",
    metaTitle: "Konverter WebP Gratis Online — Ubah Gambar ke WebP | ImageSEO",
    metaDescription: "Ubah gambar menjadi format WebP modern secara instan. Perkacil ukuran file gambar dan percepat loading website toko online atau blog Anda.",
    h1: "Konverter WebP Gratis & Cepat di Browser",
    heroEyebrow: "Konversi gambar lokal di browser",
    heroBody: "Ubah file gambar JPG, PNG, AVIF ke WebP langsung di browser tanpa upload ke server. Tingkatkan Core Web Vitals dan kecepatan website secara instan.",
    mode: "format-converter",
    defaultTargetFormat: "WEBP",
    accent: "bg-gradient-to-b from-sky-50 via-background to-background dark:from-sky-950/20",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
    primaryKeyword: "ubah foto ke webp",
    secondaryKeywords: ["ubah jpg ke webp", "convert jpg ke webp", "konverter webp online"],
    schemaType: "WebApplication",
    howToSteps: [
      { title: "Pilih foto", body: "Unggah gambar JPG atau PNG dengan aman di perangkat Anda." },
      { title: "Atur kualitas", body: "Tentukan tingkat kompresi sesuai kebutuhan ketajaman gambar." },
      { title: "Unduh file WebP", body: "Download file WebP secara instan tanpa batas kuota." },
    ],
    faqs: [
      {
        q: "Mengapa format WebP sangat direkomendasikan untuk SEO?",
        a: "WebP berukuran hingga 35% lebih kecil dibandingkan JPG dengan kualitas visual yang sama tajamnya, mempercepat waktu loading dan skor Core Web Vitals Google.",
      },
      {
        q: "Apakah kualitas gambar berkurang saat dikonversi ke WebP?",
        a: "Tidak secara kasat mata. Format WebP menggunakan algoritma canggih yang mempertahankan ketajaman detail dan warna gambar.",
      },
      {
        q: "Apakah semua browser dan perangkat mendukung format WebP?",
        a: "Ya. Google Chrome, Safari, Firefox, Edge, serta browser HP Android dan iPhone mendukung penuh WebP (mencakup lebih dari 97% pengguna internet).",
      },
      {
        q: "Apakah foto saya diunggah ke server saat proses konversi?",
        a: "Tidak. Seluruh proses konversi berjalan 100% di memori browser perangkat Anda menggunakan HTML5 Canvas. Privasi Anda terjamin aman.",
      },
      {
        q: "Bisakah saya mengonversi banyak gambar ke WebP sekaligus?",
        a: "Ya, Anda bisa drag-and-drop puluhan gambar secara massal dan mengunduh semuanya dalam satu file ZIP.",
      },
    ],
  },
  "geo-tagger": {
    path: "/id/free-geo-tagger",
    navLabel: "Geotag GPS",
    metaTitle: "Tambah Lokasi Foto Online Gratis — Edit EXIF GPS | ImageSEO",
    metaDescription: "Tambahkan koordinat GPS dan lokasi akurat pada foto untuk memperkuat SEO lokal dan profil Google Bisnisku. Menggunakan peta interaktif yang aman di browser.",
    h1: "Geotag Foto & Edit Metadata EXIF GPS Gratis",
    heroEyebrow: "Geotagging foto 100% aman & privat",
    heroBody: "Sematkan koordinat latitude dan longitude pada foto JPEG Anda untuk meningkatkan peringkat di Google Bisnisku (GBP) dan pencarian lokal.",
    mode: "geo-tagger",
    accent: "bg-gradient-to-b from-emerald-50 via-background to-background dark:from-emerald-950/20",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    primaryKeyword: "tambah lokasi foto",
    secondaryKeywords: ["geotag foto online", "edit exif gps foto", "pasang lokasi pada foto"],
    schemaType: "WebApplication",
    howToSteps: [
      { title: "Cari lokasi di peta", body: "Tentukan titik koordinat akurat pada peta interaktif." },
      { title: "Pilih foto usaha", body: "Unggah foto proyek, toko, atau produk Anda." },
      { title: "Simpan data GPS", body: "Unduh foto JPEG yang telah disematkan metadata lokasi GPS." },
    ],
    faqs: [
      {
        q: "Apa manfaat geotagging foto untuk SEO lokal?",
        a: "Data koordinat GPS pada header EXIF memberikan bukti fisik yang valid kepada Google bahwa layanan atau foto Anda benar-benar berada di lokasi target.",
      },
      {
        q: "Apakah Google membaca koordinat GPS EXIF untuk peringkat Google Maps & Profil Bisnis?",
        a: "Ya. Google mengekstrak metadata EXIF untuk mencocokkan relevansi geografis foto dengan alamat bisnis Anda.",
      },
      {
        q: "Bagaimana cara menyematkan lokasi GPS pada foto Google Bisnisku (GBP)?",
        a: "Cari lokasi usaha Anda pada peta interaktif, unggah foto, pasang tag GPS, dan unduh foto JPEG yang siap diunggah ke profil bisnis Anda.",
      },
      {
        q: "Format foto apa yang mendukung metadata GPS EXIF?",
        a: "Format standar yang mendukung EXIF GPS secara universal adalah JPEG/JPG. Alat kami otomatis menghasilkan output JPEG yang kompatibel.",
      },
      {
        q: "Apakah foto dan data lokasi saya disimpan di server?",
        a: "Tidak. Semua proses penulisan metadata dilakukan 100% secara lokal di browser Anda.",
      },
    ],
  },
  "online-image-compressor": {
    path: "/id/free-online-image-compressor",
    navLabel: "Kompres Foto",
    metaTitle: "Kompres Foto Online Gratis — Perkecil Ukuran Foto Cepat | ImageSEO",
    metaDescription: "Kompres banyak foto JPG, PNG, dan WebP sekaligus tanpa mengurangi ketajaman visual. 100% diproses di browser tanpa antrean dan tanpa batas upload.",
    h1: "Kompres Foto Online Gratis & Tanpa Batas",
    heroEyebrow: "Kompresi foto cepat di browser",
    heroBody: "Kecilkan ukuran file foto JPG, PNG, dan WebP secara massal dengan cepat tanpa antrean server dan 100% menjaga privasi foto Anda.",
    mode: "compressor",
    accent: "bg-gradient-to-b from-violet-50 via-background to-background dark:from-violet-950/20",
    badgeClass: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
    primaryKeyword: "kompres foto online",
    secondaryKeywords: ["perkecil ukuran foto", "kompres jpg", "kurangi ukuran foto kb"],
    schemaType: "WebApplication",
    howToSteps: [
      { title: "Pilih banyak foto", body: "Tarik atau pilih foto tanpa batas ukuran file." },
      { title: "Sesuaikan kualitas", body: "Atur slider kompresi untuk ukuran yang pas." },
      { title: "Unduh langsung", body: "Download hasil foto satu per satu atau dalam file ZIP." },
    ],
    faqs: [
      {
        q: "Bagaimana cara kerja kompresor ini mengecilkan file tanpa pecah?",
        a: "Menggunakan algoritma kompresi Canvas cerdas yang membuang data warna tak terlihat mata, sehingga ukuran KB berkurang drastis namun gambar tetap jernih.",
      },
      {
        q: "Berapa ukuran file foto yang ideal untuk website?",
        a: "Foto banner disarankan di bawah 150KB–200KB; foto produk dan artikel di bawah 100KB; dan ikon atau thumbnail di bawah 30KB.",
      },
      {
        q: "Apakah kompresi gambar meningkatkan skor Google PageSpeed?",
        a: "Ya. Gambar yang terlalu berat adalah faktor utama loading lambat. Kompresi dapat menghemat hingga 80% total ukuran halaman web.",
      },
      {
        q: "Apakah ada batasan jumlah foto atau ukuran file?",
        a: "Tidak ada batasan sama sekali karena proses menggunakan tenaga perangkat Anda sendiri, tanpa biaya langganan.",
      },
      {
        q: "Apakah aman mengompres foto sensitif dan penting?",
        a: "Sangat aman. Foto Anda tidak pernah dikirim ke internet atau disimpan di server mana pun.",
      },
    ],
  },
};

export const hindiToolConfigs: Record<string, ToolPageConfig> = {
  "webp-converter": {
    path: "/hi/free-webp-converter",
    navLabel: "WebP कनवर्टर",
    metaTitle: "WebP कनवर्टर मुफ़्त ऑनलाइन — इमेज को WebP में बदलें | ImageSEO",
    metaDescription: "अपनी तस्वीरों को आधुनिक WebP फॉर्मेट में तुरंत बदलें। बिना क्वालिटी खोए वेबसाइट और ब्लॉग की लोडिंग स्पीड को सुपरफास्ट बनाएं।",
    h1: "फ़ोटो को WebP में बदलने का मुफ़्त कनवर्टर",
    heroEyebrow: "100% सुरक्षित ब्राउज़र कनवर्टर",
    heroBody: "JPG, PNG और अन्य तस्वीरों को Google के आधुनिक WebP फॉर्मेट में बदलें। बिना किसी सर्वर अपलोड के वेबसाइट स्पीड और मोबाइल परफॉर्मेंस बेहतर करें।",
    mode: "format-converter",
    defaultTargetFormat: "WEBP",
    accent: "bg-gradient-to-b from-sky-50 via-background to-background dark:from-sky-950/20",
    badgeClass: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
    primaryKeyword: "फोटो को webp में बदलें",
    secondaryKeywords: ["jpg से webp कन्वर्टर", "png से webp कन्वर्टर", "इमेज कन्वर्टर ऑनलाइन"],
    schemaType: "WebApplication",
    howToSteps: [
      { title: "फ़ोटो चुनें", body: "JPG या PNG तस्वीरों को सुरक्षित रूप से चुनें।" },
      { title: "क्वालिटी सेट करें", body: "अपनी पसंद के अनुसार कम्प्रेशन लेवल चुनें।" },
      { title: "तुरंत डाउनलोड करें", body: "बिना किसी सीमा के WebP फाइलें तुरंत सेव करें।" },
    ],
    faqs: [
      {
        q: "वेबसाइट एसईओ के लिए WebP फॉर्मेट का क्या फ़ायदा है?",
        a: "WebP फॉर्मेट समान विज़ुअल क्वालिटी में JPG की तुलना में 35% तक हल्का होता है, जिससे वेबसाइट लोडिंग स्पीड और Core Web Vitals स्कोर काफी बेहतर होता है।",
      },
      {
        q: "क्या WebP में बदलने से फ़ोटो की क्वालिटी कम हो जाती है?",
        a: "नहीं, WebP के आधुनिक एल्गोरिदम तस्वीर की शार्पनेस और रंगों को बनाए रखते हुए अनावश्यक बाइट्स को हटा देते हैं।",
      },
      {
        q: "क्या सभी ब्राउज़र और मोबाइल डिवाइस WebP को सपोर्ट करते हैं?",
        a: "हाँ, Google Chrome, Safari, Firefox, Edge और सभी आधुनिक Android व iOS मोबाइल ब्राउज़र WebP को 100% सपोर्ट करते हैं।",
      },
      {
        q: "क्या कन्वर्शन के दौरान मेरी फ़ोटो किसी सर्वर पर अपलोड होती है?",
        a: "बिल्कुल नहीं। सभी कन्वर्शन आपके ब्राउज़र की लोकल मेमोरी में होते हैं, जिससे आपकी प्राइवेसी पूरी तरह सुरक्षित रहती है।",
      },
      {
        q: "क्या मैं एक साथ कई फ़ोटो को WebP में बदल सकता हूँ?",
        a: "हाँ, आप एक साथ दर्जनों फ़ोटो चुनकर उन्हें बल्क में कन्वर्ट कर सकते हैं और एक ZIP फ़ाइल में डाउनलोड कर सकते हैं।",
      },
    ],
  },
  "geo-tagger": {
    path: "/hi/free-geo-tagger",
    navLabel: "GPS जियोटैगर",
    metaTitle: "फ़ोटो में GPS लोकेशन जोड़ें — मुफ़्त EXIF जियोटैगर | ImageSEO",
    metaDescription: "लोकल एसईओ और Google Business Profile के लिए फ़ोटो में सटीक GPS कोऑर्डिनेट्स और EXIF डेटा जोड़ें। इंटरएक्टिव मैप के साथ 100% सुरक्षित।",
    h1: "फ़ोटो में लोकेशन डालने और EXIF GPS एडिट करने का मुफ़्त टूल",
    heroEyebrow: "प्राइवेट EXIF लोकेशन एडिटर",
    heroBody: "अपनी बिज़नेस और प्रोडक्ट तस्वीरों में सटीक GPS लोकेशन और EXIF कोऑर्डिनेट्स जोड़ें ताकि Google Maps और लोकल सर्च में बेहतर रैंकिंग मिल सके।",
    mode: "geo-tagger",
    accent: "bg-gradient-to-b from-emerald-50 via-background to-background dark:from-emerald-950/20",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    primaryKeyword: "फोटो में लोकेशन डालना",
    secondaryKeywords: ["फोटो का gps लोकेशन कैसे देखें", "इमेज जियोटैगिंग टूल", "फोटो में पता डालना"],
    schemaType: "WebApplication",
    howToSteps: [
      { title: "मैप पर लोकेशन चुनें", body: "सटीक लोकेशन खोजने के लिए मैप पर पिन सेट करें।" },
      { title: "फ़ोटो अपलोड करें", body: "जिन तस्वीरों में लोकेशन जोड़नी है उन्हें चुनें।" },
      { title: "GPS डेटा जोड़ें और डाउनलोड करें", body: "लोकेशन टैग की गई JPG फ़ाइल डाउनलोड करें।" },
    ],
    faqs: [
      {
        q: "जियोटैगिंग से लोकल एसईओ और गूगल मैप्स में क्या मदद मिलती है?",
        a: "तस्वीर के EXIF हेडर में GPS कोऑर्डिनेट्स (अक्षांश और देशांतर) जोड़ने से सर्च इंजन को प्रमाणित होता है कि आपका काम उसी शहर में हुआ है।",
      },
      {
        q: "क्या गूगल फ़ोटो के GPS EXIF डेटा को रैंकिंग के लिए पढ़ता है?",
        a: "हाँ, गूगल बिज़नेस प्रोफ़ाइल और लोकल सर्च एल्गोरिदम इमेज मेटाडेटा को सत्यापित लोकेशन सिग्नल के रूप में इस्तेमाल करते हैं।",
      },
      {
        q: "Google Business Profile के लिए फ़ोटो में लोकेशन कैसे जोड़ें?",
        a: "मैप पर अपनी दुकान या सर्विस एरिया चुनें, फ़ोटो अपलोड करें, GPS टैग इंजेक्ट करें और तैयार JPEG फ़ोटो को गूगल प्रोफ़ाइल पर अपलोड करें।",
      },
      {
        q: "कौन-से इमेज फॉर्मेट GPS EXIF मेटाडेटा को सपोर्ट करते हैं?",
        a: "EXIF GPS स्टैंडर्ड को मुख्य रूप से JPEG/JPG फॉर्मेट सपोर्ट करता है, और हमारा टूल पूरी तरह अनुकूलित JPEG फ़ाइल जनरेट करता है।",
      },
      {
        q: "क्या मेरी तस्वीरें और लोकेशन डेटा सुरक्षित रहते हैं?",
        a: "हाँ 100% सुरक्षित। सारा काम आपके ब्राउज़र में होता है, कोई भी फ़ाइल हमारे सर्वर पर नहीं भेजी जाती।",
      },
    ],
  },
  "online-image-compressor": {
    path: "/hi/free-online-image-compressor",
    navLabel: "फोटो कम्प्रेसर",
    metaTitle: "फोटो का साइज कम करें — मुफ़्त इमेज कम्प्रेसर ऑनलाइन | ImageSEO",
    metaDescription: "JPG, PNG और WebP तस्वीरों को एक साथ कम्प्रेस करें बिना क्लेرिटी खोए। सरकारी फॉर्म, जॉब पोर्टल और वेबसाइट के लिए तुरंत साइज़ कम करें।",
    h1: "फोटो का साइज कम करने का मुफ़्त ऑनलाइन टूल",
    heroEyebrow: "ब्राउज़र में तेज़ फोटो कम्प्रेशन",
    heroBody: "सरकारी फॉर्म, प्रतियोगी परीक्षाओं और वेबसाइट के लिए कई JPG, PNG तस्वीरों का साइज़ एक साथ KB में कम करें। 100% मुफ़्त और सुरक्षित।",
    mode: "compressor",
    accent: "bg-gradient-to-b from-violet-50 via-background to-background dark:from-violet-950/20",
    badgeClass: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
    primaryKeyword: "फोटो का साइज कम करना",
    secondaryKeywords: ["फोटो कम्प्रेस", "jpg फोटो कम्प्रेस", "इमेज का साइज कम करना"],
    schemaType: "WebApplication",
    howToSteps: [
      { title: "तस्वीरें चुनें", body: "जितनी चाहें उतनी तस्वीरें बिना लिमिट के चुनें।" },
      { title: "क्वालिटी स्लाइडर सेट करें", body: "ज़रूरत के मुताबिक फ़ाइल साइज़ सेट करें।" },
      { title: "एक क्लिक में डाउनलोड करें", body: "कम्प्रेस की गई तस्वीरें तुरंत डाउनलोड करें।" },
    ],
    faqs: [
      {
        q: "यह इमेज कम्प्रेसर फ़ोटो की क्लेरिटी बनाए रखते हुए साइज़ कैसे घटाता है?",
        a: "यह टूल स्मार्ट कैनवास एल्गोरिदम का उपयोग करके अनदेखे पिक्सेल डेटा को हटाता है, जिससे बिना क्वालिटी खोए फ़ाइल साइज़ KB में बहुत कम हो जाता है।",
      },
      {
        q: "वेबसाइट के लिए फ़ोटो का आदर्श साइज़ (KB) कितना होना चाहिए?",
        a: "वेबसाइट बैनर के लिए 150KB–200KB से कम, ब्लॉग और प्रोडक्ट फ़ोटो के लिए 50KB–100KB, और थंबनेल के लिए 30KB से कम साइज़ सबसे अच्छा माना जाता है।",
      },
      {
        q: "क्या फ़ोटो का साइज़ कम करने से Google PageSpeed स्कोर बढ़ता है?",
        a: "हाँ, भारी फ़ोटो वेबसाइट धीमी होने का सबसे बड़ा कारण हैं। कम्प्रेस करने से कुल पेज वेट 80% तक घट जाता है और स्पीड बढ़ जाती है।",
      },
      {
        q: "क्या फ़ोटो कम्प्रेस करने की कोई दैनिक सीमा या शुल्क है?",
        a: "कोई सीमा नहीं है। यह टूल आपके अपने डिवाइस की पावर पर चलता है और पूरी तरह मुफ़्त है।",
      },
      {
        q: "क्या सरकारी फॉर्म या रिज़्यूमे की तस्वीरें अपलोड करना सुरक्षित है?",
        a: "पूरी तरह सुरक्षित। आपकी तस्वीरें कभी भी इंटरनेट पर किसी सर्वर पर नहीं भेजी जाती हैं।",
      },
    ],
  },
};
