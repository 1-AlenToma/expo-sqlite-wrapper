export default class StringBuilder {
    private text;
    constructor(text?: string);
    get isEmpty(): boolean;
    append(...texts: string[]): this;
    prepend(...texts: string[]): this;
    trimEnd(...q: any[]): this;
    indexOf(search: string): number;
    replaceIndexOf(text: string, replacement: string): this;
    toString(): string;
}
