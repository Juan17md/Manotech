'use client';

import { useState, useMemo, useEffect } from 'react';
import { Smartphone, PackageOpen, CircleDollarSign, ArrowRight, Sun, Moon, Receipt, ReceiptText, Ban, Eye, TrendingUp, Wallet } from 'lucide-react';
import { useTienda } from '@/context/TiendaContext';
import { obtenerTotalVenta, obtenerCantidadTotal, obtenerResumenProductos, obtenerGananciaVenta, Venta } from '@/types';
import { useTheme } from '@/components/providers/ThemeProvider';
import NuevaVentaModal from '@/components/finanzas/NuevaVentaModal';
import NuevoGastoModal from '@/components/finanzas/NuevoGastoModal';
import ProductModal from '@/components/inventario/ProductModal';
import DetalleVentaModal from '@/components/finanzas/DetalleVentaModal';
import Toast, { MensajeToast } from '@/components/shared/Toast';
import Link from 'next/link';

export default function DashboardPage() {
  const { ventas, productos, anularVenta, tasaBCV } = useTienda();
  const { theme, toggleTheme } = useTheme();
  
  // Estados para Modales
  const [modalVentaOpen, setModalVentaOpen] = useState(false);
  const [modalGastoOpen, setModalGastoOpen] = useState(false);
  const [modalProductoOpen, setModalProductoOpen] = useState(false);
  const [productoActiveTab, setProductoActiveTab] = useState<'Telefonos' | 'Accesorios'>('Telefonos');
  const [ventaAAnular, setVentaAAnular] = useState<string | null>(null);
  const [isAnulando, setIsAnulando] = useState(false);
  const [toastMessage, setToastMessage] = useState<MensajeToast | null>(null);

  // Ocultar toast automáticamente
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Detalle de Venta
  const [selectedVentaDetalle, setSelectedVentaDetalle] = useState<Venta | null>(null);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);

  // Cálculos del Día
  const metricas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const ventasHoy = ventas.filter(v => new Date(v.fecha) >= hoy && !v.anulada);
    const ingresosHoy = ventasHoy.reduce((acc, v) => acc + obtenerTotalVenta(v), 0);
    const equiposHoy = ventasHoy.reduce((acc, v) => acc + obtenerCantidadTotal(v), 0);
    const transaccionesHoy = ventasHoy.length;
    const gananciaHoy = ventasHoy.reduce((acc, v) => acc + obtenerGananciaVenta(v), 0);
    
    const alertasStock = productos.filter(p => p.stockActual <= p.stockMinimo).length;

    return { ingresosHoy, equiposHoy, transaccionesHoy, gananciaHoy, alertasStock };
  }, [ventas, productos]);

  // Obtener las últimas 10 ventas ordenadas por fecha (las más recientes primero)
  const ultimasVentas = useMemo(() => {
    return [...ventas]
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 10);
  }, [ventas]);

  const formatearFecha = (isoString: string) => {
    const fecha = new Date(isoString);
    return new Intl.DateTimeFormat('es-VE', { 
      day: '2-digit', month: 'short', 
      hour: '2-digit', minute: '2-digit' 
    }).format(fecha);
  };

  return (
    <>
      <div className="space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-plus-jakarta font-bold text-2xl sm:text-3xl text-texto-primario truncate">Panel Principal</h2>
          <p className="text-texto-secundario mt-1 text-sm sm:text-base">Bienvenido a MANOTECH, resumen en tiempo real.</p>
        </div>
        
        {/* Theme Toggle (Mobile only — desktop uses Sidebar) */}
        <button 
          onClick={toggleTheme}
          className="md:hidden p-3 rounded-full glass-panel text-texto-primario hover:bg-superficie-hover transition-colors shrink-0"
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Grid de KPIs Básicos (Bento-lite) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        
        <div className="col-span-2 md:col-span-1 glass-panel p-5 md:p-6 rounded-2xl flex items-center justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-acento-primario/10 transition-all duration-300">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-texto-secundario font-medium">Ventas del Día</p>
            <h3 className="font-space-grotesk font-bold text-2xl sm:text-3xl text-texto-primario mt-1 truncate">${metricas.ingresosHoy.toFixed(2)}</h3>
            {tasaBCV !== null && tasaBCV > 0 && (
              <p className="font-space-grotesk text-xs text-texto-secundario mt-0.5 truncate">
                ≈ Bs {(metricas.ingresosHoy * tasaBCV).toFixed(2)}
              </p>
            )}
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-exito/10 flex items-center justify-center text-exito shrink-0 ml-3">
            <CircleDollarSign size={22} />
          </div>
        </div>

        <div className="glass-panel p-5 md:p-6 rounded-2xl flex items-center justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-acento-primario/10 transition-all duration-300">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-texto-secundario font-medium">Ganancia Neta Hoy</p>
            <h3 className="font-space-grotesk font-bold text-2xl sm:text-3xl text-exito mt-1 truncate">${metricas.gananciaHoy.toFixed(2)}</h3>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-exito/10 flex items-center justify-center text-exito shrink-0 ml-3">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="glass-panel p-5 md:p-6 rounded-2xl flex items-center justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-acento-primario/10 transition-all duration-300">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-texto-secundario font-medium">Transacciones Hoy</p>
            <h3 className="font-space-grotesk font-bold text-2xl sm:text-3xl text-texto-primario mt-1">{metricas.transaccionesHoy}</h3>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-acento-primario/10 flex items-center justify-center text-acento-primario shrink-0 ml-3">
            <Receipt size={22} />
          </div>
        </div>

        <div className="glass-panel p-5 md:p-6 rounded-2xl flex items-center justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-acento-primario/10 transition-all duration-300">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-texto-secundario font-medium">Equipos Hoy</p>
            <h3 className="font-space-grotesk font-bold text-2xl sm:text-3xl text-texto-primario mt-1">{metricas.equiposHoy}</h3>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-acento-primario/10 flex items-center justify-center text-acento-primario shrink-0 ml-3">
            <Smartphone size={22} />
          </div>
        </div>

        <Link href="/inventario" className="glass-panel p-5 md:p-6 rounded-2xl flex items-center justify-between group hover:-translate-y-1 hover:shadow-xl hover:shadow-acento-primario/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-peligro/20">
          <div className="min-w-0">
            <p className={`text-xs sm:text-sm font-medium ${metricas.alertasStock > 0 ? 'text-peligro' : 'text-texto-secundario'}`}>
              Alertas Stock
            </p>
            <h3 className={`font-space-grotesk font-bold text-2xl sm:text-3xl mt-1 ${metricas.alertasStock > 0 ? 'text-texto-primario' : 'text-texto-secundario'}`}>
              {metricas.alertasStock}
            </h3>
          </div>
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ml-3 ${metricas.alertasStock > 0 ? 'bg-peligro/10 text-peligro' : 'bg-superficie-hover text-texto-secundario'}`}>
            <PackageOpen size={22} />
          </div>
        </Link>

        {/* Widget BCV — Tasa del Dólar Oficial */}
        <div className="glass-panel p-5 md:p-6 rounded-2xl flex items-center justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-acento-primario/10 transition-all duration-300 border border-acento-primario/10">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-texto-secundario font-medium">Tasa BCV (Dólar Oficial)</p>
            {tasaBCV !== null && tasaBCV > 0 ? (
              <>
                <h3 className="font-space-grotesk font-bold text-2xl sm:text-3xl text-texto-primario mt-1 truncate">
                  Bs {tasaBCV.toFixed(2)}
                </h3>
                <p className="text-xs text-texto-secundario mt-0.5">
                  ≈ $1.00 → Bs {tasaBCV.toFixed(2)}
                </p>
              </>
            ) : (
              <h3 className="font-space-grotesk font-bold text-xl sm:text-2xl text-texto-secundario mt-1">
                Sin conexión
              </h3>
            )}
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-acento-aviso/10 flex items-center justify-center text-acento-aviso shrink-0 ml-3">
            <Wallet size={22} />
          </div>
        </div>

      </div>

      {/* Acciones Rápidas */}
      <div className="space-y-3">
        <h3 className="font-plus-jakarta font-bold text-lg text-texto-primario">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          
          {/* Registrar Venta */}
          <button 
            onClick={() => setModalVentaOpen(true)}
            className="py-4 px-4 rounded-2xl bg-exito text-white font-bold shadow-lg shadow-exito/20 active:scale-95 hover:-translate-y-1 hover:shadow-exito/40 hover:box-glow-emerald transition-all duration-300 flex flex-col items-center justify-center gap-2 relative overflow-hidden group min-h-[110px] cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CircleDollarSign size={24} className="text-white" />
            <span className="tracking-wide text-xs sm:text-sm text-center">Registrar Venta</span>
          </button>

          {/* Registrar Teléfono */}
          <button 
            onClick={() => { setProductoActiveTab('Telefonos'); setModalProductoOpen(true); }}
            className="py-4 px-4 rounded-2xl glass-panel text-texto-primario font-bold active:scale-95 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-2 group min-h-[110px] border border-borde-sutil/70 hover:border-acento-primario/20 cursor-pointer"
          >
            <Smartphone size={24} className="text-texto-secundario group-hover:text-acento-primario transition-colors" />
            <span className="tracking-wide text-xs sm:text-sm text-center">Registrar Teléfono</span>
          </button>

          {/* Registrar Producto */}
          <button 
            onClick={() => { setProductoActiveTab('Accesorios'); setModalProductoOpen(true); }}
            className="py-4 px-4 rounded-2xl glass-panel text-texto-primario font-bold active:scale-95 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-2 group min-h-[110px] border border-borde-sutil/70 hover:border-acento-primario/20 cursor-pointer"
          >
            <PackageOpen size={24} className="text-texto-secundario group-hover:text-acento-primario transition-colors" />
            <span className="tracking-wide text-xs sm:text-sm text-center">Registrar Producto</span>
          </button>

          {/* Registrar Gasto */}
          <button 
            onClick={() => setModalGastoOpen(true)}
            className="py-4 px-4 rounded-2xl glass-panel text-texto-primario font-bold active:scale-95 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-2 group min-h-[110px] border border-borde-sutil/70 hover:border-peligro/20 cursor-pointer"
          >
            <Receipt size={24} className="text-texto-secundario group-hover:text-peligro transition-colors" />
            <span className="tracking-wide text-xs sm:text-sm text-center">Registrar Gasto</span>
          </button>

        </div>
      </div>

      {/* Últimas Ventas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-plus-jakarta font-bold text-lg text-texto-primario">Últimas 10 Ventas</h3>
          <Link href="/historial" className="text-acento-primario text-sm font-medium hover:underline flex items-center gap-1">
            Ver todo <ArrowRight size={14} />
          </Link>
        </div>

        {ultimasVentas.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-superficie-hover flex items-center justify-center text-texto-secundario mb-3">
              <ReceiptText size={22} />
            </div>
            <h4 className="text-sm font-bold text-texto-primario">No hay ventas registradas</h4>
            <p className="text-xs text-texto-secundario mt-1">Registra tu primera venta usando los botones de arriba.</p>
          </div>
        ) : (
          <>
            {/* Vista Móvil: Tarjetas compactas */}
            <div className="md:hidden flex flex-col gap-2.5">
              {ultimasVentas.map((venta) => (
                <div key={venta.id} className={`glass-panel p-3.5 rounded-xl flex items-center justify-between gap-3 ${venta.anulada ? 'opacity-55' : ''}`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${venta.anulada ? 'bg-superficie-hover text-texto-secundario' : 'bg-exito/10 text-exito'}`}>
                      <ReceiptText size={16} />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-bold text-xs sm:text-sm leading-tight truncate ${venta.anulada ? 'line-through text-texto-secundario' : 'text-texto-primario'}`}>{obtenerResumenProductos(venta)}</h4>
                      {venta.nombreCliente && (
                        <p className="text-[10px] text-exito font-semibold mt-0.5 leading-none">
                          Cliente: {venta.nombreCliente}
                        </p>
                      )}
                      <p className="text-[10px] text-texto-secundario mt-0.5">
                        {formatearFecha(venta.fecha)} • {venta.metodoPago}
                        {venta.anulada && <span className="ml-2 px-1.5 py-0.5 rounded bg-peligro/10 text-peligro font-bold uppercase text-[8px] tracking-wide">Anulada</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right mr-1">
                      <p className="text-[10px] text-texto-secundario uppercase tracking-wider mb-0.5">{obtenerCantidadTotal(venta)} und.</p>
                      <p className={`font-space-grotesk font-bold text-sm sm:text-base ${venta.anulada ? 'text-texto-secundario line-through' : 'text-exito'}`}>${obtenerTotalVenta(venta).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedVentaDetalle(venta); setModalDetalleOpen(true); }}
                      className="p-2 rounded-lg bg-superficie-hover hover:bg-superficie-hover text-texto-primario transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                      title="Ver detalles"
                    >
                      <Eye size={14} />
                    </button>
                    {!venta.anulada && (
                      <button
                        onClick={() => setVentaAAnular(venta.id)}
                        className="p-2 rounded-lg bg-peligro/10 hover:bg-peligro/20 text-peligro transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                        title="Anular venta"
                      >
                        <Ban size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Vista Escritorio: Tabla Premium */}
            <div className="hidden md:block glass-panel rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-borde-sutil bg-superficie-hover">
                      <th className="p-4 font-medium text-xs text-texto-secundario uppercase tracking-wider">Fecha / Hora</th>
                      <th className="p-4 font-medium text-xs text-texto-secundario uppercase tracking-wider">Producto</th>
                      <th className="p-4 font-medium text-xs text-texto-secundario uppercase tracking-wider">Método de Pago</th>
                      <th className="p-4 font-medium text-xs text-texto-secundario uppercase tracking-wider text-center">Cantidad</th>
                      <th className="p-4 font-medium text-xs text-texto-secundario uppercase tracking-wider text-right">Monto Total</th>
                      <th className="p-4 font-medium text-xs text-texto-secundario uppercase tracking-wider text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borde-sutil/70">
                    {ultimasVentas.map((venta) => (
                      <tr key={venta.id} className={`hover:bg-superficie-hover transition-colors ${venta.anulada ? 'opacity-55' : ''}`}>
                        <td className="p-4 text-xs text-texto-secundario font-medium">
                          {formatearFecha(venta.fecha)}
                        </td>
                        <td className={`p-4 text-sm font-bold ${venta.anulada ? 'line-through text-texto-secundario' : 'text-texto-primario'}`}>
                          <div>{obtenerResumenProductos(venta)}</div>
                          {venta.nombreCliente && (
                            <div className="text-xs text-texto-secundario font-normal mt-0.5">
                              Cliente: {venta.nombreCliente} {venta.cedulaCliente ? `(${venta.cedulaCliente})` : ''}
                            </div>
                          )}
                          {venta.anulada && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-peligro/10 text-peligro text-[9px] font-bold uppercase tracking-wider">
                              Anulada
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-xs text-texto-primario">
                          <span className="inline-flex px-2 py-0.5 rounded bg-superficie-hover border border-borde-sutil">
                            {venta.metodoPago}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-space-grotesk font-bold text-texto-primario text-center">
                          {obtenerCantidadTotal(venta)}
                        </td>
                        <td className={`p-4 text-sm font-space-grotesk font-bold text-right ${venta.anulada ? 'text-texto-secundario line-through' : 'text-exito'}`}>
                          ${obtenerTotalVenta(venta).toFixed(2)}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => { setSelectedVentaDetalle(venta); setModalDetalleOpen(true); }}
                              className="p-2 rounded-lg bg-superficie-hover hover:bg-superficie-hover text-texto-primario transition-colors cursor-pointer inline-flex items-center justify-center"
                              title="Ver detalles"
                            >
                              <Eye size={14} />
                            </button>
                            {!venta.anulada && (
                              <button
                                onClick={() => setVentaAAnular(venta.id)}
                                className="p-2 rounded-lg bg-peligro/10 hover:bg-peligro/20 text-peligro transition-colors cursor-pointer inline-flex items-center justify-center"
                                title="Anular venta"
                              >
                                <Ban size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modales */}
      <NuevaVentaModal isOpen={modalVentaOpen} onClose={() => setModalVentaOpen(false)} onNotify={setToastMessage} />
      <NuevoGastoModal isOpen={modalGastoOpen} onClose={() => setModalGastoOpen(false)} onNotify={setToastMessage} />
      <ProductModal isOpen={modalProductoOpen} onClose={() => setModalProductoOpen(false)} activeTab={productoActiveTab} onNotify={setToastMessage} />
      <DetalleVentaModal isOpen={modalDetalleOpen} onClose={() => { setModalDetalleOpen(false); setSelectedVentaDetalle(null); }} venta={selectedVentaDetalle} tasaBCV={tasaBCV} />

      {/* Toast Notification */}
      <Toast mensaje={toastMessage} />
    </div>

    {/* Modal de Confirmación de Anulación */}
    {ventaAAnular && (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-superficie w-full max-w-sm rounded-3xl border border-[var(--glass-border)] shadow-[var(--glass-shadow)] p-6 space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-peligro/10 text-peligro flex items-center justify-center">
              <Ban size={24} />
            </div>
            <h3 className="font-plus-jakarta text-lg font-bold text-texto-primario">¿Anular esta venta?</h3>
            <p className="text-xs text-texto-secundario leading-relaxed">
              Esta acción no se puede deshacer. Se reajustará el stock y las finanzas automáticamente.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              disabled={isAnulando}
              onClick={() => setVentaAAnular(null)}
              className="flex-1 py-2.5 rounded-xl font-medium text-texto-primario bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] border border-[var(--glass-border)] transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isAnulando}
              onClick={async () => {
                setIsAnulando(true);
                try {
                  await anularVenta(ventaAAnular);
                  setVentaAAnular(null);
                  setToastMessage({ title: 'Venta anulada y stock restaurado', type: 'success' });
                } catch (err) {
                  setToastMessage({ title: err instanceof Error ? err.message : 'Error al anular la venta', type: 'error' });
                } finally {
                  setIsAnulando(false);
                }
              }}
              className="flex-1 py-2.5 rounded-xl font-bold bg-peligro text-white hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center gap-1.5"
            >
              {isAnulando ? 'Anulando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}

