# 🤖 Documentación de Uso de Inteligencia Artificial (AI Usage)

En cumplimiento con los requerimientos del proyecto, este documento certifica y describe detalladamente el uso de **Inteligencia Artificial (IA)** como herramienta de asistencia técnica y desarrollo acelerado para la **generación granular del código**, resolución de problemas y optimización de la solución.

---

## 1. Alcance y Propósito del Uso de la IA

La Inteligencia Artificial (utilizando modelos de lenguaje de última generación como Google Gemini / Antigravity) fue adoptada como un **par programador (AI Pair Programmer)** a lo largo del ciclo de vida del proyecto. 

Su rol principal consistió en la **generación granular de código fuente**, diseño de arquitecturas modulares, asistencia en depuración de contenedores Docker y estandarización de buenas prácticas en TypeScript, NestJS y Next.js.

---

## 2. Áreas de Generación Granular de Código Asistida por IA

### 2.1. Capa Backend (NestJS 12 + TypeORM)
- **Modelado de Entidades Relacionales:** Generación precisa de los esquemas de datos TypeORM para [`Tenant`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/apps/backend/src/entities/tenants/tenant.entity.ts), [`User`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/apps/backend/src/entities/users/user.entity.ts), [`Request`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/apps/backend/src/entities/requests/request.entity.ts) y [`RequestHistory`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/apps/backend/src/entities/requests/request-history.entity.ts), incluyendo relaciones foráneas en cascada e índices.
- **Validación y DTOs:** Creación de objetos de transferencia de datos con decoradores de `class-validator` y `class-transformer` para garantizar tipado estricto e higiene en los payloads HTTP recibidos.
- **Autenticación y Seguridad (RBAC):** Asistencia en la configuración del módulo de autenticación Passport JWT ([`JwtStrategy`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/apps/backend/src/auth/jwt.strategy.ts)), decoradores personalizados ([`@Roles()`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/apps/backend/src/common/decorators/roles.decorator.ts), [`@CurrentUser()`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/apps/backend/src/common/decorators/current-user.decorator.ts)) y guards de acceso ([`RolesGuard`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/apps/backend/src/auth/guards/roles.guard.ts)).
- **Lógica de Negocio y Máquina de Estados:** Generación de la validación de transiciones de estados de solicitudes en [`RequestsService`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/apps/backend/src/entities/requests/services/request.service.ts), implementando el registro inmutable en el historial de auditoría de cada solicitud de forma transaccional.
- **Script de Sembrado (Seed):** Elaboración granular del script [`seed.ts`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/apps/backend/src/database/seed.ts) para poblar organizaciones de prueba (Empresa Alfa y Empresa Beta), generar hashes seguros con `bcrypt` y habilitar la validación inmediata del aislamiento multi-tenant.

