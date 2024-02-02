import { IBaseModule, IDatabase, SQLQuery } from "./expo.sql.wrapper.types";
export default class BulkSave<T, D extends string> {
    quries: SQLQuery[];
    private dbContext;
    private keys;
    private tableName;
    constructor(dbContext: IDatabase<D>, keys: string[], tableName: D);
    insert(items: IBaseModule<D> | IBaseModule<D>[]): this;
    update(items: IBaseModule<D> | IBaseModule<D>[]): this;
    delete(items: IBaseModule<D> | IBaseModule<D>[]): this;
    execute(): Promise<void>;
}
