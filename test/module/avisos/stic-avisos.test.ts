import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { SticAvisosView } from '../../../src/module/avisos/stic-avisos.view';


describe('my-component', () => {
  afterEach(() => {
    fixtureCleanup();
  });

  it('should render the component', async () => {
    const element = await fixture<SticAvisosView>(
      html`<my-component></my-component>`
    );

    expect(element).to.exist;
  });

  it('should render expected content', async () => {
    const element = await fixture<SticAvisosView>(
      html`<my-component></my-component>`
    );

    const text = element.shadowRoot?.textContent;

    expect(text).to.contain('Expected text');
  });

  it('should render a child element', async () => {
    const element = await fixture<SticAvisosView>(
      html`<my-component></my-component>`
    );

    const child = element.shadowRoot?.querySelector('button');

    expect(child).to.exist;
  });

  it('should react to user interaction', async () => {
    const element = await fixture<SticAvisosView>(
      html`<my-component></my-component>`
    );

    const button = element.shadowRoot?.querySelector('button');

    button?.dispatchEvent(new Event('click'));

    await element.updateComplete;

    // expect(element.someProperty).to.equal(true);
  });
});