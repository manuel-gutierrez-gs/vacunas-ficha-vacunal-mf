export const themeLoadCount: number;
export const resetThemeLoadCount: () => void;
export const themeLoader: () => void;

export class STICTheme {
  static CDN_URL_LINK: string;
  loadHeadStyles(): void;
}
