import { IDatabase, ITableBuilder } from "./expo.sql.wrapper.types";
import * as SQLite from "expo-sqlite/next";
export default function <D extends string>(databaseTables: ITableBuilder<any, D>[], getDatabase: () => Promise<SQLite.SQLiteDatabase>, onInit?: (database: IDatabase<D>) => Promise<void>, disableLog?: boolean): IDatabase<D>;
