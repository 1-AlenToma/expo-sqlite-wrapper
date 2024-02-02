import { IDatabase, IId, IQuery, IQueryResultItem, SQLQuery } from "../expo.sql.wrapper.types";
import { IReturnMethods } from "../QuerySelector";
declare const UseQuery: <T extends IId<D>, D extends string>(query: SQLQuery | IQuery<T, D> | IReturnMethods<T, D> | (() => Promise<T[]>), dbContext: IDatabase<D>, tableName: D, onItemChange?: (items: T[]) => T[]) => readonly [IQueryResultItem<T, D>[], boolean, () => Promise<void>, IDatabase<D>];
export default UseQuery;
