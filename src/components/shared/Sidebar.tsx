'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PackageSearch, CircleDollarSign, History, Users, LogOut, Wallet } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/services/firebase';
import { useTienda } from '@/context/TiendaContext';

interface GrupoNavegacion {
  categoria: string;
  items: {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    soloAdmin?: boolean;
  }[];
}

const GRUPOS_NAVEGACION: GrupoNavegacion[] = [
  {
    categoria: 'Gestión & Datos',
    items: [
      { href: '/dashboard', label: 'Panel Principal', icon: LayoutDashboard },
      { href: '/finanzas', label: 'Finanzas', icon: CircleDollarSign },
      { href: '/historial', label: 'Historial', icon: History },
    ],
  },
  {
    categoria: 'Operaciones',
    items: [
      { href: '/caja', label: 'Caja', icon: Wallet },
      { href: '/inventario', label: 'Inventario', icon: PackageSearch },
    ],
  },
  {
    categoria: 'Sistema',
    items: [
      { href: '/usuarios', label: 'Usuarios', icon: Users, soloAdmin: true },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { rol } = useTienda();

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[var(--color-superficie)]/70 border-r border-[var(--glass-border)] backdrop-blur-2xl shadow-xl z-50">

      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-[var(--glass-border)] bg-gradient-to-br from-acento-primario/10 via-transparent to-transparent">
        <div className="relative">
          <img
            src="/icono_sin_fondo.PNG"
            alt="MANOTECH Logo"
            className="w-auto h-9 object-contain drop-shadow-[0_0_12px_rgba(125,68,218,0.35)]"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="font-titulos font-bold text-base text-texto-primario tracking-tight leading-none">
              MANOTECH
            </h1>
            <span className="text-[9px] font-bold text-acento-primario bg-acento-primario/10 border border-acento-primario/25 px-1 py-0.2 rounded-md">
              PRO
            </span>
          </div>
          <p className="text-[11px] text-texto-secundario mt-0.5 truncate">Control de Operaciones</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
        {GRUPOS_NAVEGACION.map((grupo) => {
          const itemsFiltrados = grupo.items.filter(item => !item.soloAdmin || rol === 'admin');
          if (itemsFiltrados.length === 0) return null;

          return (
            <div key={grupo.categoria} className="space-y-1.5">
              <span className="px-3 text-[10px] font-bold tracking-wider uppercase text-acento-primario/70">
                {grupo.categoria}
              </span>

              <div className="space-y-1">
                {itemsFiltrados.map((item) => {
                  const isActive = pathname === item.href || (item.href === '/usuarios' && pathname.startsWith('/usuarios'));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-acento-primario/15 text-texto-primario font-semibold border border-acento-primario/30 shadow-[0_2px_12px_rgba(125,68,218,0.18)]'
                          : 'text-texto-secundario hover:text-texto-primario hover:bg-superficie-hover'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-acento-primario shadow-[0_0_8px_rgba(125,68,218,0.8)]" />
                      )}
                      <div className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-acento-primario text-white shadow-sm'
                          : 'text-texto-secundario group-hover:text-acento-primario group-hover:bg-acento-primario/10'
                      }`}>
                        <Icon size={17} />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-3 border-t border-[var(--glass-border)] space-y-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-texto-secundario hover:text-peligro hover:bg-peligro/10 font-medium transition-colors"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>

    </aside>
  );
}
