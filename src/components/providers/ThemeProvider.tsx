'use client';

import { createContext, useContext, useState, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

const CLAVE_TEMA = 'manotech_theme';

// El modo claro es el predeterminado del sistema MANOTECH.
// Solo se respeta "dark" si el usuario lo eligió explícitamente.
function aplicarTemaEnDocumento(tema: Theme) {
  const raiz = document.documentElement;
  raiz.classList.toggle('light', tema === 'light');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', tema === 'light' ? '#FAF8FE' : '#13071E');
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Inicialización perezosa del tema (lee localStorage solo en el cliente,
  // evitando el setState dentro de un useEffect).
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';

    const temaGuardado = localStorage.getItem(CLAVE_TEMA);
    const temaInicial: Theme = temaGuardado === 'dark' ? 'dark' : 'light';

    aplicarTemaEnDocumento(temaInicial);

    return temaInicial;
  });

  // Detecta el montaje en cliente sin setState en effect (evita FOUC).
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const toggleTheme = () => {
    setTheme(prev => {
      const nuevoTema: Theme = prev === 'dark' ? 'light' : 'dark';
      aplicarTemaEnDocumento(nuevoTema);
      localStorage.setItem(CLAVE_TEMA, nuevoTema);
      return nuevoTema;
    });
  };

  // Evita el destello (flash of unstyled content) de SSR a cliente
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
