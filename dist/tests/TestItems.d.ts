export interface DetaliItems {
    id: number;
    title: string;
    image: string;
    description?: string;
    novel: string;
    parserName: string;
    chapterIndex: number;
    isFavorit?: boolean;
    children?: Chapters[];
}
export interface Chapters {
    id: number;
    chapterUrl: number;
    isViewed?: boolean;
    currentProgress: number;
    audioProgress: number;
    finished?: boolean;
    detaliItem_Id: number;
    unlocked?: boolean;
}
export type TableNames = 'DetaliItems' | 'Chapters';
export declare const tables: (import("../expo.sql.wrapper.types").ITableBuilder<DetaliItems, TableNames> | import("../expo.sql.wrapper.types").ITableBuilder<Chapters, TableNames>)[];
