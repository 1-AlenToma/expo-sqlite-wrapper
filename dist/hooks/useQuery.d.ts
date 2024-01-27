import { IDatabase, IId, IQuery, IQueryResultItem } from "../expo.sql.wrapper.types";
import { IReturnMethods } from "../QuerySelector";
import * as SQLite from 'expo-sqlite';
declare const UseQuery: <T extends IId<D>, D extends string>(query: SQLite.Query | IQuery<T, D> | IReturnMethods<T, D> | (() => Promise<T[]>), dbContext: IDatabase<D>, tableName: D, onItemChange?: (items: T[]) => T[]) => readonly [IQueryResultItem<T, D>[], boolean, () => Promise<void>, IDatabase<D>];
export default UseQuery;
