import { IChildLoader, IId, IQueryResultItem, IDatabase } from "../expo.sql.wrapper.types";
declare const createQueryResultType: <T extends IId<D>, D extends string>(item: any, database: IDatabase<D>, children?: IChildLoader<D>[]) => Promise<IQueryResultItem<T, D>>;
export default createQueryResultType;
