import { expect, fixture, html } from "@open-wc/testing";

import "../../../src/module/example/stic-example.view";

describe("Componente stic-example", () => {
  it("Renderizado del componente stic-example", async () => {
    const el = await fixture(`<stic-example></stic-example>`);
    await expect(el).dom.to.equal(`<stic-example></stic-example>`);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture(html`<stic-example></stic-example>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
