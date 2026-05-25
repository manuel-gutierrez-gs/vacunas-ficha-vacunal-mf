import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { CounterView } from '../../../src/module/counter/counter.view';
import '../../../src/module/counter/counter.view';

describe('Counter component', () => {
  let element: CounterView;

  afterEach(() => {
    fixtureCleanup();
  });

  it('should render counter component', async () => {
    element = await fixture<CounterView>(html`<counter-component></counter-component>`);
    await expect(element).dom.to.equal(`<counter-component></counter-component>`);
  });

  it('should handle menu item selection event', async () => {
    element = await fixture<CounterView>(html`<counter-component></counter-component>`);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('stic-button');
    const mockEvent = new CustomEvent('button:click', {
      detail: 'test',
      bubbles: true,
      composed: true,
    });

    button?.dispatchEvent(mockEvent);
    await element.updateComplete;

    expect(element.count).to.equal(1);
  });
});
