import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toolPageConfigs } from "@/lib/tool-pages";

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
