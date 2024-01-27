import { IBaseModule, SingleValue, ArrayValue, StringValue, NumberValue, IQuery, IQueryResultItem, IDatabase, IWatcher, ColumnType } from './expo.sql.wrapper.types';
import createDbContext from './Database';
import TableBuilder from './TableStructor';
import BulkSave from './BulkSave';
import { IQuerySelector, IReturnMethods, IOrderBy, GenericQuery, IJoinOn, IWhere, IHaving, IQueryColumnSelector, IColumnSelector, ArrayIColumnSelector, ArrayAndAliasIColumnSelector } from './QuerySelector';
export default createDbContext;
declare const encrypt: (str: string, key: string) => string, decrypt: (str: string, key: string) => any, oDecrypt: (item: any, tableBuilder?: import("./TableStructor").TableBuilder<any, string>) => any, oEncypt: (item: any, tableBuilder?: import("./TableStructor").TableBuilder<any, string>) => any;
export { TableBuilder, IBaseModule, BulkSave, encrypt, decrypt, oDecrypt, oEncypt };
export type { SingleValue, ArrayValue, NumberValue, StringValue, IQuery, IQueryResultItem, IDatabase, IWatcher, IQuerySelector, IReturnMethods, IOrderBy, GenericQuery, IJoinOn, IWhere, IHaving, IQueryColumnSelector, ColumnType, IColumnSelector, ArrayIColumnSelector, ArrayAndAliasIColumnSelector };
