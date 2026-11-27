'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PackageSearch, CircleDollarSign, History, Users, Wallet } from 'lucide-react';
import { useTienda } from '@/context/TiendaContext';

const navItems = [
  { href: '/caja', label: 'Caja', icon: Wallet },
  { href: '/inventario', label: 'Stock', icon: PackageSearch },
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/finanzas', label: 'Finanzas', icon: CircleDollarSign },
  { href: '/historial', label: 'Historial', icon: History },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { rol } = useTienda();

  return (
    <nav className="flex md:hidden fixed bottom-2.5 left-3 right-3 z-50">
      <div className="w-full bg-[var(--color-superficie)]/90 backdrop-blur-2xl border border-borde-sutil rounded-2xl shadow-[0_12px_36px_-14px_rgba(125,68,218,0.45)] flex items-center justify-around h-15 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all relative ${
                isActive
                  ? 'text-acento-primario'
                  : 'text-texto-secundario active:text-texto-primario'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-acento-primario shadow-[0_0_8px_rgba(125,68,218,0.8)]" />
              )}
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-acento-tenue' : ''}`}>
                <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {rol === 'admin' && (
          <Link
            href="/usuarios"
            className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all relative ${
              pathname.startsWith('/usuarios')
                ? 'text-acento-primario'
                : 'text-texto-secundario active:text-texto-primario'
            }`}
          >
            {pathname.startsWith('/usuarios') && (
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-acento-primario shadow-[0_0_8px_rgba(125,68,218,0.8)]" />
            )}
            <div className={`p-1 rounded-lg transition-transform ${pathname.startsWith('/usuarios') ? 'scale-110 bg-acento-tenue' : ''}`}>
              <Users size={19} strokeWidth={pathname.startsWith('/usuarios') ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] leading-none ${pathname.startsWith('/usuarios') ? 'font-bold' : 'font-medium'}`}>
              Usuarios
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
