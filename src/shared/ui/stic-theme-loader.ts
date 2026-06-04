import { STICTheme } from '@sas/wc-stic-theme';

let themeLoaded = false;

export function verifySticThemeLoaded(): void {
  if (themeLoaded) {
    return;
  }
  new STICTheme().loadHeadStyles();
  themeLoaded = true;
}
