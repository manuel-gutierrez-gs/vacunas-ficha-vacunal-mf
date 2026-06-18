# Estructura modular frontend — estándar oficial

**Ámbito:** organización del código fuente **dentro** de este repositorio (frontend interno).

**Relación con otras capas:**

| Documento                                      | Rol                                         |
| ---------------------------------------------- | ------------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)           | Por qué existe esta estructura y trade-offs |
| [GETTING_STARTED.md](./GETTING_STARTED.md)     | Primeros pasos prácticos                    |
| [SHELL_INTEGRATION.md](./SHELL_INTEGRATION.md) | Carga del artefacto en el host              |

---

## 1. Objetivos del estándar

- **Modularidad por dominio:** la carpeta bajo `src/module/ficha-vacunal/` representa un contexto acotado de producto.
- **MVVM obligatorio:** separación estricta entre presentación (`.view.ts`) y lógica/estado (`.viewmodel.ts`).
- **Escalabilidad en equipos grandes:** convenciones predecibles, revisiones homogéneas y ownership claro.
- **Testabilidad:** tests fuera de `src/`, en `test/`, siendo un espejo del árbol funcional.
- **Reutilización controlada:** `src/shared/` solo para código compartido entre módulos, infra, o config, con límites explícitos.
- **Capa App independiente:** `src/app/` actúa como punto de composición general y orquestador interno.

---

## 2. Estructura oficial de carpetas

Árbol objetivo real basado en el dominio de ficha vacunal:

```text
project-root/
  src/
    index.ts                    # Entry publico del MFE (exporta eventos y registra el router)
    app/                        # Capa de composición del MFE
      bootstrap/                # Lógica de arranque interno
      css/
      model/
      ui/
      vacunas-ficha-vacunal-home.view.ts
      vacunas-ficha-vacunal-home.viewmodel.ts
    module/
      ficha-vacunal/            # Dominio del producto
        adapter/                # Adaptadores de API, mapeadores, HTTP
        cache/                  # Capa de caché en memoria
        components/             # Componentes UI de dominio
          <nombre-componente>/
            <nombre>.view.ts
            <nombre>.viewmodel.ts
            css/
            model/
            event/
        domain/                 # Entidades y reglas de negocio puras
        model/                  # Interfaces y DTOs
        service/                # Servicios de acceso a datos
        utils/                  # Utilidades especificas del dominio
    routing/                    # Router base del componente web (vacunas-ficha-vacunal-router.view.ts)
    shared/                     # Lógica transversal
      config/
      contract/
      errors/
      theme/
      ui/
  test/
    app/
    helpers/
    module/
    stubs/
```

**Reglas de raíz:**

| ID  | Regla                                                                                                      |
| --- | ---------------------------------------------------------------------------------------------------------- |
| FS1 | Todo código de dominio de producto vive bajo **`src/module/ficha-vacunal/`**.                              |
| FS2 | **`src/index.ts`** es el único entrypoint exportado por el build; solo orquesta importaciones y el router. |
| FS3 | **`test/`** está en la raíz del repo; **prohibido** alojar tests de producto dentro de `src/`.             |
| FS4 | **`src/shared/`** solo para reutilización e infraestructura, **no** para reglas de negocio del MFE.        |

---

## 3. Responsabilidades por capa

| Capa           | Ubicación típica            | Responsabilidad                                                          |
| -------------- | --------------------------- | ------------------------------------------------------------------------ |
| Entry          | `src/index.ts`              | Exportar el contrato público y cargar el entry del routing.              |
| App            | `src/app/`                  | Composición principal, vistas maestras (Home) y proceso de bootstrap.    |
| Router         | `src/routing/`              | Definir y registrar el Custom Element raíz `<vacunas-ficha-vacunal-mf>`. |
| Módulo         | `src/module/ficha-vacunal/` | Bounded context: componentes, adaptadores, y servicios del dominio.      |
| Componente     | `.../components/<name>/`    | Unidad UI + lógica de presentación (MVVM).                               |
| Vista          | `*.view.ts`                 | Solo render, plantillas Lit, estilos asociados al componente.            |
| ViewModel      | `*.viewmodel.ts`            | Estado, derivados, orquestación de eventos, llamadas a servicios.        |
| Tema CSS (Lit) | `css/*-theme.css.ts`        | Tokens y estilos del componente (CSSResult).                             |
| Eventos        | `src/shared/events/`        | Emisión y tipado de CustomEvents.                                        |
| Modelo         | `.../model/*.ts`            | DTOs, tipos y agregados del dominio.                                     |
| Adaptadores    | `.../adapter/`              | Traducción entre servicios externos y el dominio.                        |
| Servicios      | `.../service/`              | Acceso a datos, orquestación de llamadas HTTP.                           |
| Shared         | `src/shared/`               | Lógica transversal, utilidades técnicas, log, contrato.                  |
| Tests          | `test/`                     | Espejo funcional de `src/`.                                              |

---

## 4. Patrón MVVM obligatorio

