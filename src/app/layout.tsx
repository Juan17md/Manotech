import type { Metadata, Viewport } from 'next';
import { Sora, Manrope, IBM_Plex_Mono } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { AuthGuard } from '@/components/providers/AuthGuard';
import './globals.css';
import LayoutWrapper from '@/components/shared/LayoutWrapper';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MANOTECH',
  description: 'Sistema administrativo y control de inventario/ventas',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'MANOTECH' },
  icons: {
    icon: [
      { url: '/icono_sin_fondo.PNG', type: 'image/png' },
      { url: '/icons/icono-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icons/icono-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF8FE',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="es" className={`light ${sora.variable} ${manrope.variable} ${ibmPlexMono.variable}`}>
      <body className="font-cuerpo bg-fondo-principal text-texto-primario antialiased flex min-h-screen">
        <Providers>
          <AuthGuard>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
