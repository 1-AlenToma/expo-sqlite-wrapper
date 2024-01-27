import { IBaseModule, IDatabase } from "./expo.sql.wrapper.types";
import * as SQLite from "expo-sqlite";
export default class BulkSave<T, D extends string> {
    quries: SQLite.Query[];
    private dbContext;
    private keys;
    private tableName;
    constructor(dbContext: IDatabase<D>, keys: string[], tableName: D);
    insert(items: IBaseModule<D> | IBaseModule<D>[]): this;
    update(items: IBaseModule<D> | IBaseModule<D>[]): this;
    delete(items: IBaseModule<D> | IBaseModule<D>[]): this;
    execute(): Promise<void>;
}
