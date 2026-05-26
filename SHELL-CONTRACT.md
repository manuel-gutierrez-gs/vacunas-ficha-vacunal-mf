# Contrato técnico Shell ↔ Microfrontend

Fuente de verdad normativa. Sin ejemplos ni explicaciones en este archivo.

**Índice:** E1–E7 · D1–D7 · C1–C5 · L1–L7 · S1–S5 · B1–B4 · V1–V4 · I1–I4 · R1–R8

---

## Entry

| ID | Regla |
|----|--------|
| E1 | Artefacto de entrada: **`dist/mfe-entry.js`**. |
| E2 | Nombre del entry **estable** entre builds. |
| E3 | Export npm: `"exports": { ".": "./dist/mfe-entry.js" }`. |
| E4 | Arranque fuente: **`src/index.ts`**; **prohibido** editar el entry generado a mano. |
| E5 | El shell **debe** cargar `mfe-entry.js` como **módulo ES** (`type="module"` o `import()`). |
| E6 | El shell define el **montaje en DOM**; el MFE **no** define el mecanismo del host. |
| E7 | El entry **debe** evaluarse **antes** que chunks que reimportan desde `mfe-entry.js`. |

---

## Paquete `dist/`

| ID | Regla |
|----|--------|
| D1 | Entrega: **contenido completo de `dist/`** tras `npm run build`. |
| D2 | El publicador **debe** servir **`dist/` íntegro** sin alterar estructura. |
| D3 | **Prohibido** publicar solo `mfe-entry.js`. |
| D4 | Mínimo en runtime: `mfe-entry.js` + `assets/` (JS y CSS). |
| D5 | `dist/index.html` es opcional (standalone); **no** sustituye integración shell. |
| D6 | Imports dinámicos: rutas **relativas** a la URL del entry; raíz de publicación coherente. |
| D7 | **Prohibido** renombrar/reubicar `assets/` sin nuevo build y acuerdo con plataforma. |

---

## Chunks

| ID | Regla |
|----|--------|
| C1 | Particionado en **`dist/assets/*.js`**. |
| C2 | Nombres de chunk **no contractuales** (pueden cambiar por build). |
| C3 | Solo **`mfe-entry.js`** tiene nombre estable. |
| C4 | **Prohibido** ejecutar un chunk aislado sin entry previo. |
| C5 | **`@sas/*`** del MFE van en `dist/` salvo acuerdo explícito en este contrato. |

---

## Lit compartido

| ID | Regla |
|----|--------|
| L1 | El shell **debe** proveer **`lit@2.7.4`** en producción. |
| L2 | El MFE **debe** externalizar `lit` y `lit/*` en build de producción. |
| L3 | **Prohibido** empaquetar `lit` en entry o chunks de producción. |
| L4 | **Prohibido** que el MFE resuelva `lit` por sí solo en producción. |
| L5 | El shell **debe** resolver `lit` antes o con el mismo grafo que el entry. |
| L6 | **Prohibido** duplicar Lit en el bundle del MFE. |
| L7 | Versión objetivo: **2.7.4**. |

---

## CSS

| ID | Regla |
|----|--------|
| S1 | Estilos de componentes: en módulos JS (Lit). |
| S2 | Estilos globales: emitidos a **`dist/assets/*.css`** (nombre puede llevar hash). |
| S3 | Con **`dist/index.html`**: el HTML del build puede enlazar el CSS. |
| S4 | Solo script del MFE: el shell **debe** cargar el CSS global de `assets/` explícitamente. |
| S5 | Sin CSS ni `index.html` del MFE: **no** hay garantía de estilos globales. |

---

## Base path

| ID | Regla |
|----|--------|
| B1 | Por defecto: publicación en **raíz** del origen (`/mfe-entry.js`, `/assets/...`). |
| B2 | Subruta: alineación explícita shell + MFE (`base` build, proxy, CDN). |
| B3 | Sin alineación: **no** se garantiza resolución de assets. |
| B4 | Rutas del router interno del MFE ≠ base path del paquete estático. |

---

## Versionado y caché

| ID | Regla |
|----|--------|
| V1 | Cada release: **paquete `dist/` versionado** (carpeta, prefijo o ID). |
| V2 | **Prohibido** mezclar assets de builds distintos en el mismo origen. |
| V3 | Invalidación de caché acoplada al versionado del paquete. |
| V4 | `Cache-Control: immutable` solo si el nombre del fichero es único por build. |

---

## Invariantes de runtime

| ID | Invariante |
|----|------------|
| I1 | Una sola instancia de Lit **2.7.4** en la página. |
| I2 | Orden de carga: Lit → entry → chunks. |
| I3 | Misma raíz de URL para entry y `assets/`. |
| I4 | Un `dist/` completo por versión desplegada. |

---

## Responsabilidades

| ID | Tema | Shell | MFE |
|----|------|-------|-----|
| R1 | Entry y montaje DOM | Carga y monta | Expone entry y CE |
| R2 | Publicación | Sirve `dist/` completo | Genera `dist/` |
| R3 | Lit | Provee 2.7.4 | Externaliza |
| R4 | CSS global (sin HTML MFE) | Carga explícita | Emite en `assets/` |
| R5 | Base path | Configura / acuerda | Ajusta build si aplica |
| R6 | `@sas/*` | Consume | Empaqueta en `dist/` |
| R7 | Verificación shell pre-release | Ejecuta checklist shell | — |
| R8 | Verificación MFE pre-release | — | `npm run ci` en verde; artefacto cumple L2–L3 |

---

## Verificación pre-release — Shell

- [ ] I1, L1, L6
- [ ] E5, E7, I2
- [ ] D1–D7, I4
- [ ] S3 o S4 (según modo)
- [ ] B1–B3
- [ ] V1–V3
- [ ] HTTP 200: entry + recurso bajo `assets/`

---

## Verificación pre-release — MFE

- [ ] R8
- [ ] E1–E3 sin cambio no coordinado
- [ ] Contrato actualizado si aplica

---

## Gobierno del contrato

| ID | Regla |
|----|--------|
| G1 | Cambios en obligaciones runtime: actualizar este archivo **antes** del código. |
| G2 | Acuerdo shell + plataforma obligatorio tras cambio de contrato. |
