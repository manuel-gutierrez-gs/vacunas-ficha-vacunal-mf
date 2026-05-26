# Estructura modular frontend — estándar oficial

**Ámbito:** organización del código fuente **dentro** de este repositorio (frontend interno).  
**No forma parte** del contrato shell ↔ MFE ([SHELL-CONTRACT.md](../SHELL-CONTRACT.md)).

**Relación con otras capas:**

| Documento | Rol |
|-----------|-----|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Por qué existe esta estructura y trade-offs |
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Primeros pasos prácticos |
| [SHELL_INTEGRATION.md](./SHELL_INTEGRATION.md) | Carga del artefacto en el host |

---

## 1. Objetivos del estándar

- **Modularidad por dominio:** cada carpeta bajo `src/module/<nombre-modulo>/` representa un contexto acotado de producto.
- **MVVM obligatorio:** separación estricta entre presentación (`.view.ts`) y lógica/estado (`.viewmodel.ts`).
- **Escalabilidad en equipos grandes:** convenciones predecibles, revisiones homogéneas y ownership claro.
- **Testabilidad:** tests fuera de `src/`, espejo del árbol de módulos.
- **Reutilización controlada:** `src/shared/` solo para código compartido entre módulos, con límites explícitos.

---

## 2. Estructura oficial de carpetas

Árbol objetivo (convención normativa). Los nombres entre `<>` son sustituibles.

```
project-root/
  src/
    index.ts                    # Entry de aplicación (importa módulos, tema, routing)
    environment.ts              # Configuración de entorno (si aplica)
    module/
      <module-name>/
        component/
          <component-name>/
            <component-name>.view.ts
            <component-name>.viewmodel.ts
            css/
              <component-name>-theme.css.ts
            events/
              <component-name>-<event>.event.ts
            model/
              *.ts
        pages/                    # Opcional: vistas de página del módulo
        service/                  # Opcional: servicios del módulo
    routing/                      # Opcional: rutas transversales al shell del MFE
    shared/
      component/
      model/
      service/
      template/
  test/
    <module-name>/
      <component-name>/
        *.test.ts
```

**Reglas de raíz:**

| ID | Regla |
|----|--------|
| FS1 | Todo código de dominio de producto bajo **`src/module/`** (obligatorio para nuevas piezas). |
| FS2 | **`src/index.ts`** es el único punto de arranque de aplicación importado por el build hacia `mfe-entry.js` (coherente con **E4** del contrato). |
| FS3 | **`test/`** en raíz del repo; **prohibido** alojar tests de producto dentro de `src/`. |
| FS4 | **`src/shared/`** solo para reutilización **entre** módulos; no como comodín global. |

