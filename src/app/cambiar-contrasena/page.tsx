'use client';

import { useState } from 'react';
import { useTienda } from '@/context/TiendaContext';
import { Lock, Key, Eye, EyeOff, Loader2, ArrowRight, CheckCircle } from 'lucide-react';

export default function CambiarContrasenaPage() {
  const { user, cambiarContrasena } = useTienda();
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!user) {
      setError('Sesión expirada. Vuelve a iniciar sesión.');
      return;
    }

    setLoading(true);
    const { error } = await cambiarContrasena(user.uid, password);
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      setExito(true);
    }
  };

  if (exito) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-exito/10 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />
        <div className="glass-panel w-full max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative z-10 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-exito/10 flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-exito" />
          </div>
          <div>
            <h1 className="font-plus-jakarta font-bold text-2xl text-texto-primario">¡Contraseña actualizada!</h1>
            <p className="text-sm text-texto-secundario mt-2">Serás redirigido al sistema en un momento...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-acento-primario/10 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-acento-aviso/10 blur-[60px] sm:blur-[100px] rounded-full pointer-events-none" />

      <div className="glass-panel w-full max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-acento-aviso to-acento-primario flex items-center justify-center box-glow-primario mb-4 sm:mb-5 shadow-lg shadow-acento-primario/20">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="font-plus-jakarta font-bold text-2xl sm:text-3xl text-texto-primario tracking-tight">
            Primer Inicio de Sesión
          </h1>
          <p className="text-sm text-texto-secundario mt-2 font-medium max-w-xs">
            Por seguridad, debes establecer tu contraseña privada antes de acceder al sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-peligro/10 border border-peligro/20 text-peligro text-sm text-center font-medium shadow-sm flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-peligro animate-pulse" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-texto-secundario uppercase tracking-wider">Nueva Contraseña</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-texto-secundario group-focus-within:text-acento-primario transition-colors">
                <Key size={18} />
              </div>
              <input
                required
                type={mostrarContrasena ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className={`w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl pl-11 pr-12 py-3.5 text-texto-primario placeholder-texto-secundario/50 focus:outline-none focus:border-acento-primario focus:ring-4 focus:ring-acento-primario/10 transition-all font-medium ${mostrarContrasena ? 'tracking-normal' : 'tracking-widest'}`}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-texto-secundario hover:text-acento-primario transition-colors duration-200"
                aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-texto-secundario uppercase tracking-wider">Confirmar Contraseña</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-texto-secundario group-focus-within:text-acento-primario transition-colors">
                <Key size={18} />
              </div>
              <input
                required
                type={mostrarContrasena ? 'text' : 'password'}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                minLength={6}
                className={`w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl pl-11 pr-4 py-3.5 text-texto-primario placeholder-texto-secundario/50 focus:outline-none focus:border-acento-primario focus:ring-4 focus:ring-acento-primario/10 transition-all font-medium ${mostrarContrasena ? 'tracking-normal' : 'tracking-widest'}`}
                placeholder="Repite tu contraseña"
              />
            </div>
          </div>

          {/* Indicador de fortaleza */}
          {password.length > 0 && (
            <div className="flex items-center gap-2">
              <div className={`flex-1 h-1.5 rounded-full transition-all ${password.length >= 8 ? 'bg-exito' : password.length >= 6 ? 'bg-acento-aviso' : 'bg-peligro'}`} />
              <div className={`flex-1 h-1.5 rounded-full transition-all ${/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'bg-exito' : 'bg-acento-tenue'}`} />
              <div className={`flex-1 h-1.5 rounded-full transition-all ${/\d/.test(password) ? 'bg-exito' : 'bg-acento-tenue'}`} />
              <span className="text-[10px] text-texto-secundario ml-1">
                {password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)
                  ? 'Fuerte'
                  : password.length >= 6
                    ? 'Aceptable'
                    : ''}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-8 rounded-xl bg-acento-primario text-white font-bold flex items-center justify-center gap-2 active:scale-95 hover:-translate-y-1 hover:shadow-lg hover:shadow-acento-primario/30 hover:box-glow-primario transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin relative z-10" />
                <span className="relative z-10 tracking-wide">Guardando contraseña...</span>
              </>
            ) : (
              <>
                <ArrowRight size={18} className="text-white relative z-10" />
                <span className="relative z-10 tracking-wide">Establecer Contraseña</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
