'use client';

import { usePathname } from 'next/navigation';
import { useTienda } from '@/context/TiendaContext';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Sun, Moon, ShieldCheck, UserCheck, WifiOff } from 'lucide-react';

const TITULOS_RUTAS: Record<string, { titulo: string; seccion: string }> = {
  '/dashboard': { titulo: 'Panel Principal', seccion: 'Analítica' },
  '/inventario': { titulo: 'Control de Inventario', seccion: 'Operaciones' },
  '/caja': { titulo: 'Flujo de Caja', seccion: 'Operaciones' },
  '/finanzas': { titulo: 'Métricas Financieras', seccion: 'Analítica' },
  '/historial': { titulo: 'Historial de Operaciones', seccion: 'Analítica' },
  '/usuarios': { titulo: 'Gestión de Accesos', seccion: 'Administración' },
};

export default function HeaderSuperior() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { tasaBCV, loadingTasa, isOffline, rol, user } = useTienda();

  const rutaActual = TITULOS_RUTAS[pathname] || { titulo: 'MANOTECH', seccion: 'Sistema' };

  return (
    <header className="relative sticky top-0 z-40 w-full bg-[var(--glass-bg)] backdrop-blur-2xl border-b border-[var(--glass-border)] shadow-sm">
      {/* Hairline violeta: firma visual de MANOTECH */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-acento-logo via-acento-hover to-transparent"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between gap-4">

        {/* Izquierda: Contexto / Título en Desktop, Logo en Móvil */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="md:hidden flex items-center gap-2.5 shrink-0">
            <img
              src="/icono_sin_fondo.PNG"
              alt="MANOTECH"
              className="h-8 w-auto object-contain"
            />
            <span className="font-plus-jakarta font-bold text-base text-texto-primario tracking-tight">MANOTECH</span>
          </div>

          <div className="hidden md:flex flex-col min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-texto-secundario">
              <span>MANOTECH</span>
              <span>/</span>
              <span className="text-acento-primario">{rutaActual.seccion}</span>
            </div>
            <h2 className="font-plus-jakarta font-bold text-lg text-texto-primario leading-tight truncate">
              {rutaActual.titulo}
            </h2>
          </div>
        </div>

        {/* Derecha: Ticker BCV + Estado + Tema + Usuario */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Ticker Tasa BCV Oficial */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-superficie/80 border border-[var(--glass-border)] shadow-sm">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOffline ? 'bg-amber-400' : 'bg-exito'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isOffline ? 'bg-amber-500' : 'bg-exito'}`}></span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-texto-secundario uppercase tracking-wider">BCV</span>
            <span className="font-space-grotesk font-bold text-xs sm:text-sm text-texto-primario">
              {loadingTasa && !tasaBCV ? (
                <span className="animate-pulse text-texto-secundario">...</span>
              ) : tasaBCV ? (
                `Bs. ${new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tasaBCV)}`
              ) : (
                'N/D'
              )}
            </span>
            {isOffline && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                <WifiOff size={10} /> Offline
              </span>
            )}
          </div>

          {/* Selector de Tema */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full bg-superficie/80 border border-[var(--glass-border)] text-texto-secundario hover:text-texto-primario hover:border-acento-primario/30 transition-all shrink-0"
            aria-label="Cambiar tema de color"
            title={theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Badge de Usuario / Rol */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-borde-sutil">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
              rol === 'admin'
                ? 'bg-acento-primario/15 text-acento-primario border-acento-primario/30'
                : 'bg-exito/15 text-exito border-exito/30'
            }`}>
              {rol === 'admin' ? <ShieldCheck size={16} /> : <UserCheck size={16} />}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-texto-primario leading-tight truncate max-w-[120px]">
                {user?.email?.split('@')[0] || (rol === 'admin' ? 'Administrador' : 'Operador')}
              </span>
              <span className="text-[10px] text-texto-secundario leading-tight capitalize">
                {rol || 'Usuario'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
