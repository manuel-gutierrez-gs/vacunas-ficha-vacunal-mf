import { expect, fixture, html } from '@open-wc/testing';
import { SituacionEnum } from '@module/ficha-vacunal/model/ficha-vacunal.model';
import '@module/ficha-vacunal/components/tarjeta/tarjeta.view';
import { TarjetaView } from '@module/ficha-vacunal/components/tarjeta/tarjeta.view';

describe('tarjeta branches', () => {
  it('renderIcon renders string icon', async () => {
    const el = await fixture<TarjetaView>(html`<ficha-vacunal-tarjeta .data=${{} as any}></ficha-vacunal-tarjeta>`);
    const iconHtml = (el as any).renderIcon({ value: 'Test', icon: 'forum' });
    expect(iconHtml.strings[0]).to.include('stic-icon');
  });

  it('renderIcon renders svg icon', async () => {
    const el = await fixture<TarjetaView>(html`<ficha-vacunal-tarjeta .data=${{} as any}></ficha-vacunal-tarjeta>`);
    const iconHtml = (el as any).renderIcon({ value: 'Test', icon: { viewbox: '0 0 20 20', path: 'M0' } });
    expect(iconHtml.strings[0]).to.include('svg');
  });

  it('getIcons filters correctly', async () => {
    const data = {
      comentarios: 'yes',
      efectosAdversosRegistrados: false,
      administradaPorEntePrivado: true,
      documentada: false,
      negacionDePaciente: true
    };
    const el = await fixture<TarjetaView>(html`<ficha-vacunal-tarjeta .data=${data as any}></ficha-vacunal-tarjeta>`);
    const icons = (el as any).getIcons();
    expect(icons.length).to.equal(3);
    expect(icons[0].value).to.equal('Comentarios');
    expect(icons[1].value).to.equal('Privado');
    expect(icons[2].value).to.equal('Negación');
  });

  it('getNombreVacuna and getDetalleSituacion handle missing data', async () => {
    const el = await fixture<TarjetaView>(html`<ficha-vacunal-tarjeta .data=${{} as any}></ficha-vacunal-tarjeta>`);
    expect((el as any).getNombreVacuna()).to.equal('');
    expect((el as any).getDetalleSituacion()).to.equal('');
  });

  it('getTagSetDataSource handles situacion PENDIENTE_PRIMERA_DOSIS', async () => {
    const data = { situacion: SituacionEnum.PENDIENTE_PRIMERA_DOSIS, calendario: 'C1' };
    const el = await fixture<TarjetaView>(html`<ficha-vacunal-tarjeta .data=${data as any}></ficha-vacunal-tarjeta>`);
    const tags = (el as any).getTagSetDataSource();
    // It should skip the tag and it's not aislada
    expect(tags.length).to.equal(0);
  });

  it('getTagSetDataSource handles situacion without cfg', async () => {
    const data = { situacion: 'UNKNOWN_SITUATION', calendario: 'C1' };
    const el = await fixture<TarjetaView>(html`<ficha-vacunal-tarjeta .data=${data as any}></ficha-vacunal-tarjeta>`);
    const tags = (el as any).getTagSetDataSource();
    expect(tags.length).to.equal(0);
  });

  it('getCardClassNames handles various situations and aislada combinations', async () => {
    // We will test multiple data states to hit branches in getCardClassNames
    const testCases = [
      { sit: SituacionEnum.ADMINISTRADA, aislada: false, expectTrue: 'ficha-vacunal-card--administrada' },
      { sit: SituacionEnum.ADMINISTRADA, aislada: true, expectTrue: 'ficha-vacunal-card--administrada-aislada' },
      { sit: SituacionEnum.NO_ADMINISTRADA, aislada: false, expectTrue: 'ficha-vacunal-card--no-administrada' },
      { sit: SituacionEnum.NO_ADMINISTRADA, aislada: true, expectTrue: 'ficha-vacunal-card--no-administrada-aislada' },
      { sit: SituacionEnum.FUERA_PLAZO, aislada: false, expectTrue: 'ficha-vacunal-card--pendiente' },
      { sit: SituacionEnum.EXCLUIDA, aislada: false, expectTrue: 'ficha-vacunal-card--excluida' },
      { sit: SituacionEnum.EXCLUIDA, aislada: true, expectTrue: 'ficha-vacunal-card--excluida-aislada' },
      { sit: SituacionEnum.PROGRAMADA, aislada: true, expectTrue: 'ficha-vacunal-card--programada' },
    ];

    for (const tc of testCases) {
      const el = await fixture<TarjetaView>(html`<ficha-vacunal-tarjeta .data=${{ situacion: tc.sit, calendario: tc.aislada ? undefined : 'C' } as any}></ficha-vacunal-tarjeta>`);
      const classes = (el as any).getCardClassNames();
      expect(classes[tc.expectTrue]).to.be.true;
    }
  });

  it('render conditionally skips icons and tags', async () => {
    const el = await fixture<TarjetaView>(html`<ficha-vacunal-tarjeta .data=${{ calendario: 'C1' } as any}></ficha-vacunal-tarjeta>`);
    const htmlText = el.shadowRoot?.innerHTML || '';
    expect(htmlText).to.not.include('ficha-vacunal-card__icons');
    expect(htmlText).to.not.include('stic-tag-set');
  });

  it('render conditionally displays pendiente detalle', async () => {
    const data = {
      situacion: SituacionEnum.PENDIENTE_PRIMERA_DOSIS,
      detalleSituacion: 'Falta dosis',
      calendario: 'C1'
    };
    const el = await fixture<TarjetaView>(html`<ficha-vacunal-tarjeta .data=${data as any}></ficha-vacunal-tarjeta>`);
    const htmlText = el.shadowRoot?.innerHTML || '';
    expect(htmlText).to.include('Falta dosis');
  });

  it('render conditionally skips pendiente detalle if not pendiente', async () => {
    const data = {
      situacion: SituacionEnum.ADMINISTRADA,
      detalleSituacion: 'Falta dosis',
      calendario: 'C1'
    };
    const el = await fixture<TarjetaView>(html`<ficha-vacunal-tarjeta .data=${data as any}></ficha-vacunal-tarjeta>`);
    const htmlText = el.shadowRoot?.innerHTML || '';
    expect(htmlText).to.not.include('Falta dosis');
  });
});
