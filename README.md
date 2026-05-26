# Arquetipo Front

Arquetipo de **microfrontend** (MFE) con Vite, Lit y TypeScript, pensado para integrarse en un **shell** (aplicación host). Punto de entrada del repositorio y del sistema de documentación por capas.

---

## ¿Qué es este repositorio?

- **Propósito:** plantilla para crear un MFE del ecosistema SAS: pantallas, componentes y rutas de dominio en un paquete front desacoplado.
- **Relación con el shell:** en producción el host carga el artefacto de build y provee dependencias compartidas de runtime. Las obligaciones técnicas están en [SHELL-CONTRACT.md](SHELL-CONTRACT.md).
- **Stack:** Vite · TypeScript · Lit · Web Components · paquetes internos `@sas/*`.

| Ámbito | Dónde profundizar |
|--------|-------------------|
| Desarrollo en local | [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) |
| Estructura modular y MVVM | [docs/FRONTEND_STRUCTURE.md](docs/FRONTEND_STRUCTURE.md) |
| Diseño y decisiones | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Integración en el shell | [docs/SHELL_INTEGRATION.md](docs/SHELL_INTEGRATION.md) |
| CI/CD y publicación | [docs/DOCKER_DEPLOYMENT.md](docs/DOCKER_DEPLOYMENT.md) |

---

## Arquitectura modular frontend

Este repositorio sigue una **estructura modular por dominio** bajo `src/module/`, con patrón **MVVM** (vista / viewmodel) y tests en `test/` espejo del código de módulos. Objetivo: equipos grandes, ownership claro y revisiones predecibles.

**Normativa y detalle:** [docs/FRONTEND_STRUCTURE.md](docs/FRONTEND_STRUCTURE.md)  
**Razonamiento arquitectónico:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

Árbol resumido:

```
src/
  index.ts
  module/<modulo>/
    component/<componente>/
      *.view.ts | *.viewmodel.ts | css/ | events/ | model/
  shared/ …
  routing/ …   # transversal según arquetipo
test/
  <modulo>/<componente>/*.test.ts
```

---

## Inicio rápido

### Requisitos

| Herramienta | Versión |
|-------------|---------|
| Node.js | >= 18 |
| npm | >= 9 |

```bash
npm run env:check
```

### Instalación

```bash
npm ci
```

Usar `npm ci` (no `npm install`) cuando exista `package-lock.json`.

### Desarrollo local

```bash
npm run dev
```

Servidor Vite en **http://localhost:4200** (equivalente: `npm start`). Editar código en `src/`, no en `dist/`.

### Build

```bash
npm run build
```

Ejecuta comprobación de tipos y genera la salida en `dist/`. Previsualización local:

```bash
npm run preview
```

### Tests

```bash
npm test
npm run ci
```

