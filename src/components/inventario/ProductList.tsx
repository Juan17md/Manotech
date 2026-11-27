'use client';

import { useState } from 'react';
import { Producto } from '@/types';
import { PackageOpen, Edit3, Smartphone, Headphones, Zap, Shield, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  productos: Producto[];
  loading: boolean;
  onEdit: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
}

const ITEMS_POR_PAGINA = 20;

type EstadoStock = 'agotado' | 'critico' | 'disponible';

function getEstadoStock(producto: Producto): EstadoStock {
  if (producto.stockActual <= 0) return 'agotado';
  if (producto.stockActual <= producto.stockMinimo) return 'critico';
  return 'disponible';
}

const BADGES_ESTADO: Record<EstadoStock, { label: string; clase: string; texto: string }> = {
  agotado: {
    label: 'AGOTADO',
    clase: 'bg-peligro/10 border-peligro/25 text-peligro',
    texto: 'text-peligro animate-pulse',
  },
  critico: {
    label: 'CRÍTICO',
    clase: 'bg-acento-aviso/15 border-acento-aviso/25 text-acento-aviso',
    texto: 'text-acento-aviso',
  },
  disponible: {
    label: 'DISPONIBLE',
    clase: 'bg-exito/10 border-exito/20 text-exito',
    texto: 'text-exito',
  },
};

