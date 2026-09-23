import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SeoHead } from "@/components/seo/seo-head";

function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-slate-50"><SeoHead title={`${title} | IMGSEO`} description={`${title} for IMGSEO browser-based image tools.`} path={title === "Privacy Policy" ? "/privacy" : "/terms"} noindex /><Navbar /><main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16"><article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10"><p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">IMGSEO</p><h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">{title}</h1><div className="mt-8 space-y-7 text-sm leading-7 text-slate-600">{children}</div></article></main><Footer /></div>;
}

export function PrivacyPage() {
  return <LegalShell title="Privacy Policy">
    <p><strong>Last reviewed: September 23, 2026.</strong> This page describes the behavior observed in the current IMGSEO application. It is informational and is not legal advice.</p>
    <section><h2 className="text-xl font-black text-slate-900">Images and browser processing</h2><p className="mt-2">The image conversion, compression, and GPS metadata workflows process selected files in your browser and create downloads on your device. The application code does not send the image files to an IMGSEO upload endpoint or store them on an IMGSEO server.</p></section>
    <section><h2 className="text-xl font-black text-slate-900">Location search and map services</h2><p className="mt-2">The geo-tagger can load map tiles from OpenStreetMap tile infrastructure and send a location search query to the public Nominatim service when you use the search box. Do not enter sensitive information into a location search. Review those providers’ own terms and privacy policies before use.</p></section>
    <section><h2 className="text-xl font-black text-slate-900">Data stored by the app</h2><p className="mt-2">The current client code does not intentionally create an IMGSEO account, image library, or server-side processing record. Browser memory, object URLs, and downloaded files are controlled by your device and browser.</p></section>
    <section><h2 className="text-xl font-black text-slate-900">Changes and contact</h2><p className="mt-2">This policy may change when the application behavior changes. No contact email was present in the inspected project, so do not assume an email-based support channel exists.</p></section>
  </LegalShell>;
}

export function TermsPage() {
  return <LegalShell title="Terms of Service">
    <p><strong>Last reviewed: September 23, 2026.</strong> These terms summarize use of the current IMGSEO browser tools and are informational, not legal advice.</p>
    <section><h2 className="text-xl font-black text-slate-900">Use of the tools</h2><p className="mt-2">You may use the tools for lawful image conversion, compression, and metadata workflows. You are responsible for the files you select, the coordinates you embed, and your right to use or publish the resulting images.</p></section>
    <section><h2 className="text-xl font-black text-slate-900">Results and limitations</h2><p className="mt-2">Outputs depend on browser support, source files, format, quality settings, and third-party map services. Check downloaded files before publishing. IMGSEO does not guarantee a particular file size, visual result, search ranking, or platform behavior.</p></section>
    <section><h2 className="text-xl font-black text-slate-900">Third-party services</h2><p className="mt-2">The map workflow uses third-party map tiles and geocoding services. Their availability and terms are outside IMGSEO’s control.</p></section>
    <section><h2 className="text-xl font-black text-slate-900">Changes</h2><p className="mt-2">The application and these terms may change as features change. Continued use after an update means you should review the current page.</p></section>
  </LegalShell>;
}