`npm run ci` ejecuta `typecheck`, tests con cobertura y `build` (alineado con pipeline). Más comandos en la tabla [Scripts útiles](#scripts-útiles).

Detalle del flujo diario: [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md).

---

## Sistema de documentación

Documentación organizada en **capas** con una sola fuente normativa y documentos especializados sin solapamiento de reglas.

| Necesidad | Documento | Capa |
|-----------|-----------|------|
| Reglas obligatorias shell ↔ MFE | [SHELL-CONTRACT.md](SHELL-CONTRACT.md) | Contrato |
| Estructura modular frontend (MVVM, carpetas) | [docs/FRONTEND_STRUCTURE.md](docs/FRONTEND_STRUCTURE.md) | Normativa interna front |
| Arquitectura y decisiones | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura |
| Integración con el shell | [docs/SHELL_INTEGRATION.md](docs/SHELL_INTEGRATION.md) | Integración |
| CI/CD y despliegue | [docs/DOCKER_DEPLOYMENT.md](docs/DOCKER_DEPLOYMENT.md) | Despliegue |
| Onboarding y flujo diario | [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) | Onboarding |

**Regla:** si afecta al comportamiento en runtime entre shell y MFE, debe estar en el contrato. Ver [SHELL-CONTRACT.md](SHELL-CONTRACT.md).

---

## Flujo recomendado de lectura

| Rol | Orden sugerido |
|-----|----------------|
| **Desarrollador nuevo** | Este README → [GETTING_STARTED](docs/GETTING_STARTED.md) → [FRONTEND_STRUCTURE](docs/FRONTEND_STRUCTURE.md) |
| **Senior / arquitecto** | [ARCHITECTURE](docs/ARCHITECTURE.md) → [FRONTEND_STRUCTURE](docs/FRONTEND_STRUCTURE.md) → [SHELL-CONTRACT](SHELL-CONTRACT.md) |
| **Plataforma / shell** | [SHELL-CONTRACT](SHELL-CONTRACT.md) → [SHELL_INTEGRATION](docs/SHELL_INTEGRATION.md) |
| **DevOps / CI** | [DOCKER_DEPLOYMENT](docs/DOCKER_DEPLOYMENT.md) → [SHELL-CONTRACT](SHELL-CONTRACT.md) (artefacto **D**, **V**) |

---

## Scripts útiles

| Script | Descripción |
|--------|-------------|
| `npm run env:check` | Muestra versiones de Node y npm |
| `npm ci` | Instalación reproducible de dependencias |
| `npm run dev` / `npm start` | Servidor de desarrollo (Vite) |
| `npm run start:wds` | Servidor alternativo (Web Dev Server) |
| `npm run build` | Typecheck + build de producción |
| `npm run build:dev` | Build en modo development |
| `npm run preview` | Sirve `dist/` en local (puerto 4200) |
| `npm run typecheck` | Solo comprobación TypeScript |
| `npm test` | Tests (Web Test Runner) |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con cobertura |
| `npm run test:ci` | Tests con cobertura (CI) |
| `npm run ci` | Typecheck + tests + build |
| `npm run clean` | Borra `dist/`, `coverage/`, `out-tsc/` |
| `npm run format` | Formatea con Prettier |
| `npm run format:check` | Comprueba formato sin escribir |

---

## Principios del repositorio

- **Contrato único** — [SHELL-CONTRACT.md](SHELL-CONTRACT.md) concentra reglas verificables shell ↔ MFE.
- **Artefacto `dist/`** — generado por build; no editar manualmente; publicar el paquete completo según contrato (**D**).
- **Shell como host** — el MFE no sustituye al shell en producción; integración documentada por capas.
- **Documentación por capas** — contrato shell, normativa front (`FRONTEND_STRUCTURE`), arquitectura, integración, despliegue y onboarding.
- **Estructura modular** — dominio bajo `src/module/`; detalle en [docs/FRONTEND_STRUCTURE.md](docs/FRONTEND_STRUCTURE.md).

---

## Contribución

1. Crear rama desde la política del equipo.
2. Desarrollar en `src/`; validar con `npm test` y `npm run build` o `npm run ci`.
3. No modificar `dist/` a mano.
4. Si el cambio afecta la estructura modular o convenciones de código: actualizar [docs/FRONTEND_STRUCTURE.md](docs/FRONTEND_STRUCTURE.md) y [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) si aplica.
5. Si el cambio afecta integración, artefacto o runtime compartido con el shell: actualizar [SHELL-CONTRACT.md](SHELL-CONTRACT.md) **antes** del merge y coordinar con plataforma.

Checklist de desarrollo: [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md).

---

## Referencias

- [SHELL-CONTRACT.md](SHELL-CONTRACT.md) — reglas obligatorias
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — arquitectura y trade-offs
- [docs/SHELL_INTEGRATION.md](docs/SHELL_INTEGRATION.md) — integración con ejemplos
- [docs/DOCKER_DEPLOYMENT.md](docs/DOCKER_DEPLOYMENT.md) — pipeline y Nginx
- [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) — guía para empezar a desarrollar
- [docs/FRONTEND_STRUCTURE.md](docs/FRONTEND_STRUCTURE.md) — estructura modular y MVVM
