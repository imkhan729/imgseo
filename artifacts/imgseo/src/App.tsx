import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toolPageConfigs } from "@/lib/tool-pages";
import { spanishToolConfigs } from "@/lib/spanish-tool-pages";
import {
  portugueseToolConfigs,
  arabicToolConfigs,
  indonesianToolConfigs,
  hindiToolConfigs,
} from "@/lib/multilingual-tool-pages";

const queryClient = new QueryClient();
const Home = lazy(() => import("@/pages/home"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const ToolPage = lazy(() => import("@/pages/tool-page").then((module) => ({ default: module.ToolPage })));
const FormatPairPage = lazy(() => import("@/pages/tool-page").then((module) => ({ default: module.FormatPairPage })));
const JpgCompressionPage = lazy(() => import("@/pages/tool-page").then((module) => ({ default: module.JpgCompressionPage })));
const NotFound = lazy(() => import("@/pages/not-found"));
const ImageSeo = lazy(() => import("@/pages/image-seo"));
const TargetSizePage = lazy(() => import("@/pages/target-size-page"));
const Privacy = lazy(() => import("@/pages/legal").then((module) => ({ default: module.PrivacyPage })));
const Terms = lazy(() => import("@/pages/legal").then((module) => ({ default: module.TermsPage })));

function RouteFallback() {
  return <div className="min-h-screen bg-background" aria-hidden="true" />;
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path="/" component={Home} />
      <Route path={toolPageConfigs["webp-converter"].path}>
        {() => <ToolPage config={toolPageConfigs["webp-converter"]} />}
      </Route>
      <Route path={toolPageConfigs["geo-tagger"].path}>
        {() => <ToolPage config={toolPageConfigs["geo-tagger"]} />}
      </Route>
      <Route path={toolPageConfigs["online-image-compressor"].path}>
        {() => <ToolPage config={toolPageConfigs["online-image-compressor"]} />}
      </Route>
      <Route path="/jpg-to-webp">
        {() => <FormatPairPage sourceFormat="JPG" />}
      </Route>
      <Route path="/png-to-webp">
        {() => <FormatPairPage sourceFormat="PNG" />}
      </Route>
      <Route path="/compress-jpg" component={JpgCompressionPage} />
      <Route path="/compress-image-to-kb" component={TargetSizePage} />
      <Route path="/image-seo" component={ImageSeo} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/blog/:slug" component={BlogPost} />

      {/* Spanish (es) Pilot Routes */}
      <Route path="/es" component={Home} />
      <Route path="/es/">{() => <Home />}</Route>
      <Route path={spanishToolConfigs["webp-converter"].path}>
        {() => <ToolPage config={spanishToolConfigs["webp-converter"]} />}
      </Route>
      <Route path={spanishToolConfigs["geo-tagger"].path}>
        {() => <ToolPage config={spanishToolConfigs["geo-tagger"]} />}
      </Route>
      <Route path={spanishToolConfigs["online-image-compressor"].path}>
        {() => <ToolPage config={spanishToolConfigs["online-image-compressor"]} />}
      </Route>
      <Route path="/es/jpg-to-webp">
        {() => <FormatPairPage sourceFormat="JPG" />}
      </Route>
      <Route path="/es/png-to-webp">
        {() => <FormatPairPage sourceFormat="PNG" />}
      </Route>
      <Route path="/es/compress-jpg" component={JpgCompressionPage} />
      <Route path="/es/compress-image-to-kb" component={TargetSizePage} />
      <Route path="/es/image-seo" component={ImageSeo} />

      {/* Portuguese (pt) Routes */}
      <Route path="/pt" component={Home} />
      <Route path="/pt/">{() => <Home />}</Route>
      <Route path={portugueseToolConfigs["webp-converter"].path}>
        {() => <ToolPage config={portugueseToolConfigs["webp-converter"]} />}
      </Route>
      <Route path={portugueseToolConfigs["geo-tagger"].path}>
        {() => <ToolPage config={portugueseToolConfigs["geo-tagger"]} />}
      </Route>
      <Route path={portugueseToolConfigs["online-image-compressor"].path}>
        {() => <ToolPage config={portugueseToolConfigs["online-image-compressor"]} />}
      </Route>
      <Route path="/pt/jpg-to-webp">
        {() => <FormatPairPage sourceFormat="JPG" />}
      </Route>
      <Route path="/pt/png-to-webp">
        {() => <FormatPairPage sourceFormat="PNG" />}
      </Route>
      <Route path="/pt/compress-jpg" component={JpgCompressionPage} />
      <Route path="/pt/compress-image-to-kb" component={TargetSizePage} />
      <Route path="/pt/image-seo" component={ImageSeo} />

      {/* Arabic (ar) Routes */}
      <Route path="/ar" component={Home} />
      <Route path="/ar/">{() => <Home />}</Route>
      <Route path={arabicToolConfigs["webp-converter"].path}>
        {() => <ToolPage config={arabicToolConfigs["webp-converter"]} />}
      </Route>
      <Route path={arabicToolConfigs["geo-tagger"].path}>
        {() => <ToolPage config={arabicToolConfigs["geo-tagger"]} />}
      </Route>
      <Route path={arabicToolConfigs["online-image-compressor"].path}>
        {() => <ToolPage config={arabicToolConfigs["online-image-compressor"]} />}
      </Route>
      <Route path="/ar/jpg-to-webp">
        {() => <FormatPairPage sourceFormat="JPG" />}
      </Route>
      <Route path="/ar/png-to-webp">
        {() => <FormatPairPage sourceFormat="PNG" />}
      </Route>
      <Route path="/ar/compress-jpg" component={JpgCompressionPage} />
      <Route path="/ar/compress-image-to-kb" component={TargetSizePage} />
      <Route path="/ar/image-seo" component={ImageSeo} />

      {/* Indonesian (id) Routes */}
      <Route path="/id" component={Home} />
      <Route path="/id/">{() => <Home />}</Route>
      <Route path={indonesianToolConfigs["webp-converter"].path}>
        {() => <ToolPage config={indonesianToolConfigs["webp-converter"]} />}
      </Route>
      <Route path={indonesianToolConfigs["geo-tagger"].path}>
        {() => <ToolPage config={indonesianToolConfigs["geo-tagger"]} />}
      </Route>
      <Route path={indonesianToolConfigs["online-image-compressor"].path}>
        {() => <ToolPage config={indonesianToolConfigs["online-image-compressor"]} />}
      </Route>
      <Route path="/id/jpg-to-webp">
        {() => <FormatPairPage sourceFormat="JPG" />}
      </Route>
      <Route path="/id/png-to-webp">
        {() => <FormatPairPage sourceFormat="PNG" />}
      </Route>
      <Route path="/id/compress-jpg" component={JpgCompressionPage} />
      <Route path="/id/compress-image-to-kb" component={TargetSizePage} />
      <Route path="/id/image-seo" component={ImageSeo} />

      {/* Hindi (hi) Routes */}
      <Route path="/hi" component={Home} />
      <Route path="/hi/">{() => <Home />}</Route>
      <Route path={hindiToolConfigs["webp-converter"].path}>
        {() => <ToolPage config={hindiToolConfigs["webp-converter"]} />}
      </Route>
      <Route path={hindiToolConfigs["geo-tagger"].path}>
        {() => <ToolPage config={hindiToolConfigs["geo-tagger"]} />}
      </Route>
      <Route path={hindiToolConfigs["online-image-compressor"].path}>
        {() => <ToolPage config={hindiToolConfigs["online-image-compressor"]} />}
      </Route>
      <Route path="/hi/jpg-to-webp">
        {() => <FormatPairPage sourceFormat="JPG" />}
      </Route>
      <Route path="/hi/png-to-webp">
        {() => <FormatPairPage sourceFormat="PNG" />}
      </Route>
      <Route path="/hi/compress-jpg" component={JpgCompressionPage} />
      <Route path="/hi/compress-image-to-kb" component={TargetSizePage} />
      <Route path="/hi/image-seo" component={ImageSeo} />

      <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