**Nota sobre el arquetipo actual:** puede coexistir `src/routing/` como capa transversal de navegación del MFE; las nuevas rutas y vistas de dominio deben vivir bajo el módulo que las posee, salvo decisión de arquitectura documentada en [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 3. Responsabilidades por capa

| Capa | Ubicación típica | Responsabilidad |
|------|------------------|-----------------|
| Entry | `src/index.ts` | Orquestar imports de módulos, tema global, registro de routing si aplica |
| Módulo | `src/module/<name>/` | Bounded context: componentes, páginas y servicios del dominio |
| Componente | `.../component/<name>/` | Unidad UI + lógica de presentación (MVVM) |
| Vista | `*.view.ts` | Solo render, plantillas Lit, estilos asociados al componente |
| ViewModel | `*.viewmodel.ts` | Estado, derivados, orquestación de eventos, llamadas a servicios |
| Tema CSS (Lit) | `css/*-theme.css.ts` | Tokens y estilos del componente (CSSResult) |
| Eventos | `events/*.event.ts` | Definición de **CustomEvent** y contratos de `detail` |
| Modelo | `model/*.ts` | DTOs, tipos locales al componente o al módulo |
| Páginas | `pages/` | Composición de alto nivel del módulo (opcional) |
| Servicios módulo | `service/` | Acceso a datos, APIs; **no** en la vista |
| Shared | `src/shared/` | Ver sección 7 |
| Tests | `test/<module>/<component>/` | Espejo funcional de `src/module/` |

---

## 4. Patrón MVVM obligatorio

| ID | Regla |
|----|--------|
| MV1 | Cada componente de producto tiene **`.view.ts`** y **`.viewmodel.ts`** emparejados (mismo prefijo de nombre). |
| MV2 | **`.view.ts`:** solo UI — `render()`, plantillas `html`, registro de estilos, delegación de eventos a métodos del viewmodel. |
| MV3 | **`.viewmodel.ts`:** estado reactivo (`@property`, `@state`), lógica de negocio de UI, llamadas a `service/`, transformación de datos para la vista. |
| MV4 | **Prohibido** en `.view.ts`: `fetch`, clientes HTTP directos, reglas de negocio complejas, acceso directo a APIs sin capa de servicio acordada. |
| MV5 | **Prohibido** en `.viewmodel.ts`: markup Lit extenso (salvo helpers mínimos); la vista debe concentrar el template. |

---

## 5. Convenciones de nombrado

| Elemento | Convención | Ejemplo |
|----------|-------------|---------|
| Módulo | kebab-case o nombre de dominio acordado | `billing`, `user-profile` |
| Carpeta componente | kebab-case alineada con tag o nombre lógico | `counter`, `invoice-list` |
| Vista | `<nombre>.view.ts` | `counter.view.ts` |
| ViewModel | `<nombre>.viewmodel.ts` | `counter.viewmodel.ts` |
| Tema | `css/<nombre>-theme.css.ts` | `counter-theme.css.ts` |
| Evento | `<componente>-<evento>.event.ts` | `counter-click.event.ts` |
| Custom element | Definir en `.view.ts` o módulo según convención del equipo; tag en kebab-case | `counter-component` |
| Tests | Mismo esqueleto bajo `test/` + sufijo `.test.ts` | `test/module/counter/counter.test.ts` |

---

## 6. Reglas de modularidad

| ID | Regla |
|----|--------|
| M1 | Un módulo **no** importa implementaciones internas de otro módulo salvo interfaces/tipos en `shared/` o API pública explícita del otro módulo (acordar en revisión). |
| M2 | Evitar dependencias circulares entre módulos; extraer a `shared/` si es transversal. |
| M3 | Nuevas features **preferentemente** como nuevo subárbol bajo `src/module/<nuevo>/` en lugar de acumular en un único módulo genérico. |
| M4 | `environment.ts` y configuración global: mínimo imprescindible; lógica de dominio en módulos. |

---

## 7. Política de `src/shared/`

| ID | Regla |
|----|--------|
| SH1 | Solo código usado por **dos o más** módulos o por entry + módulo sin acoplar dominios. |
| SH2 | **Prohibido** usar `shared/` como vertedero de utilidades sin dueño (`utils.ts` genéricos). |
| SH3 | Preferir `shared/component/`, `shared/model/`, `shared/service/`, `shared/template/` según naturaleza. |
| SH4 | Cada añadido en `shared/` debe justificarse en revisión (qué módulos consumen y por qué no vive en un solo módulo). |

---

## 8. Estrategia de tests

| ID | Regla |
|----|--------|
| T1 | Tests bajo **`test/`** en la raíz; patrón del arquetipo: **`test/**/*.test.ts`** (configuración Web Test Runner). |
| T2 | Estructura de carpetas **espejo** de `src/module/<module>/<component>/` cuando aplique. |
| T3 | Los tests importan módulos desde `src/`; no duplicar implementación en `test/`. |
| T4 | Cobertura y ejecución en CI vía `npm run test:ci` / `npm run ci` (ver [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)). |

---

## 9. Antipatrones prohibidos

| ID | Antipatrón |
|----|------------|
| AP1 | Lógica de negocio o HTTP en `.view.ts` |
| AP2 | Tests de producto dentro de `src/` |
| AP3 | Componentes de dominio fuera de `src/module/` sin excepción arquitectónica aprobada |
| AP4 | Uso de `any` sin justificación documentada en revisión |
| AP5 | Ficheros `utils.ts` / `helpers.ts` genéricos sin responsabilidad clara |
| AP6 | `fetch` o cliente HTTP directo en vista; usar capa de servicio / wrapper corporativo acordado |
| AP7 | CustomEvent definidos al vuelo en la vista sin fichero en `events/` cuando el evento es contrato del componente |

---

## 10. Ejemplos completos

### 10.1 Módulo `invoices` con componente `invoice-list`

```
src/module/invoices/
  component/
    invoice-list/
      invoice-list.view.ts
      invoice-list.viewmodel.ts
      css/
        invoice-list-theme.css.ts
      events/
        invoice-list-selection.event.ts
      model/
        invoice-row.dto.ts
  service/
    invoice-api.service.ts
```

```
test/module/invoices/
  invoice-list/
    invoice-list.test.ts
```

### 10.2 Fragmento de responsabilidad (ilustrativo)

**Vista:** importa viewmodel, declara template, delega clicks.  
**ViewModel:** propiedades, carga de datos vía `service/`, emite eventos tipados desde `events/`.

---

## 11. Checklist de revisión técnica

- [ ] Nuevo código de dominio bajo `src/module/<modulo>/` (**FS1**)
- [ ] Par `.view.ts` / `.viewmodel.ts` presente (**MV1**)
- [ ] Sin HTTP ni negocio pesado en la vista (**MV4**)
- [ ] CustomEvent en `events/` si define contrato reutilizable (**AP7**)
- [ ] Tests en `test/` con espejo de rutas (**T1–T2**)
- [ ] `shared/` solo si cumple **SH1–SH4**
- [ ] Sin antipatrones **AP1–AP7**

---

## 12. Evolución futura del estándar

- Ampliar `pages/` y `service/` con plantillas de referencia en el arquetipo.
- Documentar política de **lazy import** por módulo alineada con chunks del build.
- Formalizar convención para `src/routing/` vs rutas por módulo (requiere actualizar este documento y [ARCHITECTURE.md](./ARCHITECTURE.md)).

Cualquier cambio sustantivo en esta estructura debe reflejarse aquí **antes** de generalizarlo en el código del arquetipo.
