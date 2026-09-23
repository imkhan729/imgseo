import { ToolPageConfig } from "@/lib/tool-pages";
import { FileArchive, Globe2, Layers3, MapPinned, Sparkles, Zap, ShieldCheck } from "lucide-react";

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
    icon: FileArchive,
    primaryKeyword: "conversor webp gratis",
    secondaryKeywords: ["converter imagem para webp", "converter jpg em webp", "converter png em webp"],
    schemaType: "WebApplication",
    featureBullets: [
      "Conversão 100% no seu navegador sem filas ou limites de arquivos",
      "Gera arquivos WebP leves mantendo transparência alfa perfeita",
      "Economiza até 80% de largura de banda e acelera o carregamento móvel",
    ],
    stats: [
      { label: "Economia de espaço", value: "Até -80%" },
      { label: "Processamento", value: "100% Local" },
      { label: "Compatibilidade", value: "97%+ global" },
    ],
    sections: [
      {
        id: "por-que-webp",
        title: "Por que o WebP é essencial para o SEO e velocidade de carregamento?",
        body: "O Google recomenda formalmente a utilização de formatos de imagem de nova geração como o WebP. Imagens tradicionais em JPEG e PNG frequentemente compõem mais de 65% do peso total de uma página web, atrasando a navegação em celulares e prejudicando as notas de Core Web Vitals (principalmente Largest Contentful Paint ou LCP).",
        points: [
          "Arquivos até 35% mais leves que o JPEG mantendo nitidez e fidelidade visual idênticas.",
          "Suporte nativo a canais de transparência alfa com tamanho até 70% menor que o PNG-24.",
          "Acelera a pontuação no Google PageSpeed Insights e diminui a taxa de rejeição de visitantes.",
        ],
        icon: Globe2,
      },
      {
        id: "casos-uso",
        title: "Onde aplicar a otimização com imagens WebP",
        body: "Qualquer site comercial ou de conteúdo ganha vantagens competitivas imediatas com o WebP: e-commerces (Shopify, WooCommerce, Nuvemshop), blogs em WordPress, landing pages e portais de notícias.",
        points: [
          "Banners principais e fotos de destaque para atingir LCP abaixo de 2,5 segundos.",
          "Catálogos de produtos de lojas virtuais para carregamento ágil em redes móveis 3G e 4G.",
          "Ilustrações, infográficos e capturas de tela para manter o consumo de dados leve.",
        ],
        icon: Layers3,
      },
    ],
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
    icon: MapPinned,
    primaryKeyword: "adicionar localizacao em foto",
    secondaryKeywords: ["geotag foto gratis", "editor exif gps", "colocar localizacao em imagem"],
    schemaType: "WebApplication",
    featureBullets: [
      "Injeta coordenadas GPS de latitude e longitude diretamente nos metadados EXIF da foto",
      "Mapa interativo de alta precisão para selecionar qualquer endereço ou área de atendimento",
      "100% privado na memória do seu navegador sem envio de arquivos para a nuvem",
    ],
    stats: [
      { label: "Impacto Local", value: "Google Pack 3" },
      { label: "Privacidade", value: "0 Uploads em nuvem" },
      { label: "Formato", value: "JPEG / EXIF" },
    ],
    sections: [
      {
        id: "importancia-geotagging",
        title: "Como a geolocalização de fotos fortalece o SEO local?",
        body: "Quando o Google analisa o Perfil da Empresa no Google (Google Meu Negócio) ou páginas de destino locais, ele busca evidências que confirmem a autenticidade da sua localização física. Metadados de GPS embutidos no cabeçalho EXIF comprovam onde os serviços foram executados.",
        points: [
          "Verificação geográfica tangível para os algoritmos de busca do Google Maps.",
          "Aumento significativo na probabilidade de rankear no Google Local 3-Pack.",
          "Criação de um sinal geográfico forte alinhando GPS, nome do arquivo e página de contato.",
        ],
        icon: Globe2,
      },
      {
        id: "boas-praticas",
        title: "Estratégia prática de geotagging para prestadores de serviços",
        body: "Para empresas de reformas, encanadores, eletricistas ou advogados, marque as fotos nos diferentes bairros onde os projetos foram concluídos, expandindo sua área de relevância local.",
        points: [
          "Publique de 3 a 5 fotos reais com geotag semanalmente no Google Meu Negócio.",
          "Associe as coordenadas a nomes de arquivos descritivos (ex: reforma-cozinha-copacabana.jpg).",
          "Mantenha consistência entre a localização da foto e o texto da página de destino.",
        ],
        icon: Sparkles,
      },
    ],
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
    icon: Zap,
    primaryKeyword: "comprimir fotos online",
    secondaryKeywords: ["diminuir tamanho de foto", "reduzir tamanho de imagem", "comprimir jpg"],
    schemaType: "WebApplication",
    featureBullets: [
      "Compressão em lote de altíssima velocidade com download imediato em arquivo ZIP",
      "Ajuste fino de qualidade para balancear economia de KBs com nitidez impecável",
      "Sem marcas d'água, sem assinaturas e 100% confidencial no seu hardware",
    ],
    stats: [
      { label: "Redução média", value: "70% a 90%" },
      { label: "Velocidade", value: "Instantânea" },
      { label: "Segurança", value: "100% Local" },
    ],
    sections: [
      {
        id: "beneficios-compressao",
        title: "Por que diminuir o tamanho das imagens é crucial para o ranking do Google?",
        body: "A velocidade de carregamento é um fator de ranqueamento confirmado pelo Google. Páginas pesadas com imagens não comprimidas causam atrasos severos, frustram visitantes e elevam o abandono de carrinhos de compras em lojas virtuais.",
        points: [
          "Redução drástica no consumo de dados móveis para usuários de smartphones.",
          "Melhora direta na métrica Largest Contentful Paint (LCP) do Core Web Vitals.",
          "Economia significativa de transferência e largura de banda na sua hospedagem.",
        ],
        icon: Globe2,
      },
      {
        id: "tamanhos-recomendados",
        title: "Pesos ideais recomendados em KB para cada tipo de imagem",
        body: "Para passar em todos os testes do Google PageSpeed Insights com pontuação verde superior a 90:",
        points: [
          "Imagens de capa e banners principais: manter abaixo de 150 KB.",
          "Fotos de artigos, produtos e galerias: entre 40 KB e 90 KB.",
          "Logotipos, ícones e miniaturas: abaixo de 25 KB.",
        ],
        icon: ShieldCheck,
      },
    ],
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
    icon: FileArchive,
    primaryKeyword: "تحويل الصور الى webp",
    secondaryKeywords: ["تحويل jpg الى webp", "تحويل png الى webp", "برنامج تحويل webp"],
    schemaType: "WebApplication",
    featureBullets: [
      "تحويل فوري 100% في المتصفح دون حدود لحجم أو عدد الصور",
      "إنشاء ملفات WebP خفيفة للغاية مع الحفاظ على شفافية الخلفية",
      "توفير حتى 80% من استهلاك بيانات الهاتف وتسريع تحميل الموقع",
    ],
    stats: [
      { label: "توفير الحجم", value: "حتى -80%" },
      { label: "المعالجة", value: "100% محلية" },
      { label: "التوافق", value: "97%+ عالميًا" },
    ],
    sections: [
      {
        id: "لماذا-webp",
        title: "لماذا تعد صيغة WebP أساسية لتحسين السيو وسرعة المواقع؟",
        body: "توصي شركة جوجل رسميًا باعتماد صيغ الجيل الجديد مثل WebP لتسريع مواقع الويب. تشكل الصور التقليدية (JPG و PNG) غالبًا أكثر من 65% من إجمالي حجم صفحات الويب، مما يؤدي إلى بطء التحميل على الهواتف وتراجع مؤشرات تجربة المستخدم الأساسية (Core Web Vitals).",
        points: [
          "ملفات أخف بنسبة تصل إلى 35% مقارنة بـ JPEG مع نفس درجة الوضوح والنقاء.",
          "دعم ميزة الخلفيات الشفافة بحجم أقل بنسبة 70% مقارنة بصيغ PNG-24.",
          "تحسين فوري لنتائج موقعك في Google PageSpeed Insights وخفض معدل الارتداد.",
        ],
        icon: Globe2,
      },
      {
        id: "استخدامات-webp",
        title: "أفضل استخدامات صور WebP في المتاجر والمواقع",
        body: "يستفيد أي موقع إلكتروني أو متجر رقمي (مثل ووردبريس أو سلة أو زد أو شوبيفاي) من تحويل الصور إلى WebP لزيادة سرعة التحميل ورفع المبيعات.",
        points: [
          "صور البانر والواجهة الرئيسية لتحقيق سرعة تحميل LCP في أقل من 2.5 ثانية.",
          "كتالوجات المنتجات لتمكين التصفح السريع والسهل على شبكات الجوال.",
          "الرسومات التوضيحية ولقطات الشاشة في المقالات والمدونات لتقليل استهلاك السيرفر.",
        ],
        icon: Layers3,
      },
    ],
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
    icon: MapPinned,
    primaryKeyword: "إضافة إحداثيات للصورة",
    secondaryKeywords: ["تحديد موقع الصورة gps", "تعديل بيانات exif للصور", "جيو تاج للصور"],
    schemaType: "WebApplication",
    featureBullets: [
      "دمج إحداثيات خط الطول وخط العرض GPS في ترويسة بيانات EXIF للصور",
      "خريطة تفاعلية دقيقة لتحديد مقر نشاطك التجاري أو مناطق تقديم الخدمة",
      "معالجة خاصة 100% داخل المتصفح دون رفع أي صورة إلى الإنترنت",
    ],
    stats: [
      { label: "السيو المحلي", value: "Google Map Pack" },
      { label: "الخصوصية", value: "0 رفع للخوادم" },
      { label: "الصيغة المدعومة", value: "JPEG / EXIF" },
    ],
    sections: [
      {
        id: "أهمية-جيوتاج",
        title: "كيف تدعم إضافة إحداثيات GPS في الصور ترتيب السيو المحلي؟",
        body: "عندما تقوم خوارزميات جوجل بفحص الملف التجاري Google Business Profile أو صفحات الخدمات المحلية، فإنها تبحث عن إشارات تثبت تواجدك الفعلي. بيانات الموقع الجغرافي المدمجة في ترويسة EXIF تمنح محركات البحث تأكيدًا ماديًا لنشاطك.",
        points: [
          "إثبات موثوقية النطاق الجغرافي لخدماتك أمام خوارزميات خرائط جوجل.",
          "زيادة فرص الظهور في النتائج الثلاث الأولى المميزة في بحث الخرائط (Local 3-Pack).",
          "بناء توافق جغرافي متكامل بين الصور وعنوان العمل واسم ملف الصورة.",
        ],
        icon: Globe2,
      },
      {
        id: "أفضل-الممارسات",
        title: "نصائح عملية لأصحاب الأنشطة والخدمات الميدانية",
        body: "للشركات الخدمية مثل أعمال الديكور أو السباكة أو الصيانة، قم بتحديد موقع كل صورة في الحي أو المدينة التي أُنجز فيها العمل لتعزيز انتشارك في مناطق جغرافية متعددة.",
        points: [
          "أضف 3 إلى 5 صور جديدة محددة جغرافيًا أسبوعيًا لملفك التجاري على جوجل.",
          "ادمج الإحداثيات مع أسماء ملفات وصفية دقيقة (مثل: صيانة-مكيفات-الرياض.jpg).",
          "اربط بين محتوى صفحة الموقع والبيانات الجغرافية المضمنة في الصور.",
        ],
        icon: Sparkles,
      },
    ],
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
    icon: Zap,
    primaryKeyword: "ضغط الصور مجانا",
    secondaryKeywords: ["تقليل حجم الصور", "ضغط صور jpg", "تصغير حجم الصور بالكيلوبايت"],
    schemaType: "WebApplication",
    featureBullets: [
      "ضغط جماعي فائق السرعة مع إمكانية التنزيل الفوري في ملف ZIP منظم",
      "مؤشر دقيق للتحكم في الجودة لتحقيق توازن مثالي بين توفير الكيلوبايت ونقاء الصورة",
      "بدون أي علامات مائية أو رسوم اشتراك مع حماية كاملة لخصوصيتك",
    ],
    stats: [
      { label: "نسبة الضغط", value: "70% إلى 90%" },
      { label: "السرعة", value: "فورية" },
      { label: "الخصوصية", value: "100% في جهازك" },
    ],
    sections: [
      {
        id: "أهمية-ضغط-الصور",
        title: "لماذا يعد تقليل حجم الصور ضروريًا لتصدر نتائج جوجل؟",
        body: "تعتبر سرعة تحميل الصفحة عاملاً أساسياً في خوارزميات ترتيب المواقع لدى جوجل. الصور ذات الأحجام الكبيرة تسبب بطئًا شديدًا وتزيد من مغادرة الزوار للموقع قبل إتمام الشراء أو التصفح.",
        points: [
          "تقليل استهلاك باقات الإنترنت للهواتف المحمولة بشكل ملحوظ.",
          "تحسين مباشر لمؤشر Largest Contentful Paint (LCP) وتسريع فتح الموقع.",
          "توفير مساحات التخزين ومعدل نقل البيانات (Bandwidth) في خادم الاستضافة.",
        ],
        icon: Globe2,
      },
      {
        id: "الأحجام-المثالية",
        title: "الأحجام الموصى بها بالكيلوبايت لأنواع الصور المختلفة",
        body: "للحصول على العلامة الخضراء في أداة Google PageSpeed Insights واجتياز الفحص بكفاءة:",
        points: [
          "صور البانر والواجهات الرئيسية: يفضل أن تكون أقل من 150 كيلوبايت.",
          "صور المنتجات والمقالات: بين 40 كيلوبايت و 90 كيلوبايت.",
          "الشعارات والأيقونات والصور المصغرة: أقل من 25 كيلوبايت.",
        ],
        icon: ShieldCheck,
      },
    ],
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
    icon: FileArchive,
    primaryKeyword: "ubah foto ke webp",
    secondaryKeywords: ["ubah jpg ke webp", "convert jpg ke webp", "konverter webp online"],
    schemaType: "WebApplication",
    featureBullets: [
      "Konversi 100% lokal di browser tanpa antrean atau batasan jumlah file",
      "Hasilkan format WebP ultra ringan dengan transparansi latar belakang tetap utuh",
      "Hemat bandwidth internet hingga 80% dan percepat loading website di HP",
    ],
    stats: [
      { label: "Penghematan", value: "Hingga -80%" },
      { label: "Pemrosesan", value: "100% di Browser" },
      { label: "Dukungan", value: "97%+ Browser" },
    ],
    sections: [
      {
        id: "mengapa-webp",
        title: "Mengapa Format WebP Sangat Krusial untuk SEO dan Kecepatan Web?",
        body: "Google secara resmi merekomendasikan penggunaan format gambar generasi terbaru seperti WebP. Gambar JPG dan PNG tradisional biasanya menyumbang lebih dari 65% dari total berat halaman web, menyebabkan loading lambat pada smartphone dan menurunkan skor Core Web Vitals (terutama Largest Contentful Paint atau LCP).",
        points: [
          "Ukuran file hingga 35% lebih kecil daripada JPG dengan ketajaman visual yang sama persis.",
          "Mendukung transparansi (alpha channel) dengan ukuran 70% lebih hemat daripada PNG-24.",
          "Meningkatkan skor performa di Google PageSpeed Insights dan menurunkan bounce rate.",
        ],
        icon: Globe2,
      },
      {
        id: "kasus-penggunaan",
        title: "Di Mana Saja Format WebP Harus Digunakan?",
        body: "Semua website bisnis dan portal berita mendapatkan manfaat instan dari WebP: toko online (WooCommerce, Shopify, Tokopedia seller pages), blog WordPress, dan landing page.",
        points: [
          "Foto banner utama (Hero Image) untuk mencapai LCP di bawah 2,5 detik.",
          "Katalog foto produk agar pembeli dapat menjelajah dengan lancar di jaringan HP 4G.",
          "Gambar artikel dan screenshot panduan agar website tetap ringan diakses.",
        ],
        icon: Layers3,
      },
    ],
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
    icon: MapPinned,
    primaryKeyword: "tambah lokasi foto",
    secondaryKeywords: ["geotag foto online", "edit exif gps foto", "pasang lokasi pada foto"],
    schemaType: "WebApplication",
    featureBullets: [
      "Menyisipkan koordinat latitude dan longitude GPS langsung ke header EXIF foto",
      "Peta interaktif presisi tinggi untuk memilih lokasi usaha atau area layanan bisnis",
      "100% aman dan privat di browser tanpa proses upload ke server eksternal",
    ],
    stats: [
      { label: "Dampak Lokal", value: "Google Local 3-Pack" },
      { label: "Privasi", value: "0 Upload Cloud" },
      { label: "Format", value: "JPEG / EXIF" },
    ],
    sections: [
      {
        id: "manfaat-geotag",
        title: "Bagaimana Geotagging Foto Meningkatkan Peringkat SEO Lokal?",
        body: "Ketika Google merayapi Profil Bisnis Google (GBP) atau landing page lokal Anda, algoritma mencari bukti fisik yang memvalidasi lokasi operasional usaha Anda. Metadata GPS pada file gambar memberikan sinyal geografis yang kuat dan otentik.",
        points: [
          "Konfirmasi nyata area jangkauan bisnis untuk algoritma Google Maps.",
          "Meningkatkan peluang tampil di posisi 3 Teratas Google Maps (Local 3-Pack).",
          "Membangun sinyal lokasi yang solid antara foto, nama file, dan alamat di website.",
        ],
        icon: Globe2,
      },
      {
        id: "tips-praktis",
        title: "Strategi Geotagging Efektif untuk Penyedia Jasa & UMKM",
        body: "Bagi bisnis jasa seperti renovasi rumah, AC, bengkel, atau katering, pasang geotag pada foto di setiap lokasi proyek pelanggan untuk memperluas jangkauan pencarian lokal.",
        points: [
          "Upload 3 hingga 5 foto ber-geotag setiap minggu ke Google Bisnisku.",
          "Gunakan nama file yang jelas mengandung kata kunci dan lokasi (contoh: servis-ac-jakarta-selatan.jpg).",
          "Pastikan koordinat foto sesuai dengan target area layanan pelanggan Anda.",
        ],
        icon: Sparkles,
      },
    ],
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
    icon: Zap,
    primaryKeyword: "kompres foto online",
    secondaryKeywords: ["perkecil ukuran foto", "kompres jpg", "kurangi ukuran foto kb"],
    schemaType: "WebApplication",
    featureBullets: [
      "Kompresi massal secepat kilat dengan opsi unduh langsung dalam file ZIP rapi",
      "Pengatur kualitas cerdas untuk menyeimbangkan ukuran KB kecil dan gambar jernih",
      "Tanpa watermark, tanpa biaya langganan, dan 100% aman di perangkat Anda",
    ],
    stats: [
      { label: "Pengurangan", value: "70% hingga 90%" },
      { label: "Kecepatan", value: "Instan" },
      { label: "Keamanan", value: "100% Privat" },
    ],
    sections: [
      {
        id: "manfaat-kompresi",
        title: "Mengapa Kompresi Gambar Sangat Penting untuk Performa Website?",
        body: "Kecepatan muat halaman merupakan salah satu faktor penentu peringkat Google. Gambar berukuran besar memperlambat website, membuat pengunjung frustrasi, dan menyebabkan mereka meninggalkan website sebelum membaca atau berbelanja.",
        points: [
          "Menghemat kuota internet pengunjung yang membuka website via smartphone.",
          "Meningkatkan skor Largest Contentful Paint (LCP) pada audit Core Web Vitals.",
          "Mengurangi beban penyimpanan server hosting dan menghemat biaya bandwidth.",
        ],
        icon: Globe2,
      },
      {
        id: "rekomendasi-kb",
        title: "Panduan Ukuran File KB yang Ideal untuk Setiap Jenis Gambar",
        body: "Untuk mendapatkan skor hijau di atas 90 pada Google PageSpeed Insights:",
        points: [
          "Gambar banner utama dan slider: jaga di bawah 150 KB.",
          "Foto produk dan gambar artikel: antara 40 KB hingga 90 KB.",
          "Logo, icon, dan thumbnail: di bawah 25 KB.",
        ],
        icon: ShieldCheck,
      },
    ],
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
    icon: FileArchive,
    primaryKeyword: "फोटो को webp में बदलें",
    secondaryKeywords: ["jpg से webp कन्वर्टर", "png से webp कन्वर्टर", "इमेज कन्वर्टर ऑनलाइन"],
    schemaType: "WebApplication",
    featureBullets: [
      "ब्राउज़र में 100% मुफ़्त और सुपरफ़ास्ट कन्वर्शन बिना किसी दैनिक सीमा के",
      "पारदर्शी बैकग्राउंड (Alpha Transparency) को सुरक्षित रखते हुए हल्का WebP आउटपुट",
      "मोबाइल इंटरनेट डेटा की 80% तक बचत और वेबसाइट लोडिंग स्पीड में जबरदस्त सुधार",
    ],
    stats: [
      { label: "साइज़ बचत", value: "80% तक कम" },
      { label: "प्रोसेसिंग", value: "100% लोकल ब्राउज़र" },
      { label: "सपोर्ट", value: "97%+ ग्लोबल ब्राउज़र" },
    ],
    sections: [
      {
        id: "webp-फायदे",
        title: "वेबसाइट एसईओ और स्पीड के लिए WebP फॉर्मेट क्यों ज़रूरी है?",
        body: "Google आधिकारिक तौर पर आधुनिक नेक्स्ट-जेनरेशन फॉर्मेट जैसे WebP के उपयोग की सिफारिश करता है। पारंपरिक JPG और PNG फाइलें आमतौर पर वेबपेज के कुल वजन का 65% से अधिक हिस्सा लेती हैं, जिससे मोबाइल फोन पर वेबसाइट धीमी हो जाती है और Core Web Vitals स्कोर प्रभावित होता है।",
        points: [
          "समान विज़ुअल क्लैरिटी के साथ JPEG की तुलना में 35% तक छोटी और हल्की फाइलें।",
          "PNG-24 की तुलना में 70% कम साइज़ में ट्रांसपेरेंट बैकग्राउंड का पूर्ण समर्थन।",
          "Google PageSpeed Insights में हाई स्कोर और वेबसाइट बाउंस रेट में भारी कमी।",
        ],
        icon: Globe2,
      },
      {
        id: "उपयोग-केस",
        title: "WebP फॉर्मेट का उपयोग कहाँ करना सबसे फ़ायदेमंद है?",
        body: "ऑनलाइन स्टोर (E-commerce), वर्डप्रेस ब्लॉग, बिज़नेस वेबसाइट और लैंडिंग पेज सभी के लिए WebP का उपयोग रैंकिंग और यूज़र एक्सपीरियंस बढ़ाने में मदद करता है।",
        points: [
          "होमपेज बैनर और मुख्य फ़ोटो में LCP टाइम 2.5 सेकंड से कम रखने के लिए।",
          "ऑनलाइन प्रोडक्ट कैटलॉग ताकि ग्राहक मोबाइल नेटवर्क पर भी बिना रुकावट ब्राउज़ कर सकें।",
          "ब्लॉग और आर्टिकल्स में स्क्रीनशॉट और इमेजेस को हल्का रखने के लिए।",
        ],
        icon: Layers3,
      },
    ],
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
    icon: MapPinned,
    primaryKeyword: "फोटो में लोकेशन डालना",
    secondaryKeywords: ["फोटो का gps लोकेशन कैसे देखें", "इमेज जियोटैगिंग टूल", "फोटो में पता डालना"],
    schemaType: "WebApplication",
    featureBullets: [
      "फ़ोटो के EXIF हेडर में सीधे अक्षांश (Latitude) और देशांतर (Longitude) GPS कोऑर्डिनेट्स जोड़ें",
      "सटीक बिज़नेस लोकेशन या सर्विस एरिया चुनने के लिए हाई-प्रिसिजन इंटरएक्टिव मैप",
      "ब्राउज़र में 100% प्राइवेट प्रोसेसिंग — कोई भी फ़ोटो क्लाउड पर अपलोड नहीं होती",
    ],
    stats: [
      { label: "लोकल एसईओ", value: "Google Map Pack" },
      { label: "प्राइवेसी", value: "0 सर्वर अपलोड" },
      { label: "सपोर्टेड फॉर्मेट", value: "JPEG / EXIF" },
    ],
    sections: [
      {
        id: "जियोटैगिंग-का-महत्व",
        title: "फ़ोटो में GPS लोकेशन जोड़ने से लोकल एसईओ में कैसे मदद मिलती है?",
        body: "जब Google आपके Google Business Profile (गूगल माय बिज़नेस) या लोकल लैंडिंग पेज को स्कैन करता है, तो वह आपके व्यवसाय के भौतिक स्थान की पुष्टि के संकेत खोजता है। EXIF हेडर में एम्बेडेड GPS डेटा सर्च इंजन को आपके काम का सटीक भौगोलिक प्रमाण देता है।",
        points: [
          "Google Maps एल्गोरिदम के लिए आपके कार्यक्षेत्र का प्रामाणिक सत्यापन।",
          "मोबाइल सर्च में प्रतिष्ठित Local 3-Pack रैंकिंग में शामिल होने की संभावना में वृद्धि।",
          "फ़ोटो लोकेशन, फ़ाइल नाम और वेबसाइट पते के बीच एक मजबूत लोकल सिग्नल का निर्माण।",
        ],
        icon: Globe2,
      },
      {
        id: "सर्वश्रेष्ठ-तरीके",
        title: "सर्विस बिज़नेस और दुकानदारों के लिए उपयोगी सुझाव",
        body: "प्लंबर, इलेक्ट्रीशियन, इंटीरियर डिज़ाइनर या रिपेयर सर्विस देने वाले व्यवसायों को अपने हालिया प्रोजेक्ट्स की तस्वीरों में उस इलाके की लोकेशन टैग करनी चाहिए जहाँ काम पूरा हुआ है।",
        points: [
          "हर हफ्ते अपने गूगल बिज़नेस प्रोफ़ाइल पर 3 से 5 जियोटैग की गई असली तस्वीरें पोस्ट करें।",
          "GPS कोऑर्डिनेट्स के साथ डिस्क्रिप्टिव फ़ाइल नाम का उपयोग करें (जैसे: kitchen-renovation-south-delhi.jpg)।",
          "वेबसाइट के संपर्क पेज और सर्विस पेज पर भी इन जियोटैग की गई तस्वीरों को लगाएं।",
        ],
        icon: Sparkles,
      },
    ],
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
    metaDescription: "JPG, PNG और WebP तस्वीरों को एक साथ कम्प्रेस करें बिना क्लेरिटी खोए। सरकारी फॉर्म, जॉब पोर्टल और वेबसाइट के लिए तुरंत साइज़ कम करें।",
    h1: "फोटो का साइज कम करने का मुफ़्त ऑनलाइन टूल",
    heroEyebrow: "ब्राउज़र में तेज़ फोटो कम्प्रेशन",
    heroBody: "सरकारी फॉर्म, प्रतियोगी परीक्षाओं और वेबसाइट के लिए कई JPG, PNG तस्वीरों का साइज़ एक साथ KB में कम करें। 100% मुफ़्त और सुरक्षित।",
    mode: "compressor",
    accent: "bg-gradient-to-b from-violet-50 via-background to-background dark:from-violet-950/20",
    badgeClass: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
    icon: Zap,
    primaryKeyword: "फोटो का साइज कम करना",
    secondaryKeywords: ["फोटो कम्प्रेस", "jpg फोटो कम्प्रेस", "इमेज का साइज कम करना"],
    schemaType: "WebApplication",
    featureBullets: [
      "बिना किसी इंतज़ार के एक साथ दर्जनों फ़ोटो का सुपरफास्ट बल्क कम्प्रेशन और ZIP डाउनलोड",
      "क्वालिटी स्लाइडर से फ़ाइल का KB साइज़ और फोटो की शार्पनेस को आसानी से नियंत्रित करें",
      "बिना वॉटरमार्क, बिना रजिस्ट्रेशन और आपके डिवाइस में 100% सुरक्षित एवं गोपनीय",
    ],
    stats: [
      { label: "साइज़ में कमी", value: "70% से 90%" },
      { label: "स्पीड", value: "तुरंत (Instant)" },
      { label: "सुरक्षा", value: "100% लोकल" },
    ],
    sections: [
      {
        id: "कम्प्रेशन-का-महत्व",
        title: "वेबसाइट रैंकिंग और गूगल स्पीड के लिए फ़ोटो का साइज़ घटाना क्यों ज़रूरी है?",
        body: "Google पेज लोडिंग स्पीड को सीधे रैंकिंग फ़ैक्टर के रूप में उपयोग करता है। बिना कम्प्रेस की गई भारी तस्वीरें लोड होने में अधिक समय लेती हैं, जिससे मोबाइल उपयोगकर्ता तुरंत वेबसाइट छोड़ देते हैं।",
        points: [
          "मोबाइल यूज़र्स के इंटरनेट डेटा की भारी बचत और तुरंत लोडिंग।",
          "Core Web Vitals के सबसे महत्वपूर्ण मेट्रिक Largest Contentful Paint (LCP) में सुधार।",
          "वेबसाइट होस्टिंग के सर्वर बैंडविड्थ और लोड को बहुत कम करना।",
        ],
        icon: Globe2,
      },
      {
        id: "अनुशंसित-साइज़",
        title: "विभिन्न प्रकार की तस्वीरों के लिए अनुशंसित KB साइज़ गाइड",
        body: "Google PageSpeed Insights में 90+ का ग्रीन स्कोर हासिल करने के लिए आवश्यक गाइडलाइन्स:",
        points: [
          "मुख्य हेडर और बैनर इमेज: 150 KB से कम रखें।",
          "ब्लॉग और ई-कॉमर्स प्रोडक्ट फोटो: 40 KB से 90 KB के बीच रखें।",
          "लोगो, आइकन और थंबनेल: 25 KB से कम रखें।",
        ],
        icon: ShieldCheck,
      },
    ],
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
