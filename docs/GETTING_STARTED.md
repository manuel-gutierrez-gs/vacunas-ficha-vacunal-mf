# Guía de inicio — Microfrontend Ficha Vacunal

Onboarding de **desarrollo local**. Sin mecánica de integración shell ni detalle de CI/CD.

| Necesidad                 | Documento                                        |
| ------------------------- | ------------------------------------------------ |
| Desarrollo local          | Este archivo                                     |
| Estructura modular y MVVM | [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md) |
| Razonamiento de diseño    | [ARCHITECTURE.md](./ARCHITECTURE.md)             |

---

## Requisitos

| Herramienta | Versión |
| ----------- | ------- |
| Node.js     | >= 18   |
| npm         | >= 9    |

---

## Instalación y ejecución local

```bash
npm ci
npm run dev
```

URL local: el servidor de Vite expondrá en el puerto configurado (http://localhost:4200).
Revisar la salida de consola al ejecutar `npm run dev`.

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

| Ruta                        | Uso                                                     |
| --------------------------- | ------------------------------------------------------- |
| `src/index.ts`              | Arranque de aplicación y exportación de API             |
| `src/app/`                  | Composición principal y bootstrap                       |
| `src/module/ficha-vacunal/` | Dominio principal (componentes, adaptadores, servicios) |
| `src/shared/`               | Reutilización transversal e infra                       |
| `src/routing/`              | Router del Custom Element principal                     |
| `test/`                     | Tests en raíz, en espejo a `src/`                       |
| `dist/`                     | Salida de build                                         |

Normativa detallada: [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md).

---

## Entendiendo el punto de entrada

El MFE arranca creando el Web Component en `src/routing/vacunas-ficha-vacunal-router.view.ts`.
A partir de ahí, se renderiza la capa de composición base y el `src/app/vacunas-ficha-vacunal-home.view.ts`, que invoca la lógica de carga (`bootstrap`) y maneja el estado general del MFE.

Los componentes específicos viven en `src/module/ficha-vacunal/components/`.

---

## Dónde poner tests

Tests en raíz `test/`, con espejo funcional:

```text
test/module/ficha-vacunal/components/tarjetero/tarjetero.test.ts
```

El runner ejecuta `test/**/*.test.ts`.

---

## Flujo diario recomendado

1. `npm run dev`
2. Cambios en `src/module/ficha-vacunal/` o `src/app/`
3. `npm test`
4. Antes de MR: `npm run ci`

Checklist corto:

- [ ] Estructura de archivos alineada con FRONTEND_STRUCTURE
- [ ] Par `.view.ts` / `.viewmodel.ts` en componentes nuevos
- [ ] Adaptadores y mapeos separados de las Vistas
- [ ] Tests actualizados en `test/`
- [ ] Build y tests en verde

---

## Errores frecuentes de estructura

| Error                             | Acción                                         |
| --------------------------------- | ---------------------------------------------- |
| Lógica de negocio en `*.view.ts`  | Mover a `*.viewmodel.ts` o `service/`          |
| Tests dentro de `src/`            | Mover a `test/`                                |
| Custom events sin contrato        | Respetar los eventos en `@shared/contract`     |
| HTTP fetch directo en componentes | Usar un `adapter/` y pasarlo por un `service/` |

---

## Siguiente lectura

- Estándar de organización frontend: [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md)
- Diseño y trade-offs: [ARCHITECTURE.md](./ARCHITECTURE.md)
