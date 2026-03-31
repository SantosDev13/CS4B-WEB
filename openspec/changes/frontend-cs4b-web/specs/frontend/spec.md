# Frontend Specification

## Purpose

Landing page completa para CS4B (consultoría en transformación digital) con diseño corporativo tecnológico en fondo claro, siguiendo referencia Indra Group.

## Requirements

### Requirement: Paleta de Colores - Fondo Claro

El sistema DEBE implementar los siguientes colores:
- **Primary**: `#0B1F33` (azul oscuro) - texto principal, footer, navbar scrolleado
- **Secondary**: `#3FA9F5` (azul brillante) - acentos, links hover
- **Accent**: `#B6E356` (verde lima) - CTAs, highlights
- **Background**: `#FFFFFF` (blanco) y `#F8F9FA` (gris claro) - fondo de secciones
- **Text Primary**: `#1A1A1A` (casi negro)
- **Text Secondary**: `#6B7280` (gris)

#### Scenario: Aplicación de fondo claro

- GIVEN página landing sin estilos
- WHEN se aplica la paleta de colores especificada
- THEN el fondo principal es blanco/gris claro, NO oscuro

### Requirement: Navbar - Transparente con Scroll

El navbar DEBE ser transparente al inicio y cambiar a sólido al hacer scroll.

#### Scenario: Navbar transparente al cargar

- GIVEN usuario carga la página
- WHEN scrollY = 0
- THEN navbar tiene `bg-transparent` con texto blanco

#### Scenario: Navbar cambia al hacer scroll

- GINAL usuario hace scroll 20px o más
- WHEN scrollY > 20
- THEN navbar cambia a `bg-white/95 backdrop-blur-md shadow-md` con texto primary

### Requirement: Hero Section - Full Screen

La sección hero DEBE ocupar toda la pantalla visible con contenido centrado.

#### Scenario: Hero full screen

- GIVEN usuario visualiza la página
- WHEN la sección hero carga
- THEN ocupa `min-h-screen` con texto "Transformación Digital para tu Empresa"
- AND subtítulo explicativo
- AND botón CTA "Contáctanos"

### Requirement: Servicios - Grid 3 Columnas

La sección de servicios DEBE mostrar 6 servicios en grid de 3 columnas (desktop).

#### Scenario: Grid de servicios

- GIVEN usuario visualiza sección servicios
- WHEN pantalla es desktop (>1024px)
- THEN se muestran 3 columnas con los servicios:
  1. Licencias Microsoft
  2. Antivirus y Seguridad
  3. Hardware y Equipos
  4. Desarrollo de Software
  5. Consultoría IT
  6. Capacitación
- AND cada card tiene imagen, título, descripción
- AND hover effect con escala y shadow

### Requirement: Métricas - 4 Estadísticas

La sección de métricas DEBE mostrar 4 indicadores clave.

#### Scenario: Métricas visibles

- GIVEN usuario visualiza sección métricas
- WHEN la sección carga
- THEN muestra:
  - "10+ Años de experiencia"
  - "500+ Clientes"
  - "1000+ Proyectos"
  - "20+ Profesionales"

### Requirement: Noticias - Latest Posts

La sección de noticias DEBE mostrar 3 artículos del blog.

#### Scenario: Grid de noticias

- GIVEN usuario visualiza sección noticias
- WHEN pantalla es desktop (>1024px)
- THEN muestra 3 columnas con:
  - Imagen del artículo
  - Título
  - Fecha
  - Extracto breve
- AND hover effect en cards

### Requirement: CTA Section

La sección final DEBE tener un llamado a la acción prominente.

#### Scenario: CTA final

- GIVEN usuario hace scroll hasta el final
- WHEN la sección CTA es visible
- THEN muestra texto "Ready to transform?" o variante en español
- AND botón CTA que lleva a /contacto

### Requirement: Footer - Logo, Enlaces, Redes

El footer DEBE contener información de la empresa y enlaces.

#### Scenario: Footer completo

- GIVEN usuario visualiza el footer
- WHEN la página carga
- THEN muestra:
  - Logo CS4B
  - Enlaces rápidos (Inicio, Servicios, Blog, Contacto)
  - Servicios (los 6 servicios)
  - Redes sociales (LinkedIn, Facebook)
  - Copyright

### Requirement: Animaciones Framer Motion

El sistema DEBE incluir animaciones suaves con Framer Motion en todas las secciones.

#### Scenario: Animaciones al scroll

- GIVEN usuario hace scroll por la página
- WHEN cada sección entra en viewport
- THEN aparecen con animación de fade-in y slide-up
- AND duración de 0.5-0.8 segundos
- AND easing suave

### Requirement: Diseño Responsive

El sistema DEBE funcionar en mobile, tablet y desktop.

#### Scenario: Mobile (< 768px)

- GIVEN usuario visualiza en móvil
- WHEN breakpoint < 768px
- THEN todas las secciones muestran 1 columna
- AND navbar muestra hamburger menu

#### Scenario: Tablet (768px - 1024px)

- GIVEN usuario visualiza en tablet
- WHEN breakpoint 768px-1024px
- THEN grid de servicios y noticias muestra 2 columnas

#### Scenario: Desktop (> 1024px)

- GIVEN usuario visualiza en desktop
- WHEN breakpoint > 1024px
- THEN grid de servicios y noticias muestra 3 columnas

### Requirement: Tipografía

El sistema DEBE usar la fuente Inter o similar.

#### Scenario: Tipografía aplicada

- GIVEN página carga
- WHEN estilos se aplican
- THEN font-family es "Inter", system-ui, sans-serif
- AND tamaños: h1 (4-7xl), h2 (3-5xl), body (base)

### Requisito: Instalación de Framer Motion

El sistema DEBE incluir Framer Motion como dependencia.

#### Scenario: Framer Motion instalado

- GIVEN proyecto tiene package.json
- WHEN se ejecuta `npm install framer-motion`
- THEN framer-motion aparece en dependencies
- AND se puede importar en componentes client
