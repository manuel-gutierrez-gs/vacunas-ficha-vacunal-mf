import { CSSResult, css, CSSResultOrNative } from "lit";

export class SticExampleTheme {
    static cssBase: CSSResult = css`
        :host {
            display: block;
        }
    `;

    static SticExampleTheme: CSSResultOrNative[] = [SticExampleTheme.cssBase];
}