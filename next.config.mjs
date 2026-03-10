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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://*.clerk.accounts.dev https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://api.resend.com https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com https://*.firebaseapp.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.supabase.co wss://*.supabase.co https://*.clerk.accounts.dev https://api.clerk.com",
              "frame-src https://www.google.com https://*.firebaseapp.com https://*.clerk.accounts.dev https://challenges.cloudflare.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'images.unsplash.com', 'lh3.googleusercontent.com', 'firebasestorage.googleapis.com', 'img.clerk.com', 'img.freepik.com'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: 'img.freepik.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
