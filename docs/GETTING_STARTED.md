# Guía de inicio — Arquetipo Front

Onboarding de **desarrollo local**. Sin mecánica de integración shell ni detalle de CI/CD.

| Necesidad | Documento |
|-----------|-----------|
| Desarrollo local | Este archivo |
| Estructura modular y MVVM | [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md) |
| Razonamiento de diseño | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Reglas runtime shell ↔ MFE | [SHELL-CONTRACT.md](../SHELL-CONTRACT.md) |

---

## Requisitos

| Herramienta | Versión |
|-------------|---------|
| Node.js | >= 18 |
| npm | >= 9 |

```bash
npm run env:check
```

---

## Instalación y ejecución local

```bash
npm ci
npm run dev
```

URL local: **http://localhost:4200**.

Build local:

```bash
npm run build
npm run preview
```

Tests:

```bash
npm test
npm run test:watch
npm run test:coverage
npm run ci
```

---

## Estructura rápida del proyecto

| Ruta | Uso |
|------|-----|
| `src/index.ts` | Arranque de aplicación |
| `src/module/` | Dominios y componentes |
| `src/shared/` | Reutilización transversal |
| `src/routing/` | Navegación transversal del arquetipo |
| `test/` | Tests en raíz |
| `dist/` | Salida de build |

Normativa detallada: [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md).

---

## Crear un módulo nuevo

Ejemplo: módulo `billing`.

```text
src/module/billing/
  component/
  pages/
  service/
```

Si necesita navegación, registrar ruta donde aplique en el arquetipo actual (`src/routing/routes.ts`).

Ejemplo real:

```13:18:src/routing/routes.ts
{
  path: '/counter',
  component: 'counter-component',
  name: 'Counter',
  action: async () => {
    await import('../module/counter/counter.view');
  },
},
```

---

## Crear un componente nuevo

Ejemplo: `invoice-list` dentro de `billing`.

```text
src/module/billing/component/invoice-list/
  invoice-list.view.ts
  invoice-list.viewmodel.ts
  css/
    invoice-list-theme.css.ts
  events/
    invoice-list-selection.event.ts
  model/
    invoice-item.dto.ts
```

Ubicación rápida:

- `*.view.ts` → render/UI
- `*.viewmodel.ts` → estado y orquestación
- `css/` → estilos del componente
- `events/` → contratos `CustomEvent`
- `model/` → tipos locales

Reglas completas: [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md).

---

## Dónde poner tests

Tests en raíz `test/`, con espejo funcional de módulos:

```text
test/module/billing/invoice-list/invoice-list.test.ts
```

El runner ejecuta `test/**/*.test.ts`.

---

## Flujo diario recomendado

1. `npm run dev`
2. Cambios en `src/module/` o `src/shared/`
3. `npm test`
4. Antes de MR: `npm run build` o `npm run ci`

Checklist corto:

- [ ] Estructura de archivos alineada con FRONTEND_STRUCTURE
- [ ] Par `.view.ts` / `.viewmodel.ts` en componentes nuevos
- [ ] Tests en `test/`
- [ ] Build y tests en verde

---

## Errores frecuentes de estructura

| Error | Acción |
|-------|--------|
| Lógica de negocio en `*.view.ts` | Mover a `*.viewmodel.ts` o `service/` |
| Tests dentro de `src/` | Mover a `test/` |
| Componentes fuera de `src/module/` | Reubicar por dominio |
| `shared/` como cajón de sastre | Revisar política `shared/` en FRONTEND_STRUCTURE |
| Uso de `any` sin justificar | Tipar explícitamente |

---

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm ci` | Instalar dependencias |
| `npm run dev` | Desarrollo local |
| `npm run build` | Build local |
| `npm run preview` | Preview de build |
| `npm test` | Tests |
| `npm run ci` | Gate local completo |

---

## Siguiente lectura

- Estándar de organización frontend: [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md)
- Diseño y trade-offs: [ARCHITECTURE.md](./ARCHITECTURE.md)
