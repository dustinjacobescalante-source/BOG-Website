import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BOG Buffalo Dogs',
    short_name: 'BOG',
    description:
      'Brotherhood of Growth member portal for accountability, meetings, documents, discussions, and brotherhood updates.',
    start_url: '/portal',
    scope: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#0b0f16',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
