import { IDatabase, ITableBuilder } from "./expo.sql.wrapper.types";
import * as SQLite from "expo-sqlite";
export default function <D extends string>(databaseTables: ITableBuilder<any, D>[], getDatabase: () => Promise<SQLite.WebSQLDatabase>, onInit?: (database: IDatabase<D>) => Promise<void>, disableLog?: boolean): IDatabase<D>;
