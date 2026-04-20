This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# 🚀 Proyecto - Setup Inicial

Este proyecto utiliza Node.js + Prisma ORM.

---

## 📦 Requisitos

* Node.js (v18 o superior recomendado)
* npm o yarn
* Base de datos (PostgreSQL/MySQL según el proyecto)

---

## ⚙️ Instalación

Clona el repositorio:

```bash
git clone <URL_DEL_REPO>
cd <NOMBRE_DEL_PROYECTO>
```

Instala dependencias:

```bash
npm install
```

---

## 🔐 Variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Configura al menos:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

---

## 🗄️ Base de datos (Prisma) -> yo hago reset la primera vez

### Opción 1: Setup normal

```bash
npx prisma migrate dev
```

### Opción 2: Reset completo (recomendado para pruebas y empezar con la base de datos en blanco)

```bash
npx prisma migrate reset
```

> ⚠️ Esto borra toda la base de datos

---

## ▶️ Ejecutar proyecto

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

---

## 🧪 Flujo rápido (copy-paste)

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

---

## 🛠️ Comandos útiles

```bash
# Generar cliente Prisma
npx prisma generate

# Ver base de datos en GUI
npx prisma studio

# Resetear base de datos
npx prisma migrate reset
```

---

## ⚠️ Problemas comunes

* ❌ DATABASE_URL incorrecta
* ❌ Base de datos no creada
* ❌ Migraciones no ejecutadas
* ❌ Puerto ocupado

---

## 📌 Notas

* Prisma genera automáticamente el cliente después de migraciones
* Usar `migrate reset` solo en desarrollo o la primera vez
* Verifica que el servidor de base de datos esté corriendo

---

## 👨‍💻 Contacto

Si tienes problemas, revisa este README o consulta al equipo.