export default function ProductList({ productos, loading, onEdit, onDelete }: Props) {
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.max(1, Math.ceil(productos.length / ITEMS_POR_PAGINA));
  const paginaSegura = Math.min(paginaActual, totalPaginas);

  const inicio = (paginaSegura - 1) * ITEMS_POR_PAGINA;
  const productosPaginados = productos.slice(inicio, inicio + ITEMS_POR_PAGINA);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-texto-secundario animate-pulse">
        <PackageOpen size={48} className="mb-4 opacity-50" />
        <p>Cargando inventario...</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-superficie-hover flex items-center justify-center text-texto-secundario mb-4">
          <PackageOpen size={32} />
        </div>
        <h3 className="text-xl font-bold text-texto-primario">Inventario Vacío</h3>
        <p className="text-texto-secundario mt-2 max-w-sm">No hay productos que coincidan con tu búsqueda o el inventario está completamente vacío.</p>
      </div>
    );
  }

  const getIcon = (categoria: string) => {
    switch(categoria) {
      case 'Teléfonos': return <Smartphone size={18} />;
      case 'Cargadores': return <Zap size={18} />;
      case 'Protectores': return <Shield size={18} />;
      case 'Auriculares': return <Headphones size={18} />;
      default: return <PackageOpen size={18} />;
    }
  };

  return (
    <>
      {/* VISTA MÓVIL (Tarjetas) */}
      <div className="flex flex-col gap-3 md:hidden">
        {productosPaginados.map(p => (
          <div key={p.id} className="glass-panel p-3.5 sm:p-4 rounded-xl flex flex-col gap-2.5 sm:gap-3">
            <div className="flex justify-between items-start gap-2">
              <div className="flex gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-superficie-hover border border-borde-sutil flex items-center justify-center text-acento-primario shrink-0">
                  {getIcon(p.categoria)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-texto-primario leading-tight text-sm sm:text-base truncate">{p.nombre}</h4>
                  <p className="text-[11px] sm:text-xs text-texto-secundario mt-0.5 truncate">
                    {p.marca} • SKU: {p.sku}
                    {p.categoria === 'Teléfonos' && (p.ram || p.almacenamiento) ? ` • ${[p.ram, p.almacenamiento].filter(Boolean).join(' / ')}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 sm:gap-2 shrink-0">
                <button onClick={() => onEdit(p)} className="p-2 bg-superficie-hover hover:bg-acento-primario/20 rounded-lg text-acento-primario transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center">
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => onDelete(p)}
                  className="p-2 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center bg-superficie-hover text-peligro hover:bg-peligro/20"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-fondo-principal/50 p-2.5 rounded-lg border border-borde-sutil/70">
                <p className="text-[10px] text-texto-secundario uppercase tracking-wider mb-0.5">Precio Venta</p>
                <p className="font-space-grotesk font-bold text-exito">${p.precioVenta.toFixed(2)}</p>
              </div>
              <div className={`p-2.5 rounded-lg border ${getEstadoStock(p) === 'disponible' ? 'bg-fondo-principal/50 border-borde-sutil/70' : BADGES_ESTADO[getEstadoStock(p)].clase}`}>
                <p className={`text-[10px] uppercase tracking-wider mb-0.5 ${getEstadoStock(p) === 'disponible' ? 'text-texto-secundario' : BADGES_ESTADO[getEstadoStock(p)].texto}`}>
                  Stock Actual
                </p>
                <div className="flex items-center justify-between gap-1">
                  <p className={`font-space-grotesk font-bold ${getEstadoStock(p) === 'disponible' ? 'text-texto-primario' : BADGES_ESTADO[getEstadoStock(p)].texto}`}>
                    {p.stockActual} und.
                  </p>
                  {getEstadoStock(p) !== 'disponible' && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${BADGES_ESTADO[getEstadoStock(p)].clase}`}>
                      {BADGES_ESTADO[getEstadoStock(p)].label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VISTA ESCRITORIO (Tabla) */}
      <div className="hidden md:block glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-borde-sutil bg-superficie-hover">
                <th className="p-4 font-medium text-sm text-texto-secundario">SKU</th>
                <th className="p-4 font-medium text-sm text-texto-secundario">Nombre</th>
                <th className="p-4 font-medium text-sm text-texto-secundario">Marca</th>
                <th className="p-4 font-medium text-sm text-texto-secundario">Categoría</th>
                <th className="p-4 font-medium text-sm text-texto-secundario">Costo Compra</th>
                <th className="p-4 font-medium text-sm text-texto-secundario">Precio Venta</th>
                <th className="p-4 font-medium text-sm text-texto-secundario">Stock</th>
                <th className="p-4 font-medium text-sm text-texto-secundario text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borde-sutil/70">
              {productosPaginados.map(p => (
                <tr key={p.id} className="hover:bg-superficie-hover transition-colors">
                  <td className="p-4">
                    <span className="font-space-grotesk text-xs text-texto-secundario bg-superficie-hover border border-borde-sutil px-2 py-0.5 rounded-md">
                      {p.sku}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-texto-primario">{p.nombre}</p>
                    {p.categoria === 'Teléfonos' && (p.ram || p.almacenamiento) && (
                      <p className="text-xs text-texto-secundario">
                        {[p.ram, p.almacenamiento].filter(Boolean).join(' / ')}
                      </p>
                    )}
                  </td>
                  <td className="p-4 text-sm text-texto-secundario">{p.marca}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-superficie-hover text-xs text-texto-primario border border-borde-sutil">
                      {getIcon(p.categoria)} {p.categoria}
                    </span>
                  </td>
                  <td className="p-4 font-space-grotesk text-texto-secundario">
                    ${p.costoCompra.toFixed(2)}
                  </td>
                  <td className="p-4 font-space-grotesk font-bold text-exito">
                    ${p.precioVenta.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-space-grotesk font-bold px-3 py-1 rounded-lg border ${BADGES_ESTADO[getEstadoStock(p)].clase}`}>
                        {p.stockActual}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${BADGES_ESTADO[getEstadoStock(p)].texto}`}>
                        {BADGES_ESTADO[getEstadoStock(p)].label}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onEdit(p)}
                        className="p-2 inline-flex items-center justify-center rounded-lg text-texto-secundario hover:text-acento-primario hover:bg-acento-primario/10 transition-colors"
                        title="Editar"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(p)}
                        className="p-2 inline-flex items-center justify-center rounded-lg transition-colors text-texto-secundario hover:text-peligro hover:bg-peligro/10"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-1">
          <p className="text-xs text-texto-secundario order-2 sm:order-1">
            Mostrando <span className="font-bold text-texto-primario">{inicio + 1}</span>–<span className="font-bold text-texto-primario">{Math.min(inicio + ITEMS_POR_PAGINA, productos.length)}</span> de <span className="font-bold text-texto-primario">{productos.length}</span> productos
          </p>

          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              onClick={() => setPaginaActual(paginaSegura - 1)}
              disabled={paginaSegura <= 1}
              aria-label="Página anterior"
              className="p-2 rounded-lg bg-superficie-hover border border-borde-sutil text-texto-primario hover:bg-acento-primario/20 hover:text-acento-primario disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-superficie-hover disabled:hover:text-texto-primario transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setPaginaActual(num)}
                aria-label={`Página ${num}`}
                aria-current={num === paginaSegura ? 'page' : undefined}
                className={`min-w-[38px] h-[38px] px-2 rounded-lg text-sm font-bold transition-all ${
                  num === paginaSegura
                    ? 'bg-acento-primario text-white shadow-md shadow-acento-primario/20'
                    : 'bg-superficie-hover border border-borde-sutil text-texto-secundario hover:text-texto-primario hover:bg-superficie-hover'
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setPaginaActual(paginaSegura + 1)}
              disabled={paginaSegura >= totalPaginas}
              aria-label="Página siguiente"
              className="p-2 rounded-lg bg-superficie-hover border border-borde-sutil text-texto-primario hover:bg-acento-primario/20 hover:text-acento-primario disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-superficie-hover disabled:hover:text-texto-primario transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
