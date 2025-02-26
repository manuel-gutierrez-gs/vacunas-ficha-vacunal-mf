import { defineCE, expect, fixture, fixtureCleanup, html, unsafeStatic } from '@open-wc/testing';
import { LayoutView } from '../../../src/module/layout/layout.view';

describe('Layout Component', () => {
  let element: LayoutView;

  afterEach(() => {
    fixtureCleanup();
  });

  it('should render a web component', async () => {
    element = await fixture<LayoutView>(html`<layout-container></layout-container>`);
    await element.updateComplete;
    console.log('Element:', element);
    expect(element).to.exist;
    expect(element.shadowRoot).to.exist;
  });

  it('should render a web component with random test tag', async () => {
    const tag = defineCE(class extends LayoutView {});
    const unsafeTag = unsafeStatic(tag);
    const el = await fixture<LayoutView>(html`<${unsafeTag}></${unsafeTag}>`);
    expect(el).to.exist;
    expect(el.shadowRoot).to.exist;
  });

  it('should update appName property', async () => {
    element = await fixture<LayoutView>(
      html`<layout-container .routeName=${'Test App'}></layout-container>`
    );
    await element.updateComplete;

    const contentContainer = element.shadowRoot?.querySelector('stic-appname-router');
    expect(contentContainer).to.have.property('route', 'Test App');
  });

  it('should handle menu item selection event', async () => {
    element = await fixture<LayoutView>(html`<layout-container></layout-container>`);
    await element.updateComplete;

    const navigationContainer = element.shadowRoot?.querySelector('stic-navigation');
    const mockEvent = new CustomEvent('navigation:clickitem', {
      detail: { value: 'New App Name' },
      bubbles: true,
      composed: true,
    });

    navigationContainer?.dispatchEvent(mockEvent);
    await element.updateComplete;

    expect(element.routeName).to.equal('New App Name');
  });
});
