'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import HeaderSuperior from '@/components/shared/HeaderSuperior';
import BottomNav from '@/components/shared/BottomNav';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isBloqueado = pathname === '/bloqueado';
  const isCambiarContrasena = pathname === '/cambiar-contrasena';

  if (isLoginPage || isBloqueado || isCambiarContrasena) {
    return <main className="flex-1 min-h-screen relative overflow-hidden">{children}</main>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 min-h-screen flex flex-col min-w-0">
        <HeaderSuperior />
        <main className="flex-1 relative flex flex-col px-4 sm:px-6 md:px-8 py-6 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <BottomNav />
    </>
  );
}