### 2.2. Capa Frontend (Next.js 16 + React 19 + Tailwind CSS v4)
- **Estructura de Páginas App Router:** Generación de las rutas `/login`, `/dashboard`, `/request/new` y `/request/[id]` con layouts adaptables y navegación protegida.
- **Cliente HTTP e Interceptores:** Creación del cliente Axios centralizado en [`http.config.ts`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/apps/frontend/src/api/http.config.ts) con inyección automática de tokens Bearer desde cookies y cabeceras de idempotencia `Idempotency-Key` basadas en UUIDv4.
- **Integración con TanStack Query:** Asistencia en la generación de hooks y mutaciones asíncronas para consultas en caché, recarga en segundo plano e invalidación reactiva tras mutaciones de estado.
- **Componentes Visuales:** Diseño de interfaces modernas con Tailwind CSS v4, incluyendo tarjetas de métricas, badges semánticos para los estados (`SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `CANCELLED`) y línea de tiempo para la auditoría.

### 2.3. Infraestructura y Contenedores (Docker)
- **Normalización de Dockerfiles:** Creación de Dockerfiles multi-etapa (`builder` y `runner`) basados en `node:20-alpine` para optimizar el tamaño de las imágenes finales de backend y frontend.
- **Orquestación con Docker Compose:** Configuración integral de [`docker-compose.yml`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/docker-compose.yml) con sondas de salud (`healthcheck`) en PostgreSQL y ordenamiento estricto de arranque (`service_healthy`).
- **Contexto de Construcción (.dockerignore):** Creación de archivos `.dockerignore` para evitar la transferencia innecesaria de dependencias locales o builds previos al daemon de Docker.

---

## 3. Diagnóstico y Resolución de Problemas Asistida por IA

Durante la fase de integración y levantamiento del proyecto con `docker compose up --build`, la IA fue instrumental para identificar y resolver los siguientes problemas específicos:

1. **Error de Conexión a la Base de Datos en Contenedores:**
   - *Problema:* El módulo de base de datos esperaba la variable `POSTGRES_HOST`, pero Docker Compose pasaba `DATABASE_URL`. Al no resolverse, caía en el fallback `localhost`, apuntando al contenedor local del backend en lugar del contenedor `postgres`.
   - *Solución generada por IA:* Se adaptó [`database.module.ts`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/apps/backend/src/database/database.module.ts) para soportar de forma dual `DATABASE_URL` y variables individuales (`POSTGRES_HOST`), y se normalizó el entorno en `docker-compose.yml` y `.env`.

2. **Falla en la Ejecución del Script de Seed (`seed:prod`):**
   - *Problema:* El comando `TRUNCATE TABLE` fallaba en bases de datos vacías al no existir aún las tablas en el instante previo a la sincronización.
   - *Solución generada por IA:* Se añadió `await dataSource.synchronize()` de manera explícita en [`seed.ts`](file:///c:/Users/parra/Documents/Repositorios/BluePixel%20Test/bluepixel-fullstack-test/apps/backend/src/database/seed.ts) y se manejó el truncado de tablas de manera segura con salida limpia `process.exit(0)`.

3. **Inconsistencia de Puertos y Variables de Entorno del Frontend:**
   - *Problema:* Next.js evalúa las variables `NEXT_PUBLIC_*` en tiempo de compilación (`npm run build`). En el contenedor de Docker no se recibía la variable en la fase de build, provocando que las peticiones se dirigieran a un puerto por defecto erróneo (`3000` en lugar de `3001`).
   - *Solución generada por IA:* Se añadieron `ARG NEXT_PUBLIC_API_URL` y `ENV NEXT_PUBLIC_API_URL` en el Dockerfile del frontend, mapeados a través de `args` en `docker-compose.yml`, y se corrigieron los fallbacks locales a `3001`.

---

## 4. Metodología de Validación y Supervisión Humana

A pesar de que el código granular fue generado y optimizado con la asistencia de la IA, se mantuvo una rigurosa supervisión y validación técnica:
- **Revisión de Código:** Cada fragmento generado fue revisado para validar la coherencia del tipado, la lógica de negocio y la ausencia de vulnerabilidades.
- **Validación Funcional:** Se verificó el flujo completo de inicio de sesión, creación de solicitudes, cambio de estados con rol `ADMIN`, denegación de cambios de estado con rol `MEMBER` y el aislamiento de datos entre los tenants de prueba (*Empresa Alfa* y *Empresa Beta*).
- **Pruebas de Compilación:** Se ejecutaron builds automatizados en entornos limpios para certificar la compilación sin errores tanto en Next.js (Turbopack) como en NestJS (TypeScript).

---

## 5. Conclusión

El uso de la Inteligencia Artificial en este proyecto actuó como un multiplicador de productividad, permitiendo construir un sistema fullstack robusto, bien estructurado, completamente dockerizado y documentado en un tiempo sustancialmente menor, manteniendo en todo momento altos estándares de calidad, seguridad y mantenibilidad de software.
