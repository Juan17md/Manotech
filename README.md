<div align="center">

<img src="public/logo_sin_fondo.PNG" alt="MANOTECH" width="360" />

# MANOTECH · Panel Administrativo

**Sistema de gestión integral para tiendas de telefonía y accesorios tecnológicos**

<p>
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

</div>

---

## Visión general

**MANOTECH** es una plataforma administrativa de uso interno para el control operativo de una tienda de tecnología móvil. Centraliza inventario, ventas, caja, finanzas, historial y personal en una interfaz única, con sincronización en tiempo real sobre **Firebase Firestore** y control de acceso por roles.

El proyecto nace con una filosofía clara: **operaciones atómicas, trazabilidad contable y una experiencia de mostrador rápida**, tanto en escritorio como en tablet y móvil.

> [!NOTE]
> Este repositorio es de carácter privado. La documentación funcional y técnica completa vive en la bóveda de Obsidian del proyecto (`docs-obsidian`).

---

## Características principales

| Módulo | Capacidades |
| :--- | :--- |
| **Dashboard** | KPIs del día en USD y Bs, ganancia neta, transacciones, alertas de stock crítico, accesos rápidos y tasa BCV con caché offline. |
| **Inventario** | CRUD de productos con SKU, marca, categoría, costo, PVP y stock; buscador, filtros, paginación, cards de inversión/ganancia/total y exportación Excel/PDF. |
| **Ventas** | Carrito multi-producto con cliente, método de pago, descuentos por precio final y descuento de stock dentro de una transacción de Firestore. |
| **Caja** | Saldo por método (semanal o acumulado), retiros, gastos que descuentan de caja, cierres dominicales con arqueo y diferencia, exportación del cierre. |
| **Finanzas** | Ingresos, ganancia operativa, gastos por categoría y visualizaciones con Recharts (ventas diarias, métodos de pago y top de productos). |
| **Historial** | Bitácora de ventas y gastos, detalle tipo factura, anulación atómica con reposición de stock y exportación multiformato. |
| **Usuarios** | Alta, edición, bloqueo, cambio de rol y eliminación de cuentas; primer inicio con cambio de contraseña obligatorio. |
| **PWA** | Manifest, iconos, service worker y persistencia local de Firestore para tolerancia a cortes de red. |

---

## Stack tecnológico

| Capa | Tecnología |
| :--- | :--- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript estricto |
| Estilos | Tailwind CSS v4 con tokens CSS y glassmorphism |
| Datos | Firebase Authentication + Cloud Firestore (SDK cliente y Admin SDK) |
| Gráficas | Recharts |
| Exportaciones | ExcelJS y jsPDF + AutoTable |
| Iconografía | Lucide React |
| Pruebas | Vitest + Testing Library + Firebase Rules Unit Testing |
| Despliegue | Vercel (cron deshabilitado hasta configurar backups) |

---

## Arquitectura

```mermaid
graph TD
    UI[Next.js App Router] --> AUTH[Firebase Auth]
    UI --> CTX[TiendaContext - estado global]
    CTX --> FS[(Cloud Firestore)]
    UI --> APIS[API Routes]
    APIS --> ADMIN[Firebase Admin SDK]
    APIS --> EXP[Excel / PDF]
    ADMIN --> FS
    FS --> RULES[Reglas de seguridad Firestore]
```

- **`src/app`**: rutas, layouts y endpoints (`/api/usuarios`, `/api/backup`, webhook de Sentry).
- **`src/components`**: módulos por dominio (inventario, finanzas, caja, usuarios, shared).
- **`src/context`**: sincronización en tiempo real con Firestore y acciones de negocio.
- **`src/services`**: inicialización de Firebase cliente/Admin y utilidades de Drive.
- **`src/utils`**: cálculos de caja, fechas, formatos y exportaciones.
- **`src/types`**: modelos de dominio en español y helpers de compatibilidad.

