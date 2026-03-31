# Proposal: Frontend CS4B Web

## Intent

Desarrollar el frontend completo del proyecto cs4b-web (sitio corporativo de consultoría en transformación digital) siguiendo el estilo de referencia https://www.indragroup.com/es con fondo claro, diseño corporativo tecnológico, y animaciones profesionales.

## Scope

### In Scope
- Landing page completa con 7 secciones (Navbar, Hero, Servicios, Métricas, Noticias, CTA, Footer)
- Diseño completamente responsive (mobile-first)
- Animaciones suaves con Framer Motion
- Código modular por componentes
- Clean code y buenas prácticas

### Out of Scope
- Panel de admin (pendiente para otro cambio)
- Backend/database (ya existente)

## Approach

Estilo visual basado en Indra Group:
- **Fondo claro** (blanco/gris claro)
- Tipografía grande e impactante
- Minimalismo corporativo tecnológico
- Cards modernas con hover effects
- Espaciado amplio y estética premium

Arquitectura de componentes:
- Patrón presentational/containers
- Server Components donde sea posible
- Client Components solo para interactividad (Framer Motion)

Stack confirmado:
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/` | Nuevo | Hero, Navbar, Services, Stats, News, CTA, Footer |
| `src/app/page.tsx` | Modificado | Landing page principal |
| `tailwind.config.ts` | Modificado | Colores y theme claro |
| `src/app/globals.css` | Modificado | Estilos y animaciones |

## Design Reference

**Página de referencia**: https://www.indragroup.com/es

Características a adoptar:
1. Fondo CLARO (no oscuro)
2. Estilo corporativo tecnológico limpio
3. Hero full screen con texto grande + imagen
4. Grid de servicios/negocios con cards
5. Sección de métricas/estadísticas
6. Sección de noticias/actualidad
7. Footer elegante con enlaces y redes sociales
8. Navbar transparente que cambia con scroll

## Requirements

### Requisitos Técnicos
- Código modular por componentes (Hero, Navbar, Services, Stats, News, Footer)
- Diseño completamente responsive
- Buenas prácticas de clean code

### Diseño y UX
- Estilo corporativo tecnológico (fondo claro, tipografía grande, minimalismo)
- Hero section full screen con texto impactante y botón CTA
- Secciones en scroll tipo storytelling
- Animaciones suaves al hacer scroll (Framer Motion)
- Cards modernas con hover effects
- Espaciado amplio y estética premium

### Secciones Requeridas
1. Navbar transparente que cambia al hacer scroll
2. Hero principal con mensaje potente
3. Sección de servicios (grid de tarjetas)
4. Sección de métricas/estadísticas
5. Sección de noticias o insights
6. Call to action
7. Footer elegante

### Extras (Nivel Profesional)
- Animaciones con Framer Motion
- Lazy loading de imágenes
- Transiciones suaves entre secciones
- Efectos hover modernos
- Código listo para producción

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|-------------|
| React 19 breaking changes | Low | Patrones compatibles con v18 |
| Performance animations | Low | Framer Motion optimizado |

## Rollback Plan

Revertir cambios en `src/components/` y `src/app/page.tsx` manteniendo el backend existente.

## Dependencies

- Next.js 15 configurado (existente)
- Tailwind CSS configurado (existente)
- Framer Motion por instalar
- APIs del backend disponibles

## Success Criteria

- [ ] Landing page completa con las 7 secciones
- [ ] Diseño responsive funcionando
- [ ] Animaciones Framer Motion suaves
- [ ] Estilo claro corporativo (referencia Indra Group)
- [ ] Código limpio y modular
- [ ] Build exitoso sin errores