| ID  | Regla                                                                                                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| MV1 | Cada componente de producto tiene **`.view.ts`** y **`.viewmodel.ts`** emparejados (mismo prefijo de nombre).                                        |
| MV2 | **`.view.ts`:** solo UI — `render()`, plantillas `html`, registro de estilos, delegación de eventos a métodos del viewmodel.                         |
| MV3 | **`.viewmodel.ts`:** estado reactivo (`@property`, `@state`), lógica de negocio de UI, llamadas a `service/`, transformación de datos para la vista. |
| MV4 | **Prohibido** en `.view.ts`: fetch, clientes HTTP directos, reglas de negocio complejas, llamadas a repositorios.                                    |
| MV5 | **Prohibido** en `.viewmodel.ts`: markup Lit extenso (salvo helpers mínimos); la vista debe concentrar el template.                                  |

---

## 5. Convenciones de nombrado

| Elemento           | Convención                                       | Ejemplo                                                  |
| ------------------ | ------------------------------------------------ | -------------------------------------------------------- |
| Módulo             | kebab-case                                       | `ficha-vacunal`                                          |
| Carpeta componente | kebab-case alineada con tag o nombre lógico      | `tarjetero`, `cabecera`                                  |
| Vista              | `<nombre>.view.ts`                               | `tarjetero.view.ts`                                      |
| ViewModel          | `<nombre>.viewmodel.ts`                          | `tarjetero.viewmodel.ts`                                 |
| Tema               | `css/<nombre>-theme.css.ts`                      | `tarjetero-theme.css.ts`                                 |
| Evento             | Tipado de contrato                               | `vacunas-ficha-vacunal-mf:card-selected`                 |
| Tests              | Mismo esqueleto bajo `test/` + sufijo `.test.ts` | `test/module/ficha-vacunal/components/tarjetero.test.ts` |

---

## 6. Reglas de modularidad

| ID  | Regla                                                                                                          |
| --- | -------------------------------------------------------------------------------------------------------------- |
| M1  | El código debe mantenerse estrictamente dentro del módulo de su dominio (`ficha-vacunal`).                     |
| M2  | Evitar dependencias circulares entre archivos; extraer modelos a `model/` si es necesario.                     |
| M3  | Utilizar adaptadores (`adapter/`) para transformar datos de la API antes de pasarlos al dominio o componentes. |

---

## 7. Política de `src/shared/`

| ID  | Regla                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------- |
| SH1 | Solo para lógica técnica (logs, tracking, configuración, decoradores) y el contrato (eventos, nombres). |
| SH2 | **Prohibido** usar `shared/` para modelos de dominio de Ficha Vacunal.                                  |
| SH3 | Preferir subcarpetas descriptivas como `config/`, `log/`, `events/`.                                    |

---

## 8. Estrategia de tests

| ID  | Regla                                                                                                                |
| --- | -------------------------------------------------------------------------------------------------------------------- |
| T1  | Tests bajo **`test/`** en la raíz; patrón del arquetipo: **`test/**/\*.test.ts`\*\* (configuración Web Test Runner). |
| T2  | Estructura de carpetas **espejo** de `src/` cuando aplique (ej. `test/module/`, `test/app/`).                        |
| T3  | Los tests importan módulos desde `src/`; no duplicar implementación en `test/`.                                      |
| T4  | Cobertura y ejecución en CI vía `npm run test:ci` o `npm run ci`.                                                    |

---

## 9. Antipatrones prohibidos

| ID  | Antipatrón                                                                                            |
| --- | ----------------------------------------------------------------------------------------------------- |
| AP1 | Lógica de negocio o HTTP directo en `.view.ts`                                                        |
| AP2 | Tests dentro de la carpeta `src/`                                                                     |
| AP3 | Uso de `any` generalizado sin justificación                                                           |
| AP4 | Romper la separación de `adapter/` o `service/` y llamar la API en el ViewModel de un componente      |
| AP5 | CustomEvents inventados fuera del contrato en `src/shared/contract/vacunas-ficha-vacunal.contract.ts` |
| AP6 | Prop drilling del NUHSA (identidad del paciente). Debe usarse `PacienteContext` en lógicas de red.    |
| AP7 | Usar DTOs de API (ej. `resumenPaciente.nuhsa`) como origen funcional de llamadas a otros servicios.   |

---

## 10. Ejemplo de componente (tarjetero)

```text
src/module/ficha-vacunal/components/tarjetero/
  tarjetero.view.ts
  tarjetero.viewmodel.ts
  css/
    tarjetero-theme.css.ts
```

```text
test/module/ficha-vacunal/components/tarjetero/
  tarjetero.view.test.ts
```

**Vista:** importa viewmodel, declara template, delega clicks.  
**ViewModel:** propiedades, carga de datos vía servicio, procesa la data.

---

## 11. Checklist de revisión técnica

- [ ] Par `.view.ts` / `.viewmodel.ts` presente en componentes nuevos (**MV1**)
- [ ] Sin HTTP ni negocio pesado en la vista (**MV4**)
- [ ] Eventos disparados están en el contrato (**AP5**)
- [ ] Tests en `test/` con espejo de rutas (**T1–T2**)
- [ ] Sin antipatrones **AP1–AP5**
