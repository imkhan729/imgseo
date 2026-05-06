export function SEOContent() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
          <h2 className="text-3xl font-extrabold tracking-tight mb-6">Image SEO for Local Business: The Complete Guide</h2>

          <h3 className="text-xl font-bold mt-8 mb-3">What Is Image SEO for Local Business?</h3>
          <p className="text-muted-foreground leading-relaxed">
            Image SEO for local business is the practice of optimizing your website and Google Business Profile images so they rank higher in Google Image Search and local results. This includes compressing images for speed, using keyword-rich file names, writing descriptive ALT text, and adding geo metadata that signals your location to search engines.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-3">How to Optimize Images for Google Ranking</h3>
          <p className="text-muted-foreground leading-relaxed">
            To optimize images for Google ranking, you need to: (1) reduce image file size without losing quality — smaller files load faster and Google rewards fast pages, (2) name your image files with your target keyword and location before uploading, (3) add descriptive ALT text that includes your service and city, and (4) convert images to WebP format, which is Google's preferred modern image format.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-3">Reduce Image Size Without Losing Quality</h3>
          <p className="text-muted-foreground leading-relaxed">
            You can reduce image size without losing quality by using lossy compression at 70–85% quality and converting to WebP. IMGSEO uses the browser's native Canvas API to compress your images locally — no upload required, no privacy risk. A 2MB JPG can typically be reduced to under 200KB in WebP format with no visible quality difference.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-3">Local SEO Image Optimization Best Practices</h3>
          <p className="text-muted-foreground leading-relaxed">
            Local SEO image optimization means consistently using your city and service keyword in every image asset you upload — your website, Google Business Profile, social media, and directory listings. File names should follow the format: <code className="text-primary font-mono text-sm">keyword-city-businessname.webp</code>. ALT text should describe the image naturally while including your location.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-3">Google Business Profile Image Optimization</h3>
          <p className="text-muted-foreground leading-relaxed">
            Google Business Profile (formerly Google My Business) images directly impact your local ranking and click-through rate. Upload images at 720x720px or larger, use WebP format where possible, and ensure each photo has an SEO-optimized file name before uploading. Google cannot read ALT text from GBP images, so the file name is your only keyword signal.
          </p>
        </div>
      </div>
    </section>
  );
}
