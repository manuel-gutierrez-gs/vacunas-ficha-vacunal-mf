# vacunas-ficha-vacunal-mf

Microfrontend de ficha vacunal basado en Lit, arquitectura MVVM, y un modelo de identidad centralizada mediante `PacienteContext`. Expone un custom element para integrarse en un shell host.

## Arranque local

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
```

Genera `dist/vacunas-ficha-vacunal-mf.js`.

## Tests

```bash
npm test
npm run typecheck
```

## Integracion en shell host

1. Servir `dist/` y cargar `vacunas-ficha-vacunal-mf.js` como modulo ES.
2. Asegurar que el host sirve `config/config-maps.json`.
3. Montar el custom element:

```html
<vacunas-ficha-vacunal-mf nuhsa="NUHSA001"></vacunas-ficha-vacunal-mf>
```

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

## Runtime config (`config/config-maps.json`)

El MF lee la configuracion en runtime desde `/config/config-maps.json` antes de registrarse.

Campos minimos:

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

Si falta o es invalido, el MF falla en arranque con `CONFIG_MISSING` o `CONFIG_INVALID`.

## API publica

- Custom element: `vacunas-ficha-vacunal-mf`
- Eventos definidos en el contrato:
  - `vacunas-ficha-vacunal-mf:loaded`
  - `vacunas-ficha-vacunal-mf:error`
  - `vacunas-ficha-vacunal-mf:card-selected`

## Arquitectura resumida

```text
src/
  app/                     # composicion y root del MF (bootstrap, model, ui, vistas principales)
  module/ficha-vacunal/    # dominio funcional (adapter, cache, components, model, service, utils)
  routing/                 # enrutador base del MF y custom element
  shared/                  # infraestructura transversal
  index.ts                 # entrypoint unico y exportacion de la API publica
```
