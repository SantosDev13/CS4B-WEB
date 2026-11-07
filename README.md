<div align="center">

# CS4B — Tecnología que impulsa tu negocio

**Consultoría tecnológica para organizaciones que quieren crecer con soluciones digitales.**

[Visitar sitio web](https://cs4b.com.pe) · [Explorar servicios](https://cs4b.com.pe/servicios) · [Contactar](https://cs4b.com.pe/contacto)

</div>

---

## Sobre el proyecto

CS4B es el sitio web corporativo de una empresa peruana de consultoría tecnológica. Presenta su catálogo de servicios y contenidos, facilita el contacto con potenciales clientes y ofrece herramientas de administración para mantener la información del sitio actualizada.

La plataforma está desarrollada con Next.js y TypeScript, e integra un catálogo de servicios, un blog, un formulario de contacto y un panel privado de administración.

## Qué ofrece

- **Catálogo de servicios:** consulta los servicios por categoría y accede a sus páginas de detalle.
- **Solicitudes de consultoría:** agrega servicios de interés al carrito y envía una consulta desde el formulario de contacto.
- **Blog corporativo:** publica artículos organizados por categorías y accede a páginas optimizadas con metadatos SEO.
- **Administración de contenidos:** gestiona servicios, categorías, publicaciones y solicitudes recibidas desde un panel protegido.
- **Experiencia web moderna:** interfaz adaptable, componentes reutilizables y animaciones para una navegación clara.

## Tecnologías

| Área | Tecnología |
| --- | --- |
| Framework web | Next.js 15 (App Router) |
| Lenguaje | TypeScript |
| Interfaz y estilos | React 19, Tailwind CSS y Framer Motion |
| Base de datos | PostgreSQL |
| Acceso a datos | Prisma ORM |
| Validación | Zod |
| Autenticación | JWT y bcryptjs |
| Pruebas | Vitest y React Testing Library |

## Puesta en marcha

### Requisitos

- Node.js y npm
- Una base de datos PostgreSQL accesible desde el entorno local

### Instalación

1. Clona el repositorio y entra al directorio del proyecto:

   ```bash
   git clone https://github.com/SantosDev13/CS4B-WEB.git
   cd CS4B-WEB
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea tu archivo local de variables de entorno:

   ```bash
   cp .env.example .env
   ```

4. Completa las variables de `.env` con tus credenciales y configuración:

   | Variable | Descripción |
   | --- | --- |
   | `DATABASE_URL` | URL de conexión a PostgreSQL para la aplicación. |
   | `DIRECT_URL` | Conexión directa usada por Prisma para las migraciones. |
   | `JWT_SECRET` | Secreto privado para firmar tokens de autenticación. Usa un valor seguro y único. |
   | `NEXT_PUBLIC_API_URL` | URL base de la aplicación; en desarrollo, `http://localhost:3000`. |
   | `NODE_ENV` | Entorno de ejecución, por ejemplo `development` o `production`. |

   Para generar un secreto JWT puedes usar `openssl rand -hex 32`. No compartas ni subas el archivo `.env` al repositorio.

5. Aplica las migraciones de la base de datos:

   ```bash
   npx prisma migrate dev
   ```

6. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Next.js en modo desarrollo. |
| `npm run build` | Genera Prisma Client y compila la aplicación para producción. |
| `npm run start` | Inicia la aplicación compilada. |
| `npm run lint` | Ejecuta el comando de lint configurado en el proyecto. |
| `npm run test` | Ejecuta Vitest en modo interactivo. |
| `npm run test:run` | Ejecuta las pruebas una vez. |
| `npm run test:coverage` | Ejecuta las pruebas con cobertura. |

## Estructura del proyecto

```text
src/
├── app/          # Páginas, rutas y API de Next.js
├── components/   # Componentes de interfaz, públicos y de administración
├── composables/  # Contextos y hooks de React
├── constants/    # Constantes y configuración compartida
├── lib/          # Utilidades, autenticación, validaciones y Prisma
└── services/     # Clientes y lógica de acceso a la API
prisma/           # Esquema y migraciones de base de datos
tests/            # Pruebas automatizadas
```

Para más detalles sobre modelos, rutas de API y decisiones de diseño, consulta [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Seguridad y configuración

- Mantén las credenciales de base de datos y `JWT_SECRET` en variables de entorno privadas.
- Usa valores distintos para desarrollo y producción.
- No publiques archivos `.env` ni secretos en el repositorio.

## Contribuciones

Las propuestas de mejora y reportes de errores son bienvenidos. Abre un *issue* con el contexto y los pasos para reproducir el problema, o envía un *pull request* describiendo los cambios.

## Licencia

No se especifica una licencia en este repositorio. Antes de reutilizar o distribuir el código, consulta con los responsables del proyecto.

---

<div align="center">

**CS4B — Soluciones tecnológicas para avanzar.**

[cs4b.com.pe](https://cs4b.com.pe)

</div>
