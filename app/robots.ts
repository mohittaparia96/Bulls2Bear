import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/learn/'] }],
    sitemap: `${process.env.APP_URL || 'https://bulls2bear.com'}/sitemap.xml`,
  };
}
