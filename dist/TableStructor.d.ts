import { ColumnType, ITableBuilder } from "./expo.sql.wrapper.types";
interface ColumnProps<T, D extends string> {
    columnType: ColumnType;
    isNullable?: boolean;
    columnName: keyof T;
    isPrimary?: boolean;
    isAutoIncrement?: boolean;
    isUnique?: boolean;
    encryptionKey?: string;
}
export declare class TableBuilder<T, D extends string> {
    props: ColumnProps<T, D>[];
    constrains: {
        columnName: keyof T;
        contraintTableName: D;
        contraintColumnName: any;
    }[];
    tableName: D;
    itemCreate?: (item: T) => T;
    typeProptoType?: any;
    constructor(tableName: D);
    colType(colType: ColumnType): this;
    get blob(): this;
    get json(): this;
    get boolean(): this;
    get number(): this;
    get decimal(): this;
    get string(): this;
    get dateTime(): this;
    get nullable(): this;
    get primary(): this;
    get autoIncrement(): this;
    get unique(): this;
    get getLastProp(): ColumnProps<T, D>;
    objectPrototype(objectProptoType: any): this;
    encrypt(encryptionKey: string): this;
    onItemCreate(func: (item: T) => T): this;
    column(colName: keyof T): this;
    constrain<E extends object>(columnName: keyof T, contraintTableName: D, contraintColumnName: keyof E): this;
}
declare const _default: <T extends object, D extends string>(tableName: D) => ITableBuilder<T, D>;
export default _default;
