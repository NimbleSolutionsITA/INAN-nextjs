/** @type {import('next').NextConfig} */
// const path = require("node:path");
const allowedImageWordPressDomain = new URL( process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ).hostname;
const WORDPRESS_SITE_URL = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL;
module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  experimental: {
      scrollRestoration: true
  },
  /*webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300
    }
    return config
  },*/
  env: {
    REVALIDATION_TOKEN: process.env.REVALIDATION_TOKEN
  },
  /*sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },*/
  /**
   * We specify which domains are allowed to be optimized.
   * This is needed to ensure that external urls can't be abused.
   * @see https://nextjs.org/docs/basic-features/image-optimization#domains
   */
  images: {
    domains: [ allowedImageWordPressDomain, 'via.placeholder.com' ],
  },
  async redirects() {
      return [
          {
              source: '/product',
              destination: '/shop',
              permanent: true,
          },
          {
              source: '/customer_service',
              destination: '/customer_service/contact',
              permanent: true,
          },
          {
              source: '/customer-service',
              destination: '/customer_service/contact',
              permanent: true,
          },
          {
              source: '/customer-service/:slug',
              destination: '/customer_service/:slug',
              permanent: true,
          },
          {
              source: '/contact',
              destination: '/customer_service/contact',
              permanent: true,
          },
          {
              source: '/shipping',
              destination: '/customer_service/shipping',
              permanent: true,
          },
          {
              source: '/returns',
              destination: '/customer_service/returns',
              permanent: true,
          },
          {
              source: '/legal_area',
              destination: '/legal_area/terms-and-conditions',
              permanent: true,
          },
          {
              source: '/legal-area',
              destination: '/legal_area/terms-and-conditions',
              permanent: true,
          },
          {
              source: '/terms-and-conditions',
              destination: '/legal_area/terms-and-conditions',
              permanent: true,
          },
          {
              source: '/legal-area/:slug',
              destination: '/legal_area/:slug',
              permanent: true,
          },
          {
              source: '/wp-admin/:path*',
              destination: `${WORDPRESS_SITE_URL}/wp-admin/:path*`,
              permanent: true,
          },
          {
              source: '/wp-login/:path*',
              destination: `${WORDPRESS_SITE_URL}/wp-login/:path*`,
              permanent: true,
          },
      ]
  }
}
