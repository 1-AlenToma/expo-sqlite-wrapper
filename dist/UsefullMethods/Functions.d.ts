import { IBaseModule, IDataBaseExtender, IId } from '../expo.sql.wrapper.types';
import { TableBuilder } from "../TableStructor";
declare class Functions {
    encryptionsIdentifier: string;
    buildJsonExpression(jsonExpression: any, database: IDataBaseExtender<string>, tableName: string, alias: string, isInit?: boolean): any;
    aliasNameming(column: string, alias: string): string;
    isPrimitive(v: any): boolean;
    isDefained(v: any): boolean;
    isFunc(value: any): boolean;
    isDate(v: any): boolean;
    translateToSqliteValue(v: any): any;
    translateAndEncrypt(v: any, database: IDataBaseExtender<string>, tableName: string, column?: string): any;
    encrypt(str: string, key: string): string;
    decrypt(str: string, key: string): any;
    oEncypt(item: any, tableBuilder?: TableBuilder<any, string>): any;
    oDecrypt(item: any, tableBuilder?: TableBuilder<any, string>): any;
    validateTableName<T extends IId<D>, D extends string>(item: T, tableName?: D): IBaseModule<D>;
    jsonToSqlite(query: any): {
        sql: any;
        args: any[];
    };
    translateSimpleSql(database: any, tableName: string, query?: any): {
        sql: string;
        args: any[];
    };
    getAvailableKeys(dbKeys: string[], item: any): string[];
    createSqlInstaceOfType(prototype: any, item: any): any;
    counterSplit<T>(titems: T[], counter: number): T[][];
    findAt<T>(titems: Array<T> | undefined, index: number): T | undefined;
    last<T>(titems: Array<T> | undefined): T | undefined;
    toType<T>(titems: Array<T> | undefined): Array<T> | T[];
    single<T>(titems: Array<T> | undefined): T | undefined;
}
declare const functions: Functions;
export default functions;
