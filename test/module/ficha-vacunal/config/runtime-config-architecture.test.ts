import { expect } from '@open-wc/testing';
import { RUNTIME_CONFIG_URL } from '@shared/config/runtime-config';

describe('runtime config architecture', () => {
  it('resolves environments-configmap.json independently from the host document', () => {
    const hostBase = document.createElement('base');
    hostBase.href = 'https://host.example.test/shell/';
    document.head.appendChild(hostBase);

    try {
      const runtimeConfigUrl = new URL(RUNTIME_CONFIG_URL, document.baseURI);

      expect(runtimeConfigUrl.pathname).to.match(/\/environments-configmap\.json$/);
      expect(runtimeConfigUrl.origin).to.not.equal(new URL(hostBase.href).origin);
      expect(RUNTIME_CONFIG_URL).to.not.equal('/config/config-maps.json');
      expect(RUNTIME_CONFIG_URL).to.not.match(/\/config\/config-maps\.json$/);
    } finally {
      hostBase.remove();
    }
  });
});
