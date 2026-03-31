# Design: Frontend CS4B Web - Landing Page Components

## Technical Approach

Refactorizar la página principalmonolítica (`src/app/page.tsx`) en componentes separados reutilizables, utilizando Framer Motion para animaciones fluidas. El enfoque es migrar de un archivo de 300 líneas con toda la lógica embebida a una arquitectura de componentes distribuidos con animaciones sofisticadas.

## Architecture Decisions

### Decision: Estructura de Componentes

**Choice**: Componentes en `src/components/` con archivos individuales
**Alternatives considered**: 
- Components dentro de la página (acoplado)
- Subcarpetas por sección (sobre-ingeniería para 6 componentes)
**Rationale**: Separação clara de responsabilidades, fácil mantenimiento, cada componente es independiente y testeable

### Decision: Sistema de Animaciones

**Choice**: Framer Motion con variantes predefinidas (`fadeInUp`, `staggerChildren`)
**Alternatives considered**: 
- CSS animations puro (menos flexible para interacciones)
- React Spring (más complejo, menos documentación)
- Biblioteca nativa de Next.js (insuficiente para casos de uso)
**Rationale**: API declarativa, soporte nativo para variants, excelente integración con React 19, animate exit/enter controlado

### Decision: Configuración de Colores

**Choice**: Extender Tailwind config existente con colores del brand
**Alternatives considered**: 
- Hardcoded colors en componentes (no mantenible)
- CSS variables globales (duplicación con tailwind.config)
**Rationale**: Mantiene consistencia con el sistema de diseño existente, autocompletado en IDE, theme coherente

### Decision: Navbar Scroll Behavior

**Choice**: Transparente en top → bg-white + shadow al hacer scroll > 50px
**Alternatives considered**: 
- bg-primary actual (ya existe pero no cumple requisito)
- Backdrop blur con bg-white/80 (más moderno pero diferente al request)
**Rationale**: Cumple exactamente con los requisitos del usuario - cambio visual claro y distintivo

## Data Flow

```
src/app/page.tsx (Server Component)
    │
    ├── <Navbar /> (Client - scroll state)
    ├── <Hero /> (Client - animations)
    ├── <Stats /> (Client - animations)
    ├── <Services /> (Client - animations)
    ├── <News /> (Client - animations)
    ├── <CTA /> (Client - animations)
    └── <Footer /> (Server - sin estado)
```

**Nota**: Todos los componentes de sección serán Client Components para soportar animaciones Framer Motion. El layout principal permanece como Server Component.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/Navbar.tsx` | Modify | Cambiar bg-primary a transparente + transición a bg-white con shadow |
| `src/components/Hero.tsx` | Create | Fullscreen con bg-gradient, texto animado, CTA button |
| `src/components/Services.tsx` | Create | Grid 6 cards con iconos, título, descripción |
| `src/components/Stats.tsx` | Create | 4 columnas con números grandes y etiquetas |
| `src/components/News.tsx` | Create | Grid 3 cards de noticias del blog |
| `src/components/CTA.tsx` | Create | Sección final con mensaje y botón |
| `src/components/Footer.tsx` | Keep | Ya existe, mejorar si es necesario (verificar alignment) |
| `src/app/page.tsx` | Modify | Importar y renderizar todos los componentes en secuencia |
| `package.json` | Modify | Agregar `framer-motion` dependencia |
| `src/lib/utils.ts` | Create | Utilidad `cn()` para merges de classes |

## Interfaces / Contracts

### Animations Utils (src/lib/animations.ts)
```typescript
import { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};
```

### Component Props Base
```typescript
interface SectionProps {
  className?: string;
}
```

### Navbar State
```typescript
// Scroll threshold: 50px
// Estados: transparent (top) → white + shadow (scrolled)
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Funciones utilitarias (cn, animations) | Vitest + React Testing Library |
| Component | Renderizado de cada componente | Snapshot tests |
| Integration | Flujo de scroll del Navbar | Playwright (e2e) |
| Visual | Animaciones, responsive design | Chromatic o manual |

**Nota**: Testing es opcional para esta fase MVP - el foco es implementación funcional.

## Migration / Rollout

1. **Fase 1**: Instalar Framer Motion (`npm install framer-motion`)
2. **Fase 2**: Crear `src/lib/utils.ts` y `src/lib/animations.ts`
3. **Fase 3**: Crear cada componente en orden (Hero → Stats → Services → News → CTA)
4. **Fase 4**: Modificar Navbar existente para nuevo comportamiento
5. **Fase 5**: Refactorizar `page.tsx` para usar componentes
6. **Fase 6**: Verificar que todo renderice correctamente

**No migration required** - es un refactor visual sin cambios en datos o funcionalidad de negocio.

## Open Questions

- [ ] ¿Los iconos de Services deben ser de una librería específica? (lucide-react, heroicons, custom SVGs)
- [ ] ¿Las imágenes de News deben ser dinámicass o hardcoded como actualmente?
- [ ] ¿El Navbar debe mantener el logo "CS4B" en color blanco o cambiar a primary cuando es white bg?
- [ ] ¿Hay contenido de blog real o usar datos mock como actualmente?
