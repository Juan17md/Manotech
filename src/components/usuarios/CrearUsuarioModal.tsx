'use client';

import { useState } from 'react';
import { X, Mail, Key, UserPlus } from 'lucide-react';
import { useTienda } from '@/context/TiendaContext';
import { RolUsuario } from '@/types';

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  onExito: (msg: string) => void;
  onError: (msg: string) => void;
}

export function CrearUsuarioModal({ abierto, onCerrar, onExito, onError }: Props) {
  const { crearUsuario } = useTienda();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<RolUsuario>('operador');
  const [loading, setLoading] = useState(false);

  if (!abierto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      onError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    const { error } = await crearUsuario(email, password, rol);
    setLoading(false);

    if (error) {
      onError(error);
    } else {
      onExito('Usuario creado exitosamente');
      setEmail('');
      setPassword('');
      setRol('operador');
      onCerrar();
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Crear usuario" className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-superficie w-full max-w-lg rounded-t-3xl md:rounded-3xl border border-[var(--glass-border)] shadow-[var(--glass-shadow)] overflow-hidden flex flex-col max-h-[85dvh] sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        <div className="p-5 md:p-6 border-b border-[var(--glass-border)] flex justify-between items-center bg-[var(--glass-bg)]">
          <div className="flex items-center gap-3 text-acento-primario">
            <UserPlus size={24} />
            <h2 className="font-titulos text-xl font-bold text-texto-primario">Nuevo Usuario</h2>
          </div>
          <button onClick={onCerrar} disabled={loading} aria-label="Cerrar modal de crear usuario" className="p-2 rounded-full hover:bg-superficie-hover text-texto-secundario transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 md:p-6 pb-[calc(2rem+env(safe-area-inset-bottom))] md:pb-6">
          <form id="crearUsuarioForm" onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-texto-secundario">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-texto-secundario">
                  <Mail size={16} />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-fondo-principal border border-borde-sutil rounded-xl pl-10 pr-4 py-3 text-texto-primario placeholder-texto-secundario/50 focus:outline-none focus:border-acento-primario transition-all text-sm"
                  placeholder="usuario@manotech.com"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-texto-secundario">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-texto-secundario">
                  <Key size={16} />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="w-full bg-fondo-principal border border-borde-sutil rounded-xl pl-10 pr-4 py-3 text-texto-primario placeholder-texto-secundario/50 focus:outline-none focus:border-acento-primario transition-all text-sm"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            {/* Rol */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-texto-secundario">Rol</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRol('admin')}
                  className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all active:scale-95 ${
                    rol === 'admin'
                      ? 'bg-acento-aviso/10 border-acento-aviso/30 text-acento-aviso'
                      : 'border-[var(--glass-border)] text-texto-secundario hover:text-texto-primario hover:bg-superficie-hover'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRol('operador')}
                  className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all active:scale-95 ${
                    rol === 'operador'
                      ? 'bg-acento-primario/10 border-acento-primario/30 text-acento-primario'
                      : 'border-[var(--glass-border)] text-texto-secundario hover:text-texto-primario hover:bg-superficie-hover'
                  }`}
                >
                  Operador
                </button>
              </div>
              <p className="text-[11px] text-texto-secundario">
                {rol === 'admin'
                  ? 'El admin puede gestionar usuarios, inventario, ventas y finanzas.'
                  : 'El operador puede gestionar inventario, ventas y finanzas.'}
              </p>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-[var(--glass-border)] bg-[var(--glass-bg)] flex gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-5">
          <button type="button" onClick={onCerrar} disabled={loading} className="flex-1 px-6 py-3 rounded-xl font-medium text-texto-primario bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] border border-[var(--glass-border)] transition-colors">
            Cancelar
          </button>
          <button type="submit" form="crearUsuarioForm" disabled={loading} className="flex-[2] px-8 py-3 rounded-xl font-bold bg-acento-primario text-white shadow-lg shadow-acento-primario/20 hover:-translate-y-0.5 hover:shadow-acento-primario/40 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            <UserPlus size={20} />
            {loading ? 'Creando usuario...' : 'Crear Usuario'}
          </button>
        </div>

      </div>
    </div>
  );
}
