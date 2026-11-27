'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTienda } from '@/context/TiendaContext';
import { Producto, CategoriaProducto } from '@/types';
import ProductList from '@/components/inventario/ProductList';
import ProductModal from '@/components/inventario/ProductModal';
import { Plus, Search, Filter, AlertTriangle, CheckCircle2, Wallet, TrendingUp, BadgeDollarSign } from 'lucide-react';
import Select from '@/components/shared/Select';
import BotonExportar from '@/components/shared/BotonExportar';
import { exportarProductosExcel } from '@/utils/exportExcel';
import { exportarProductosPdf } from '@/utils/exportPdf';

export default function InventarioPage() {
  const { productos, loadingProductos, eliminarProducto } = useTienda();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'Telefonos' | 'Accesorios'>('Telefonos');
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaProducto | 'Todas'>('Todas');
  
  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState<Producto | null>(null);

  // Estados de Confirmación y Toast
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; type: 'success' | 'error' } | null>(null);

  // Ocultar toast automáticamente
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handler Exportar a Excel
  const handleExportarExcel = async () => {
    if (productosFiltrados.length === 0) {
      setToastMessage({ title: 'No hay productos para exportar', type: 'error' });
      return;
    }
    try {
      const fechaStr = new Date().toISOString().split('T')[0];
      const nombreArchivo = `Inventario_${activeTab}_${fechaStr}`;
      await exportarProductosExcel(productosFiltrados, nombreArchivo);
      setToastMessage({ title: 'Excel descargado exitosamente', type: 'success' });
    } catch (error) {
      console.error("Error exportando a Excel:", error);
      setToastMessage({ title: 'Error al generar el archivo Excel', type: 'error' });
    }
  };

  // Handler Exportar a PDF
  const handleExportarPdf = async () => {
    if (productosFiltrados.length === 0) {
      setToastMessage({ title: 'No hay productos para exportar', type: 'error' });
      return;
    }
    try {
      const fechaStr = new Date().toISOString().split('T')[0];
      const nombreArchivo = `Inventario_${activeTab}_${fechaStr}`;
      await exportarProductosPdf(productosFiltrados, nombreArchivo);
      setToastMessage({ title: 'PDF descargado exitosamente', type: 'success' });
    } catch (error) {
      console.error("Error exportando a PDF:", error);
      setToastMessage({ title: 'Error al generar el archivo PDF', type: 'error' });
    }
  };

  // Totales globales del inventario (todos los productos, sin filtros)
  const totalesInventario = useMemo(() => {
    const totalInvertido = productos.reduce((acc, p) => acc + p.costoCompra * p.stockActual, 0);
    const totalGanancia = productos.reduce((acc, p) => acc + (p.precioVenta - p.costoCompra) * p.stockActual, 0);
    return { totalInvertido, totalGanancia, total: totalInvertido + totalGanancia };
  }, [productos]);

  // Filtrado optimizado con Tabs
  const productosFiltrados = productos.filter(p => {
    // Filtro de Búsqueda
    const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.marca.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de Tab Principal
    const isTelefono = p.categoria === 'Teléfonos';
    const matchTab = activeTab === 'Telefonos' ? isTelefono : !isTelefono;

    // Filtro de Sub-Categoría (Solo aplica en Accesorios, o si es Todas)
    const matchCategoria = selectedCategoria === 'Todas' || p.categoria === selectedCategoria;
    
    return matchSearch && matchTab && matchCategoria;
  });

  const handleOpenNuevo = () => {
    setProductoEnEdicion(null);
    setIsModalOpen(true);
  };

  const handleOpenEditar = (producto: Producto) => {
    setProductoEnEdicion(producto);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (producto: Producto) => {
    setProductoAEliminar(producto);
  };

  const confirmDelete = async () => {
    if (!productoAEliminar) return;
    try {
      await eliminarProducto(productoAEliminar.id);
      setToastMessage({ title: 'Producto eliminado exitosamente', type: 'success' });
    } catch (error) {
      console.error("Error al eliminar", error);
      setToastMessage({ title: 'Error al eliminar el producto', type: 'error' });
    } finally {
      setProductoAEliminar(null);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      
      {/* Header y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-plus-jakarta font-bold text-2xl sm:text-3xl text-texto-primario">Inventario</h2>
          <p className="text-texto-secundario mt-1 text-sm sm:text-base">Gestiona tu stock de teléfonos y accesorios.</p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <BotonExportar
            onExportarExcel={handleExportarExcel}
            onExportarPdf={handleExportarPdf}
            texto="Exportar"
          />

          <button 
            onClick={handleOpenNuevo}
            className="flex items-center justify-center gap-2 bg-acento-primario text-white font-bold px-4 sm:px-6 py-3 rounded-xl shadow-lg shadow-acento-primario/20 hover:-translate-y-1 hover:shadow-acento-primario/40 hover:box-glow-primario active:scale-95 transition-all min-h-[44px]"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">
              {activeTab === 'Telefonos' ? 'Agregar Teléfono' : 'Agregar Accesorio'}
            </span>
            <span className="sm:hidden">Agregar</span>
          </button>
        </div>
      </div>

      {/* Resumen de Inventario (Totales Globales) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
        
        {/* Total Invertido */}
        <div className="glass-panel p-5 md:p-6 rounded-2xl flex items-center justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-acento-primario/10 transition-all duration-300">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-texto-secundario font-medium">Total Invertido</p>
            <h3 className="font-space-grotesk font-bold text-2xl sm:text-3xl text-acento-primario mt-1 truncate">${totalesInventario.totalInvertido.toFixed(2)}</h3>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-acento-primario/10 flex items-center justify-center text-acento-primario shrink-0 ml-3">
            <Wallet size={22} />
          </div>
        </div>

        {/* Total de Ganancia */}
        <div className="glass-panel p-5 md:p-6 rounded-2xl flex items-center justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-acento-primario/10 transition-all duration-300">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-texto-secundario font-medium">Total de Ganancia</p>
            <h3 className="font-space-grotesk font-bold text-2xl sm:text-3xl text-exito mt-1 truncate">${totalesInventario.totalGanancia.toFixed(2)}</h3>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-exito/10 flex items-center justify-center text-exito shrink-0 ml-3">
            <TrendingUp size={22} />
          </div>
        </div>

        {/* Total Global */}
        <div className="glass-panel p-5 md:p-6 rounded-2xl flex items-center justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-acento-primario/10 transition-all duration-300">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-texto-secundario font-medium">Total Global</p>
            <h3 className="font-space-grotesk font-bold text-2xl sm:text-3xl text-texto-primario mt-1 truncate">${totalesInventario.total.toFixed(2)}</h3>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-superficie-hover flex items-center justify-center text-texto-primario shrink-0 ml-3">
            <BadgeDollarSign size={22} />
          </div>
        </div>

      </div>

      {/* Tabs (Segmented Control) Premium */}
      <div className="p-1 glass-panel rounded-xl flex w-full sm:w-auto sm:inline-flex">
        <button
          onClick={() => { setActiveTab('Telefonos'); setSelectedCategoria('Todas'); }}
          className={`flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
            activeTab === 'Telefonos' 
              ? 'bg-acento-primario text-white shadow-md' 
              : 'text-texto-secundario hover:text-texto-primario hover:bg-superficie-hover'
          }`}
        >
          Teléfonos
        </button>
        <button
          onClick={() => { setActiveTab('Accesorios'); setSelectedCategoria('Todas'); }}
          className={`flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
            activeTab === 'Accesorios' 
              ? 'bg-acento-primario text-white shadow-md' 
              : 'text-texto-secundario hover:text-texto-primario hover:bg-superficie-hover'
          }`}
        >
          Accesorios
        </button>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="glass-panel p-2 rounded-xl flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-texto-secundario">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder={activeTab === 'Telefonos' ? "Buscar teléfonos..." : "Buscar accesorios..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-texto-primario pl-11 pr-4 py-3 min-h-[44px] rounded-lg focus:outline-none focus:bg-[var(--glass-border)] transition-colors"
          />
        </div>
        
        {activeTab === 'Accesorios' && (
          <>
            <div className="w-full h-px bg-acento-tenue sm:hidden" />
            <div className="sm:w-56">
              <Select
                value={selectedCategoria}
                onChange={v => setSelectedCategoria(v as CategoriaProducto | 'Todas')}
                icon={<Filter size={18} />}
                options={[
                  { value: 'Todas', label: 'Todas las Categorías' },
                  { value: 'Protectores', label: 'Protectores' },
                  { value: 'Cargadores', label: 'Cargadores' },
                  { value: 'Auriculares', label: 'Auriculares' },
                  { value: 'Otros', label: 'Otros' },
                ]}
              />
            </div>
          </>
        )}
      </div>

      {/* Lista / Tabla de Productos */}
      <ProductList 
        key={`${activeTab}-${selectedCategoria}-${searchTerm}`}
        productos={productosFiltrados} 
        loading={loadingProductos} 
        onEdit={handleOpenEditar} 
        onDelete={handleDeleteRequest}
      />

      {/* Modal de CRUD */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productoEditar={productoEnEdicion}
        activeTab={activeTab}
        onNotify={setToastMessage}
      />

      {/* Modal de Confirmación de Eliminación */}
      {productoAEliminar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 sm:px-0">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setProductoAEliminar(null)}></div>
          <div className="bg-fondo-principal border border-borde-sutil p-6 rounded-2xl shadow-2xl relative z-10 w-full max-w-sm flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-peligro/10 flex items-center justify-center text-peligro shrink-0">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-xl font-bold text-texto-primario">¿Eliminar Producto?</h3>
            </div>
            <p className="text-texto-secundario text-sm">
              Estás a punto de eliminar <span className="font-bold text-texto-primario">{productoAEliminar.nombre}</span> del inventario. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <button 
                onClick={() => setProductoAEliminar(null)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-texto-primario hover:bg-superficie-hover transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-peligro hover:bg-peligro/90 shadow-lg shadow-peligro/20 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-full shadow-lg border backdrop-blur-md ${
            toastMessage.type === 'success' 
              ? 'bg-exito/10 border-exito/20 text-exito'
              : 'bg-peligro/10 border-peligro/20 text-peligro'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span className="text-sm font-bold">{toastMessage.title}</span>
          </div>
        </div>
      )}

    </div>
  );
}
