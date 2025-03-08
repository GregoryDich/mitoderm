import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:slug((?!en|ru|he)[^/]+)',
        destination: '/en',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
