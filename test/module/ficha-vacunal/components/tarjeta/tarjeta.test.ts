import { expect, fixture, html } from '@open-wc/testing';
import { SituacionEnum } from '@module/ficha-vacunal/model/ficha-vacunal.model';
import '@module/ficha-vacunal/components/tarjeta/tarjeta.view';
import type { TarjetaView } from '@module/ficha-vacunal/components/tarjeta/tarjeta.view';

type IconInput =
  | { value: string; icon: string }
  | { value: string; icon: { viewbox: string; path: string } };

type IconOutput = {
  strings: readonly string[];
};

type TarjetaTestAPI = {
  data: unknown;

  renderIcon(input: IconInput): IconOutput;

  getIcons(): Array<{ value: string }>;

  getNombreVacuna(): string;

  getDetalleSituacion(): string;

  getTagSetDataSource(): unknown[];

  getCardClassNames(): Record<string, boolean>;

  shadowRoot: ShadowRoot | null;
};

const asApi = (el: TarjetaView): TarjetaTestAPI => el as unknown as TarjetaTestAPI;

const mount = async (data: unknown) => {
  const el = await fixture<TarjetaView>(
    html`<ficha-vacunal-tarjeta .data=${data}></ficha-vacunal-tarjeta>`
  );
  return asApi(el);
};

describe('tarjeta branches', () => {
  it('renderIcon renders string icon', async () => {
    const el = await mount({});

    const iconHtml = el.renderIcon({ value: 'Test', icon: 'forum' });

    expect(iconHtml.strings[0]).to.include('stic-icon');
  });

  it('renderIcon renders svg icon', async () => {
    const el = await mount({});

    const iconHtml = el.renderIcon({
      value: 'Test',
      icon: { viewbox: '0 0 20 20', path: 'M0' },
    });

    expect(iconHtml.strings[0]).to.include('svg');
  });

  it('getIcons filters correctly', async () => {
    const el = await mount({
      comentarios: 'yes',
      efectosAdversosRegistrados: false,
      administradaPorEntePrivado: true,
      documentada: false,
      negacionDePaciente: true,
    });

    const icons = el.getIcons();

    expect(icons.length).to.equal(3);
    expect(icons[0].value).to.equal('Comentarios');
    expect(icons[1].value).to.equal('Privado');
    expect(icons[2].value).to.equal('Negación');
  });

  it('handles empty vacuna data', async () => {
    const el = await mount({});

    expect(el.getNombreVacuna()).to.equal('');
    expect(el.getDetalleSituacion()).to.equal('');
  });

  it('handles PENDIENTE_PRIMERA_DOSIS tag logic', async () => {
    const el = await mount({
      situacion: SituacionEnum.PENDIENTE_PRIMERA_DOSIS,
      calendario: 'C1',
    });

    expect(el.getTagSetDataSource().length).to.equal(0);
  });

  it('handles unknown situation', async () => {
    const el = await mount({
      situacion: 'UNKNOWN_SITUATION',
      calendario: 'C1',
    });

    expect(el.getTagSetDataSource().length).to.equal(0);
  });

  it('card class combinations', async () => {
    const cases = [
      [SituacionEnum.ADMINISTRADA, false, 'ficha-vacunal-card--administrada'],
      [SituacionEnum.ADMINISTRADA, true, 'ficha-vacunal-card--administrada-aislada'],
      [SituacionEnum.NO_ADMINISTRADA, false, 'ficha-vacunal-card--no-administrada'],
      [SituacionEnum.NO_ADMINISTRADA, true, 'ficha-vacunal-card--no-administrada-aislada'],
      [SituacionEnum.FUERA_PLAZO, false, 'ficha-vacunal-card--pendiente'],
      [SituacionEnum.EXCLUIDA, false, 'ficha-vacunal-card--excluida'],
      [SituacionEnum.EXCLUIDA, true, 'ficha-vacunal-card--excluida-aislada'],
      [SituacionEnum.PROGRAMADA, true, 'ficha-vacunal-card--programada'],
    ] as const;

    for (const [sit, aislada, cls] of cases) {
      const el = await mount({
        situacion: sit,
        calendario: aislada ? undefined : 'C',
      });

      const classes = el.getCardClassNames();

      expect(classes[cls]).to.be.true;
    }
  });

  it('renders without icons or tags', async () => {
    const el = await mount({ calendario: 'C1' });

    const htmlText = el.shadowRoot?.innerHTML ?? '';

    expect(htmlText).to.not.include('ficha-vacunal-card__icons');
    expect(htmlText).to.not.include('stic-tag-set');
  });

  it('renders pendiente detalle', async () => {
    const el = await mount({
      situacion: SituacionEnum.PENDIENTE_PRIMERA_DOSIS,
      detalleSituacion: 'Falta dosis',
      calendario: 'C1',
    });

    expect(el.shadowRoot?.innerHTML).to.include('Falta dosis');
  });

  it('does not render pendiente detalle when not pending', async () => {
    const el = await mount({
      situacion: SituacionEnum.ADMINISTRADA,
      detalleSituacion: 'Falta dosis',
      calendario: 'C1',
    });

    expect(el.shadowRoot?.innerHTML).to.not.include('Falta dosis');
  });
});