### Integridad transaccional

Las ventas y su anulación se ejecutan con `runTransaction`: se valida el stock, se descuenta o repone y se registra la venta en una sola operación atómica. Los cierres de caja son registros contables editables, pero **no eliminables**.

---

## Diseño · Violeta MANOTECH

La identidad visual se deriva directamente del logo de la marca.

| Token | Hex | Uso |
| :--- | :--- | :--- |
| Fondo principal | `#1D0D2A` | Fondo general de la aplicación |
| Superficie | `#2A1440` | Tarjetas, modales y barras |
| Acento primario | `#7D44DA` | Acciones, enlaces y foco |
| Texto primario | `#F5F0FA` | Títulos y datos clave |
| Texto secundario | `#B9A9CC` | Descripciones y fechas |
| Éxito | `#10B981` | Ingresos y ganancias |
| Aviso | `#FF9F43` | Stock crítico |
| Peligro | `#FF4949` | Gastos, errores y stock agotado |

Los tokens viven en `src/app/globals.css` y se consumen como utilidades de Tailwind (`bg-superficie`, `text-acento-primario`, etc.). El modo claro redefine únicamente los valores, manteniendo la misma semántica.

---

## Puesta en marcha

### 1. Requisitos

- Node.js 20 o superior
- npm 10 o superior
- Un proyecto de Firebase con Firestore y Authentication habilitados

### 2. Instalación

```bash
npm ci
```

### 3. Variables de entorno

Crea `.env.local` a partir de la plantilla de tu entorno. Como mínimo:

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> [!WARNING]
> Los archivos `.env*` están excluidos del repositorio. Nunca subas credenciales del Admin SDK.

### 4. Reglas de Firestore

```bash
npx -y firebase-tools@latest deploy --only firestore:rules
```

Las reglas se despliegan manualmente; no viajan con el build de Vercel.

### 5. Desarrollo

```bash
npm run dev
```

### 6. Verificación

```bash
npm run lint
npx tsc --noEmit
npm test
```

Las pruebas de reglas requieren el emulador:

```bash
npm run test:reglas
```

---

## Scripts operativos

| Script | Propósito |
| :--- | :--- |
| `node scripts/crear-usuario.mjs --env=.env.dev --email=... --password=... --rol=admin --si` | Crea una cuenta en Auth y su documento en `usuarios`. |
| `node scripts/crear-admin.mjs --env=.env.dev --email=... --si` | Asegura el rol `admin` de una cuenta existente. |
| `node scripts/cargar-inventario.mjs --env=.env.dev --si` | Carga el catálogo de prueba (72 productos) de forma idempotente por SKU. |
| `node scripts/restaurar-backup.mjs --archivo=... --si` | Restaura un backup JSON de Firestore. |
| `node scripts/generar-iconos.mjs` | Regenera los iconos PWA a partir de `public/icono_sin_fondo.PNG`. |

> La carpeta `scripts/` se mantiene fuera del control de versiones por contener utilidades operativas.

---

## Modelo de permisos

- **`admin`**: acceso total, incluida la gestión de usuarios y cierres contables.
- **`operador`**: acceso a inventario, ventas, caja, finanzas e historial.
- Los usuarios bloqueados se redirigen a `/bloqueado`.
- El primer inicio de un operador fuerza el cambio de contraseña en `/cambiar-contrasena`.

---

## Estado del proyecto

- Base funcional replicada y adaptada a la identidad **MANOTECH**.
- Entorno **dev** (`nanotech-dev-4d17d`) con administrador y catálogo de prueba.
- Integraciones de Sentry/Telegram y backups a Google Drive **preparadas pero desactivadas** hasta configurar credenciales propias.
- Pendiente: validación funcional manual, endurecimiento de reglas y despliegue a producción.

---

<div align="center">
  <sub>Desarrollado con Next.js, TypeScript y Firebase — MANOTECH</sub>
</div>
