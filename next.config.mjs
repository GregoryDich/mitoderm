import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained `.next/standalone` build — required for the slim
  // production Docker image (Dockerfile copies only standalone + static).
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 200, 256, 384],
  },
  async redirects() {
    return [
      {
        // Redirect any unknown single-segment path to the default locale,
        // but exclude file-like paths (anything with a dot, e.g. sitemap.xml,
        // robots.txt, favicon.ico) and the api/_next/_vercel namespaces.
        source: '/:slug((?!en|ru|he|api|admin|_next|_vercel)[^/.]+)',
        destination: '/en',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
