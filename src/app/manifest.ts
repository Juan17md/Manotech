import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MANOTECH - Control Administrativo',
    short_name: 'MANOTECH',
    description: 'Sistema administrativo y de control de stock y ventas de teléfonos y accesorios.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#FAF8FE', // Cerámica violeta (modo claro predeterminado)
    theme_color: '#FAF8FE',      // Barra de estado alineada al modo claro
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icono-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icono-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
