# vacunas-ficha-vacunal-mf

Microfrontend de ficha vacunal basado en Lit, arquitectura MVVM, y un modelo de identidad centralizada mediante `PacienteContext`. Expone un custom element para integrarse en un shell host.

## Instalacion y arranque local

El repositorio incluye `package-lock.json`, por lo que la instalación reproducible puede hacerse con:

```bash
npm install
npm run dev
```

En desarrollo, el entrypoint del documento local es `/src/index.ts`. El custom element puede montarse así:

```html
<script type="module" src="/src/index.ts"></script>
<vacunas-ficha-vacunal-mf nuhsa="NUHSA001"></vacunas-ficha-vacunal-mf>
```

## Build

```bash
npm run build
```

El build genera el bundle y los recursos publicables en `dist/`:

```text
dist/
  vacunas-ficha-vacunal-mf.js
  style.css
  index.html
  environments-configmap.json
```

Vite utiliza `base: './'`, por lo que las referencias generadas a los recursos son relativas y permiten publicar el artefacto bajo una ruta anidada.

## Tests

```bash
npm test
npm run typecheck
```

## Integracion en shell host

El consumidor carga el bundle como módulo ES y monta el custom element:

```html
<script
  type="module"
  src="https://cdn.example.com/mfe/vacunas-ficha-vacunal-mf/vacunas-ficha-vacunal-mf.js"
></script>
<vacunas-ficha-vacunal-mf nuhsa="NUHSA001"></vacunas-ficha-vacunal-mf>
```

También puede cargarse mediante `await import(...)` desde el host. El consumidor no necesita proporcionar el runtime config: el MF obtiene automáticamente `environments-configmap.json` junto a su propio bundle.

Para controlar la visibilidad de la cabecera del MF, se utiliza la propiedad `hasHeader` (`true` por defecto):

```html
<!-- HTML (atributo booleano) -->
<vacunas-ficha-vacunal-mf nuhsa="NUHSA001" hasHeader></vacunas-ficha-vacunal-mf>
```

```typescript
// Lit (property assignment)
html`
  <vacunas-ficha-vacunal-mf .nuhsa=${'NUHSA001'} .hasHeader=${false}></vacunas-ficha-vacunal-mf>
`;
```

## Runtime config (`environments-configmap.json`)

El MF carga automáticamente `environments-configmap.json` antes de inicializar su contenido. La URL se resuelve respecto al módulo ESM del MF mediante:

```ts
new URL('environments-configmap.json', import.meta.url).href;
```

Por tanto, la resolución sigue la ubicación del bundle y no depende de `document.baseURI` ni de una ruta absoluta del host consumidor:

```text
MFE bundle
    ↓
import.meta.url
    ↓
environments-configmap.json
```

Campos utilizados por el MF:

```json
{
  "urlApiAlergiasYContraindicacionesS039": "http://vacunas.des.sas.junta-andalucia.es/consulta-alergias-contraindicaciones-api/api/v1",
  "urlApiConfigAccionVacunal": "http://accion-vacunal-api.oc-vacunas.10.200.201.76.nip.io/accion-vacunal-api/api/v1",
  "urlApiConfigCalendarios": "http://calendario-vacunal-api.oc-vacunas.10.200.201.76.nip.io/calendario-vacunal-api/api/v1",
  "urlApiConfigPacientes": "http://configuracion-de-paciente-api.oc-vacunas.10.200.201.76.nip.io/configuracion-de-paciente-api/api/v1",
  "urlApiContraindicaciones": "http://contraindicaciones-api.oc-vacunas.10.200.201.76.nip.io/contraindicaciones-api/api/v1",
  "urlApiCriterio": "http://criterios-vacunacion-paciente-api.oc-vacunas.10.200.201.76.nip.io/criterios-vacunacion-paciente-api/api/v1",
  "urlApiFichaVacunal": "http://ficha-vacunal-api.oc-vacunas.10.200.201.76.nip.io/ficha-vacunal-api/api/v1",
  "urlApiMarcasComerciales": "http://consulta-marcas-comerciales-api.oc-vacunas.10.200.201.76.nip.io/consulta-marcas-comerciales-api/api/v1",
  "urlApiProductosInmunizacion": "http://consulta-productos-inmunizacion-api.oc-vacunas.10.200.201.76.nip.io/consulta-productos-inmunizacion-api/api/v1",
  "urlApiReaccionesAdversas": "http://reacciones-adversas-api.oc-vacunas.10.200.201.76.nip.io/reacciones-adversas-api/api/v1"
}
```

Si el recurso falta o su contenido no es válido, el MF falla en arranque con `CONFIG_MISSING` o `CONFIG_INVALID`.

## API publica

- Custom element: `vacunas-ficha-vacunal-mf`
- Propiedades principales: `nuhsa` y `hasHeader`.
- Evento público de error del MF: `vacunas-ficha-vacunal-mf:error` (`MF_EVENT_ERROR`). Es el evento externo incluido en la configuración de `Isolated`.

Los eventos de carga, selección, navegación y contexto forman parte de la coordinación interna del MF o de contratos internos de composición; no deben tratarse como eventos externos publicados por la capability `Isolated`.

## Arquitectura del root

La composición actual del root es:

```text
LitElement
    ↓
SticMicrofrontendViewModel
    ↓
VacunasFichaVacunalRouterViewModel
    ↓
VacunasFichaVacunalRouterView
```

El routing se integra mediante composición con `VacunasFichaVacunalRouterDelegate`. Las rutas funcionales actuales son:

- `/`: vista principal `vacunas-ficha-vacunal-home`.
- `/detalle/:id/:situacion`: detalle de ficha vacunal.

El MF configura la capability STIC `Isolated` mediante `CreateIsolatedCapability`, habilitada con `activateHostTheming: true`. Esto permite integrarlo como microfrontend aislado dentro de un host.

## Theming

- **Standalone:** el MF verifica y carga el theme STIC local.
- **Integrado en host o iframe:** el MF no carga directamente el theme local; `activateHostTheming: true` permite utilizar el theme proporcionado por el host.

## Deployment

El flujo de publicación es:

```text
src/
    ↓
vite build
    ↓
dist/
    ├── vacunas-ficha-vacunal-mf.js
    ├── style.css
    ├── index.html
    └── environments-configmap.json
    ↓
Docker
    ↓
Nginx
```

El `Dockerfile` publica `dist/` en `/usr/share/nginx/html/` y el servidor utiliza `nginx.conf`. El bundle y sus recursos pueden servirse desde una ruta anidada del CDN o del host.

## Arquitectura resumida

```text
src/
  app/                     # composicion y root del MF (bootstrap, model, ui, vistas principales)
  module/ficha-vacunal/    # dominio funcional (adapter, cache, components, model, service, utils)
  routing/                 # enrutador base del MF y custom element
  shared/                  # infraestructura transversal
  index.ts                 # entrypoint unico y exportacion de la API publica
```
