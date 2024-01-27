export default class Counter<T> {
    items: T[];
    currentIndex: number;
    constructor(items: T[]);
    get length(): number;
    get hasNext(): boolean;
    get hasPrev(): boolean;
    get hasCurrent(): boolean;
    get next(): T;
    get prev(): T;
    get current(): T;
    index(index: number): T;
}
