/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://*.clerk.accounts.dev https://clerk.orbitpk.com https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "img-src 'self' data: https:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.clerk.accounts.dev https://clerk.orbitpk.com https://api.clerk.com https://clerk-telemetry.com",
              "frame-src https://www.google.com https://*.clerk.accounts.dev https://clerk.orbitpk.com https://accounts.orbitpk.com https://challenges.cloudflare.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      // Uploaded gig images and seller photos.
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
      // Clerk avatars — `user.imageUrl`, rendered in the navbar.
      { protocol: 'https', hostname: 'img.clerk.com' },
      // Category art on /freelancers.
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // The /ai image tool's output.
      { protocol: 'https', hostname: 'image.pollinations.ai' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
