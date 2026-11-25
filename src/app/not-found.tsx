'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">

      {/* Código 404 con efecto de glow */}
      <div className="relative mb-6">
        <h1 className="font-space-grotesk text-[120px] sm:text-[160px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-acento-primario/80 to-acento-primario/10 select-none">
          404
        </h1>
        <div className="absolute inset-0 blur-3xl bg-acento-primario/10 rounded-full pointer-events-none" />
      </div>

      {/* Mensaje descriptivo */}
      <h2 className="font-plus-jakarta text-2xl sm:text-3xl font-bold text-texto-primario mb-3">
        Página no encontrada
      </h2>
      <p className="text-texto-secundario text-sm sm:text-base max-w-md mb-8 leading-relaxed">
        La ruta que buscas no existe o fue movida. Verifica la dirección e intenta de nuevo, o regresa al panel principal.
      </p>

      {/* Botones de navegación */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-md">
        <Link
          href="/dashboard"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-acento-primario text-white font-bold shadow-lg shadow-acento-primario/20 hover:-translate-y-0.5 hover:shadow-acento-primario/30 active:scale-95 transition-all duration-300"
        >
          <Home size={18} />
          Ir al Inicio
        </Link>
        <button
          onClick={() => typeof window !== 'undefined' && window.history.back()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl glass-panel text-texto-primario font-bold hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
        >
          <ArrowLeft size={18} />
          Volver Atrás
        </button>
      </div>

      {/* Branding sutil */}
      <p className="mt-12 text-xs text-texto-secundario/60 font-space-grotesk tracking-widest uppercase">
        MANOTECH
      </p>
    </div>
  );
}
