import { expect } from '@open-wc/testing';
import { CreateIsolatedCapability } from '@sas/lib-stic-capabilities';
import { SticRouterViewModel, type SticRoute } from '@sas/lib-stic-route';
import { SticMicrofrontendViewModel } from '@sas/wc-stic-microfrontend';
import {
  MF_EVENT_CARD_SELECTED,
  MF_EVENT_ERROR,
  MF_EVENT_LOADED,
  MF_EVENT_NAVIGATE_DETALLE,
  MF_TAG_NAME,
} from '@shared/contract/vacunas-ficha-vacunal.contract';
import { PacienteContextRequestEvent } from '@shared/context/paciente-context';
import { themeLoadCount } from '../stubs/stic-theme.js';
import { ROUTES } from '../../src/routing/routes';
import { VacunasFichaVacunalRouterDelegate } from '../../src/routing/vacunas-ficha-vacunal-router.delegate';
import { MFE_CAPABILITY_CONFIGURATION } from '../../src/routing/vacunas-ficha-vacunal-router.viewmodel';
import '../../src/index';

describe('router compuesto de ficha vacunal', () => {
  const originalPathname = window.location.pathname;

  afterEach(() => {
    window.history.replaceState({}, '', originalPathname);
    document.body.innerHTML = '';
  });

  it('utiliza SticMicrofrontendViewModel y conserva las properties públicas', () => {
    const element = document.createElement(MF_TAG_NAME);

    expect(element).to.be.instanceOf(SticMicrofrontendViewModel);
    expect(element).to.not.be.instanceOf(SticRouterViewModel);
    expect('route' in element).to.be.true;
    expect('nuhsa' in element).to.be.true;
    expect('runtimeConfig' in element).to.be.true;
    expect('hasHeader' in element).to.be.true;
    expect('currentRoutePath' in element).to.be.true;
    expect('internalNavigation' in element).to.be.true;
  });

  it('registra la capability Isolated habilitada sin configurar eventos externos', () => {
    const configuration = MFE_CAPABILITY_CONFIGURATION.find(({ type }) => type === 'Isolated');

    expect(configuration).to.exist;
    expect(configuration?.isEnabled).to.equal(true);
    expect(configuration?.capability).to.equal(CreateIsolatedCapability);
    const isolatedConfiguration = configuration?.configuration as {
      eventKeyCollection?: string[];
      activateHostTheming?: boolean;
    };

    expect(isolatedConfiguration.eventKeyCollection).to.deep.equal([MF_EVENT_ERROR]);
    expect(isolatedConfiguration.activateHostTheming).to.equal(true);
    expect(isolatedConfiguration.eventKeyCollection).to.not.include(MF_EVENT_LOADED);
    expect(isolatedConfiguration.eventKeyCollection).to.not.include(MF_EVENT_CARD_SELECTED);
    expect(isolatedConfiguration.eventKeyCollection).to.not.include(MF_EVENT_NAVIGATE_DETALLE);
  });

  it('mantiene disponible el mecanismo de theme local en standalone', async () => {
    const element = document.createElement(MF_TAG_NAME);
    const themeLoadsBefore = themeLoadCount;
    document.body.appendChild(element);
    await (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;

    expect(window.self === window.top).to.equal(true);
    expect(themeLoadCount).to.be.greaterThan(themeLoadsBefore);

    element.remove();
  });

  it('delega la carga del theme del host al modo Isolated', () => {
    const configuration = MFE_CAPABILITY_CONFIGURATION.find(({ type }) => type === 'Isolated');
    const isolatedConfiguration = configuration?.configuration as {
      activateHostTheming?: boolean;
    };

    expect(isolatedConfiguration.activateHostTheming).to.equal(true);
  });

  it('no carga el theme local cuando el root vive dentro de un iframe', async () => {
    const iframe = document.createElement('iframe');
    iframe.srcdoc = `
      <script type="module">
        import '/src/index.ts';
        import { themeLoadCount } from '/test/stubs/stic-theme.js';

        const element = document.createElement('${MF_TAG_NAME}');
        document.body.appendChild(element);
        parent.postMessage({ type: 'theme-count', count: themeLoadCount }, '*');
      <\/script>
    `;

    const message = new Promise<number>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        window.removeEventListener('message', onMessage);
        reject(new Error('No se recibió la comprobación de theme del iframe'));
      }, 2000);
      const onMessage = (event: MessageEvent<{ type?: string; count?: number }>) => {
        if (event.source !== iframe.contentWindow || event.data?.type !== 'theme-count') return;
        window.clearTimeout(timeout);
        window.removeEventListener('message', onMessage);
        resolve(event.data.count ?? -1);
      };
      window.addEventListener('message', onMessage);
    });

    document.body.appendChild(iframe);

    try {
      expect(await message).to.equal(0);
    } finally {
      iframe.remove();
    }
  });

  it('conserva las rutas funcionales y sticBaseRoutes', () => {
    expect(ROUTES[0].path).to.equal('/');
    expect(ROUTES[0].component).to.equal('vacunas-ficha-vacunal-home');
    expect(ROUTES[1].path).to.equal('/detalle/:id/:situacion');
    expect(ROUTES[1].component).to.equal('ficha-vacunal-detalle');
    expect(ROUTES.some(route => route.path === '(.*)')).to.be.true;
  });

  it('configura el outlet, resuelve home y conserva navegación interna', async () => {
    if (!customElements.get('router-composition-home')) {
      customElements.define('router-composition-home', class extends HTMLElement {});
    }

    const outlet = document.createElement('div');
    document.body.appendChild(outlet);
    const delegate = new VacunasFichaVacunalRouterDelegate();
    const routes: SticRoute[] = [
      { path: '/', component: 'router-composition-home' },
      { path: '/detalle/:id/:situacion', component: 'router-composition-detail' },
    ];

    delegate.attach(outlet, routes);
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(delegate.internalNavigation).to.be.true;
    expect(outlet.querySelector('router-composition-home')).to.exist;

    const pathname = window.location.pathname;
    delegate.currentRoutePath = '/detalle/123/PROGRAMADA';
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(delegate.currentRoutePath).to.equal('/detalle/123/PROGRAMADA');
    expect(window.location.pathname).to.equal(pathname);
    expect(outlet.querySelector('router-composition-detail')).to.exist;

    delegate.disconnect();
  });

  it('conserva route como property sin convertirla en navegación', () => {
    const element = document.createElement(MF_TAG_NAME) as HTMLElement & {
      route: string;
      currentRoutePath: string;
    };

    element.route = '/detalle/ignored/PROGRAMADA';

    expect(element.route).to.equal('/detalle/ignored/PROGRAMADA');
    expect(element.currentRoutePath).to.equal('/');
  });

  it('propaga nuhsa, runtimeConfig y hasHeader mediante PacienteContext', async () => {
    const element = document.createElement(MF_TAG_NAME) as HTMLElement & {
      nuhsa: string;
      runtimeConfig: object;
      hasHeader: boolean;
      updateComplete: Promise<unknown>;
    };
    const config = { urlApiFichaVacunal: '/ficha' };
    element.nuhsa = 'AN001';
    element.runtimeConfig = config;
    element.hasHeader = false;
    document.body.appendChild(element);

    let context: { nuhsa: string; runtimeConfig?: object; hasHeader: boolean } | undefined;
    element.dispatchEvent(
      new PacienteContextRequestEvent(value => {
        context = value;
      })
    );

    expect(context).to.deep.equal({ nuhsa: 'AN001', runtimeConfig: config, hasHeader: false });
    element.remove();
    await element.updateComplete;
  });

  it('mantiene el evento de navegación de detalle y la codificación de situación', async () => {
    const element = document.createElement(MF_TAG_NAME) as HTMLElement & {
      currentRoutePath: string;
    };
    document.body.appendChild(element);

    element.dispatchEvent(
      new CustomEvent(MF_EVENT_NAVIGATE_DETALLE, {
        detail: { id: '123', situacion: 'FUERA DE PLAZO' },
        bubbles: true,
        composed: true,
      })
    );

    expect(element.currentRoutePath).to.equal('/detalle/123/FUERA%20DE%20PLAZO');
    element.remove();
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  it('elimina y vuelve a registrar los listeners al desconectar y conectar', () => {
    const element = document.createElement(MF_TAG_NAME) as HTMLElement & {
      currentRoutePath: string;
    };
    document.body.appendChild(element);
    element.remove();

    element.dispatchEvent(
      new CustomEvent(MF_EVENT_NAVIGATE_DETALLE, {
        detail: { id: 'ignored', situacion: 'PROGRAMADA' },
        bubbles: true,
        composed: true,
      })
    );
    expect(element.currentRoutePath).to.equal('/');

    document.body.appendChild(element);
    element.dispatchEvent(
      new CustomEvent(MF_EVENT_NAVIGATE_DETALLE, {
        detail: { id: '789', situacion: 'PROGRAMADA' },
        bubbles: true,
        composed: true,
      })
    );
    expect(element.currentRoutePath).to.equal('/detalle/789/PROGRAMADA');
    element.remove();
  });

  it('resuelve los parámetros de la ruta de detalle mediante Vaadin Router', async () => {
    if (!customElements.get('router-composition-detail')) {
      customElements.define('router-composition-detail', class extends HTMLElement {});
    }

    const outlet = document.createElement('div');
    document.body.appendChild(outlet);
    const delegate = new VacunasFichaVacunalRouterDelegate();
    const routes: SticRoute[] = [
      { path: '/', component: 'router-composition-home' },
      { path: '/detalle/:id/:situacion', component: 'router-composition-detail' },
    ];

    delegate.attach(outlet, routes);
    delegate.currentRoutePath = '/detalle/456/FUERA_PLAZO';
    await new Promise(resolve => setTimeout(resolve, 0));

    const detail = outlet.querySelector('router-composition-detail') as HTMLElement & {
      location?: { params?: { id?: string; situacion?: string } };
    };

    expect(detail.location?.params?.id).to.equal('456');
    expect(detail.location?.params?.situacion).to.equal('FUERA_PLAZO');

    delegate.disconnect();
  });
});
