# Plan de Refactorización: Arquitectura Robusta (Backend Hexagonal + Frontend Modular)

## 1. Resumen
El objetivo de este plan es transformar la actual aplicación monolítica (construida en Next.js donde conviven el frontend y las rutas de API) en una arquitectura robusta, escalable y mantenible que sirva como referencia para futuros proyectos. 
Se dividirá el proyecto en un **Monorepo** (usando npm/pnpm workspaces o Turborepo) que contendrá dos aplicaciones principales: un **Backend independiente** estructurado bajo los principios de la **Arquitectura Hexagonal (Clean Architecture)** y un **Frontend** estructurado de manera **Modular (basado en Feature-Sliced Design)**.

## 2. Análisis del Estado Actual
- **Tipo de Proyecto:** Monolito en Next.js (App Router).
- **Backend Actual:** Implementado en `src/app/api/` usando Route Handlers de Next.js.
- **Acoplamiento:** La lógica de negocio, el acceso a datos (Prisma) y el enrutamiento HTTP están mezclados en los mismos archivos (ej. `src/app/api/citas/route.ts`).
- **Frontend Actual:** Los componentes y las vistas están en `src/app` y `src/components`, agrupados de forma tradicional, lo que dificulta la escalabilidad a medida que el proyecto crece.
- **Base de Datos:** PostgreSQL administrada a través de Prisma ORM.

## 3. Cambios Propuestos

La refactorización se dividirá en las siguientes fases:

### Paso 1: Configuración del Monorepo
Convertir el repositorio actual en un monorepo para mantener el frontend y el backend separados lógicamente, pero compartiendo tipos y configuraciones.
- **Acción:** Inicializar espacios de trabajo (workspaces) creando la carpeta `apps/` y `packages/`.
- **Estructura base:**
  ```text
  /
  ├── apps/
  │   ├── frontend/     (Aplicación Next.js - UI)
  │   └── backend/      (Aplicación Node.js/Express - API)
  ├── packages/
  │   ├── db/           (Esquema de Prisma y cliente compartido)
  │   └── types/        (Interfaces y tipos de TypeScript compartidos)
  ├── package.json
  └── turbo.json        (Opcional, para orquestar los scripts)
  ```

### Paso 2: Arquitectura del Backend (Arquitectura Hexagonal / Clean)
Extraer toda la lógica de `src/app/api` hacia `apps/backend` utilizando Node.js con TypeScript (Express o Fastify).
- **Estructura Interna del Backend:**
  ```text
  apps/backend/src/
  ├── domain/           # Capa central: Entidades, Interfaces de Repositorios, Errores de dominio (Ej: Cita, Cliente). No depende de NADA externo.
  ├── application/      # Casos de Uso (Use Cases) o Servicios: Orquestan la lógica de negocio (Ej: CrearCitaUseCase, ObtenerCitasUseCase).
  └── infrastructure/   # Capa externa: Detalles de implementación.
      ├── http/         # Controladores (Express/Fastify) y Rutas.
      ├── database/     # Implementación de los repositorios usando Prisma.
      └── config/       # Variables de entorno, inyección de dependencias.
  ```
- **Beneficio:** Si en el futuro se desea cambiar Prisma por otro ORM, o Express por Fastify, la lógica de negocio (`domain` y `application`) no sufrirá ningún cambio.

### Paso 3: Arquitectura del Frontend (Modular / Feature-Sliced Design)
Mover el código de interfaz actual a `apps/frontend` (manteniendo Next.js para SSR/SSG y React) pero reestructurando los directorios para mayor cohesión.
- **Estructura Interna del Frontend:**
  ```text
  apps/frontend/src/
  ├── app/              # Enrutamiento de Next.js (Pages, Layouts, Providers globales).
  ├── features/         # Módulos separados por dominio (ej: citas, clientes, inventario).
  │   ├── citas/
  │   │   ├── components/  # Componentes específicos de citas (Ej: FormCita).
  │   │   ├── hooks/       # Custom hooks (Ej: useCitas).
  │   │   ├── services/    # Llamadas a la API del backend (fetch/axios).
  │   │   └── types/       # Tipos locales de UI.
  ├── shared/           # Código compartido en toda la aplicación.
  │   ├── ui/           # Componentes base (Botones, Modales, Tablas, DatePickers).
  │   ├── lib/          # Utilidades (formateo de fechas, jwt).
  │   └── api/          # Configuración base del cliente HTTP (Axios instance, interceptores).
  ```
- **Beneficio:** El código es altamente predecible. Si hay un bug en "clientes", el desarrollador sabe que todo lo relacionado (UI, lógica, peticiones) está dentro de `features/clientes`.

### Paso 4: Migración Incremental de Entidades
Para asegurar que el sistema no se rompa, la migración se hará entidad por entidad:
1. Extraer Prisma a `packages/db`.
2. Migrar `Citas` al nuevo Backend (Dominio, Caso de Uso, Controlador, Ruta) y conectarlo al nuevo Frontend en `features/citas`.
3. Repetir el proceso para `Clientes`, `Inventario`, `Usuarios`, etc.
4. Eliminar progresivamente la carpeta `src/app/api` del proyecto original.

## 4. Decisiones y Supuestos
- **Next.js para el Frontend:** Se mantiene Next.js porque ya está implementado y es excelente para React, pero se le quita la responsabilidad de ser una API (eliminando los Route Handlers).
- **Node.js (Express) para el Backend:** Se utilizará un framework ligero configurado manualmente con Arquitectura Hexagonal para que sirva como una verdadera referencia de diseño limpio. (Alternativamente, se puede usar NestJS que ya viene con una estructura modular inspirada en Clean Architecture).
- **Workspaces:** Usar un monorepo facilita el manejo de dependencias y permite compartir el esquema de Prisma y los tipos de TypeScript entre el frontend y el backend sin necesidad de publicar paquetes npm privados.

## 5. Pasos de Verificación
1. **Verificación Estructural:** Comprobar que el comando de compilación del monorepo levanta ambos servicios (Frontend en el puerto 3000, Backend en el puerto 4000).
2. **Verificación de Independencia (Regla de Dependencias):** Asegurar mediante linters que la carpeta `domain` del backend no importe nada de `infrastructure`.
3. **Verificación Funcional:** Realizar flujos completos (ej. agendar una cita) desde la nueva UI, pasando por el nuevo backend, interactuando con la BD, y validando la respuesta.
