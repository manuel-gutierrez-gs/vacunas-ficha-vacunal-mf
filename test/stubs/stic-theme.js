export let themeLoadCount = 0;

export const resetThemeLoadCount = () => {
  themeLoadCount = 0;
};

export const themeLoader = () => {};

export class STICTheme {
  static CDN_URL_LINK = '';

  loadHeadStyles() {
    themeLoadCount += 1;
  }
}
