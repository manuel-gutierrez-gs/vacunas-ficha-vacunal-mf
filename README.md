# vacunas-ficha-vacunal-mf

Microfrontend de ficha vacunal basado en Lit y arquitectura MVVM. Expone un custom element para integrarse en un shell host.

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

## Runtime config (`config/config-maps.json`)

El MF lee la configuracion en runtime desde `/config/config-maps.json` antes de registrarse.

Campos minimos:

```json
{
  "urlApiFichaVacunal": "/api/vacunas/ficha-vacunal",
  "urlApiConfigPacientes": "/api/vacunas/configuracion-pacientes"
}
```

Si falta o es invalido, el MF falla en arranque con `CONFIG_MISSING` o `CONFIG_INVALID`.

## API publica

- Custom element: `vacunas-ficha-vacunal-mf`
- Funcion de registro: `defineVacunasFichaVacunalMfElement`
- Eventos:
  - `vacunas-ficha-vacunal-mf:loaded`
  - `vacunas-ficha-vacunal-mf:error`
  - `vacunas-ficha-vacunal-mf:card-selected`

## Arquitectura resumida

```text
src/
  app/                     # composicion y root del MF
  module/ficha-vacunal/    # dominio funcional (adapter/service/model/components)
  shared/                  # infraestructura transversal
  index.ts                 # entrypoint unico y API publica
```
