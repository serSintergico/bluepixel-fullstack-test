# BluePixel Fullstack Technical Assessment

Sistema integral de gestión de solicitudes multi-tenant con auditoría de estados, autenticación basada en roles y flujo seguro de transiciones.

---

## 🚀 Tecnologías Principales

- **Backend:** [NestJS 12](https://nestjs.com/) + TypeScript
- **ORM & Base de Datos:** [TypeORM](https://typeorm.io/) + PostgreSQL 15
- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack) + React 19
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Gestión de Estado Servidor:** [TanStack React Query v5](https://tanstack.com/query)
- **Contenedores:** Docker & Docker Compose (Multi-stage builds)

---

## 📋 Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (con WSL2 habilitado en Windows o Docker Engine en Linux/macOS)
- [Node.js](https://nodejs.org/) v20+ (únicamente si se desea ejecutar en modo desarrollo local sin Docker)

---

## ⚡ Inicio Rápido con Docker Compose (Recomendado)

1. **Abre Docker Desktop** y asegúrate de que el daemon esté activo.
2. Abre una terminal en la **raíz del repositorio** donde se encuentra el archivo `docker-compose.yml`.
3. Ejecuta el comando de compilación y levantamiento:
   ```bash
   docker compose up --build
   ```
   *(O en segundo plano: `docker compose up -d --build`)*
4. El proceso ejecutará automáticamente:
   - Inicialización del servicio **PostgreSQL 15** con volume persistente y healthcheck.
   - Compilación del **Backend NestJS**, sincronización de tablas y ejecución automática del **Seed** con datos de prueba.
   - Compilación y arranque del **Frontend Next.js** enlazado a la API.

---

## 🌐 Servicios y Puertos

| Servicio | URL / Host | Puerto Contenedor | Puerto Host | Descripción |
|---|---|---|---|---|
| **Frontend** | [http://localhost:4000](http://localhost:4000) | `4000` | `4000` | Aplicación Web Next.js |
| **Backend API** | [http://localhost:3001](http://localhost:3001) | `3001` | `3001` | API REST NestJS |
| **PostgreSQL** | `localhost:5432` | `5432` | `5432` | Base de datos relacional |

---

## 🔐 Credenciales de Prueba (Seed Automático)

Al levantarse el backend, el script de inicialización (`seed:prod`) puebla la base de datos con dos organizaciones (Tenants) y usuarios con roles preconfigurados para validar el aislamiento multi-tenant y la autorización por roles:

| Organización (Tenant) | Correo Electrónico | Contraseña | Rol | Capacidades |
|---|---|---|---|---|
| **Empresa Alfa** | `admin@alfa.com` | `password123` | `ADMIN` | Ver todas las solicitudes de Alfa, crear y cambiar estados (Aprobar/Rechazar). |
| **Empresa Alfa** | `member@alfa.com` | `password123` | `MEMBER` | Ver solicitudes de Alfa y crear nuevas solicitudes. |
| **Empresa Beta** | `admin@beta.com` | `password123` | `ADMIN` | Ver y gestionar solicitudes exclusivas de Empresa Beta (Aislamiento de datos). |

> **Prueba de Aislamiento:** Inicia sesión con `admin@alfa.com` y crea solicitudes; luego cierra sesión e ingresa con `admin@beta.com`. Verás que las solicitudes de Empresa Alfa no son visibles para Empresa Beta, garantizando el aislamiento a nivel de base de datos y backend.

---

## 📡 Endpoints de la API Backend

### Autenticación (`/auth`)
- `POST /auth/login`: Autentica un usuario con `email` y `password`, retornando un JWT que contiene `sub`, `email`, `role` y `tenantId`.

### Solicitudes (`/requests`)
- `GET /requests`: Lista todas las solicitudes pertenecientes al tenant del usuario autenticado (soporta filtros por `status`).
- `GET /requests/dashboard/stats`: Retorna métricas cuantitativas por estado para los widgets del dashboard.
- `GET /requests/:id`: Obtiene el detalle de una solicitud junto a su historial cronológico de cambios de estado y datos del creador.
- `POST /requests`: Crea una nueva solicitud (`title`, `description`) asociada al tenant y al usuario actual.
- `PATCH /requests/:id/status`: Cambia el estado de una solicitud (`status`, `comment`). **Requiere rol ADMIN**. Valida la máquina de estados y registra la entrada en `RequestHistory`.

---

## 🛠️ Ejecución Local en Desarrollo (Sin Docker)

Si prefieres ejecutar los proyectos de manera individual en tu entorno local:

### 1. Base de datos
Levanta una instancia de PostgreSQL en el puerto `5432` con la base de datos `bluepixel_db`, o utiliza únicamente el contenedor de base de datos:
```bash
docker compose up postgres -d
```

### 2. Backend (`apps/backend`)
```bash
cd apps/backend
npm install
npm run seed       # Ejecuta el seed de datos iniciales
npm run start:dev  # Inicia NestJS en modo watch en http://localhost:3001
```

### 3. Frontend (`apps/frontend`)
```bash
cd apps/frontend
npm install
npm run dev        # Inicia Next.js en http://localhost:4000
```

---

## 📂 Estructura del Repositorio

```text
├── apps/
│   ├── backend/               # Servidor NestJS 12
│   │   ├── src/
│   │   │   ├── auth/          # Módulo de Autenticación, JWT Strategy & Guards
│   │   │   ├── common/        # Decoradores (@Roles, @CurrentUser), Enums
│   │   │   ├── database/      # TypeORM configuration & seed script
│   │   │   └── entities/      # Entidades (Tenant, User, Request, RequestHistory)
│   │   ├── Dockerfile         # Multi-stage Dockerfile para producción
│   │   └── package.json
│   └── frontend/              # Aplicación Web Next.js 16 (App Router)
│       ├── src/
│       │   ├── api/           # Cliente Axios con interceptores de JWT e idempotencia
│       │   ├── app/           # Rutas: /login, /dashboard, /request/new, /request/[id]
│       │   ├── components/    # Componentes reutilizables UI
│       │   └── types/         # Definiciones TypeScript
│       ├── Dockerfile         # Multi-stage Dockerfile para producción
│       └── package.json
├── docker-compose.yml         # Orquestador multi-contenedor
├── ARCHITECTURE.md            # Documentación detallada de arquitectura técnica
├── AI_USAGE.md                # Bitácora y documentación de uso de Inteligencia Artificial
└── README.md                  # Guía principal del proyecto
```

---

## 🧪 Pruebas Unitarias y Linting

### Backend
```bash
cd apps/backend
npm run test       # Ejecutar tests unitarios con Jest
npm run lint       # Análisis estático de código con Oxlint
```

### Frontend
```bash
cd apps/frontend
npm run lint       # Análisis estático de código con ESLint
```
