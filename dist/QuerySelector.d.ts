import { IDatabase, IDataBaseExtender, IQueryResultItem, IId, IBaseModule, IChildLoader, NonFunctionPropertyNames, SQLQuery } from "./expo.sql.wrapper.types";
import QuerySelectorTranslator from "./QuerySelectorTranslator";
import { QValue } from "./UsefullMethods";
export type IColumnSelector<T> = (x: T) => any;
export type ArrayIColumnSelector<T> = (x: T) => any[];
export type ArrayAndAliasIColumnSelector<T> = (x: T, as: <B>(column: B, alias: string) => B) => any[];
export type InnerSelect = {
    getInnerSelectSql: () => string;
};
export type IUnionSelectorParameter<T extends IId<D>, D extends string> = {
    querySelector: <T extends IId<D>>(tabelName: D) => IQuerySelector<T, D>;
};
export type IUnionSelector<T extends IId<D>, D extends string> = (x: IUnionSelectorParameter<T, D>) => GlobalIQuerySelector<T, D>;
export type R<T, S extends string> = Record<S, T>;
export type ConcatSeperatorChar = "||" | "+" | "-";
export declare enum Param {
    StartParameter = "#(",
    EqualTo = "#=",
    EndParameter = "#)",
    OR = "#OR",
    AND = "#AND",
    LessThan = "#<",
    GreaterThan = "#>",
    IN = "#IN(",
    Not = "#NOT",
    NULL = "#IS NULL",
    NotNULL = "#IS NOT NULL",
    NotEqualTo = "#!=",
    Contains = "C#like",
    StartWith = "S#like",
    EndWith = "E#like",
    EqualAndGreaterThen = "#>=",
    EqualAndLessThen = "#<=",
    OrderByDesc = "#Order By #C DESC",
    OrderByAsc = "#Order By #C ASC",
    Limit = "#Limit #Counter",
    GroupBy = "#GROUP BY",
    InnerJoin = "#INNER JOIN",
    LeftJoin = "#LEFT JOIN",
    RightJoin = "#RIGHT JOIN",
    CrossJoin = "#CROSS JOIN",
    Join = "#JOIN",
    Max = "#MAX",
    Min = "#MIN",
    Count = "#COUNT",
    Sum = "#SUM",
    Total = "#Total",
    GroupConcat = "#GroupConcat",
    Avg = "#AVG",
    Between = "#BETWEEN",
    Value = "#Value",
    Concat = "#Concat",
    Union = "#UNION",
    UnionAll = "#UNION ALL",
    Case = "#CASE",
    When = "#WHEN",
    Then = "#THEN",
    Else = "#ELSE",
    EndCase = "#END"
}
export declare type SingleValue = string | number | boolean | Date | undefined | null;
export declare type ArrayValue = any[] | undefined;
export declare type NumberValue = number | undefined;
export declare type StringValue = string | undefined;
export type GlobalIQuerySelector<T, D extends string> = {
    /**
     * get the translated sql
     */
    getSql: (sqlType: "DELETE" | "SELECT") => SQLQuery;
    getInnerSelectSql: () => string;
};
export interface IReturnMethods<T, D extends string> extends GlobalIQuerySelector<T, D> {
    firstOrDefault: () => Promise<IQueryResultItem<T, D> | undefined>;
    toList: () => Promise<IQueryResultItem<T, D>[]>;
    findOrSave: (item: T & IBaseModule<D>) => Promise<IQueryResultItem<T, D>>;
    /**
     * delete based on Query above.
     */
    delete: () => Promise<void>;
}
export interface IOrderBy<T, ReturnType> {
    /**
     * OrderByDesc COLUMN OR COLUMNS
     */
    OrderByDesc: (columnName: IColumnSelector<T> | ArrayIColumnSelector<T>) => ReturnType;
    /**
     * OrderByAsc COLUMN OR COLUMNS
     */
    OrderByAsc: (columnName: IColumnSelector<T> | ArrayIColumnSelector<T>) => ReturnType;
    /**
     * Limit the rows
     */
    Limit: (value: number) => ReturnType;
    /**
     * GroupBy column or columns
     */
    GroupBy: (columnName: IColumnSelector<T> | ArrayIColumnSelector<T>) => ReturnType;
}
export interface GenericQuery<T, ParentType, D extends string, ReturnType> extends IReturnMethods<ParentType, D>, IOrderBy<T, ReturnType> {
    /**
     * Select based on Column
     */
    Column: (column: IColumnSelector<T>) => ReturnType;
    /**
     * Bring togather columns and values, seperated by ConcatSeperatorChar
     */
    Concat: (collectCharacters_type: ConcatSeperatorChar, ...columnOrValues: (IColumnSelector<T> | string)[]) => ReturnType;
    /**
     * Add BETWEEN
     */
    Between(value1: SingleValue | IColumnSelector<T>, value2: SingleValue | IColumnSelector<T>): ReturnType;
    /**
     * EqualTo based on value or column from a table
     */
    EqualTo: (value: SingleValue | IColumnSelector<T> | InnerSelect) => ReturnType;
    /**
     * Contains based on value or column from a table
     */
    Contains: (value: StringValue | IColumnSelector<T>) => ReturnType;
    /**
     * StartsWith based on value or column from a table
     */
    StartsWith: (value: StringValue | IColumnSelector<T>) => ReturnType;
    /**
     * EndsWith based on value or column from a table
     */
    EndsWith: (value: StringValue | IColumnSelector<T>) => ReturnType;
    /**
     * NotEqualTo based on value or column from a table
     */
    NotEqualTo: (value: SingleValue | IColumnSelector<T> | InnerSelect) => ReturnType;
    /**
     * EqualAndGreaterThen based on value or column from a table
     */
    EqualAndGreaterThen: (value: NumberValue | StringValue | IColumnSelector<T> | InnerSelect) => ReturnType;
    /**
     * EqualAndLessThen based on value or column from a table
     */
    EqualAndLessThen: (value: NumberValue | StringValue | IColumnSelector<T> | InnerSelect) => ReturnType;
    /**
     * Add (
     */
    Start: ReturnType;
    /**
     * Add )
     */
    End: ReturnType;
    /**
     * Add OR
     */
    OR: ReturnType;
    /**
     * Add AND
     */
    AND: ReturnType;
    /**
     * GreaterThan based on value or column from a table
     */
    GreaterThan: (value: NumberValue | StringValue | IColumnSelector<T> | InnerSelect) => ReturnType;
    /**
     * LessThan based on value or column from a table
     */
    LessThan: (value: NumberValue | StringValue | IColumnSelector<T> | InnerSelect) => ReturnType;
    /**
     * IN based on array Value or column from a table
     */
    IN: (value: ArrayValue | IColumnSelector<T> | InnerSelect) => ReturnType;
    /**
     * Add NOT
     */
    Not: ReturnType;
    /**
     * Add IS NULL
     */
    Null: ReturnType;
    /**
     * Add IS NOT NULL
     */
    NotNull: ReturnType;
    /**
     * select columns and aggregators
     */
    Select: IQueryColumnSelector<T, ParentType, D>;
    /**
     * Add Union Select
     */
    Union: <B extends IId<D>>(...queryselectors: IUnionSelector<B, D>[]) => ReturnType;
    /**
     * Add UnionAll Select
     */
    UnionAll: <B extends IId<D>>(...queryselectors: IUnionSelector<B, D>[]) => ReturnType;
    /**
     * start case
     */
    Case: GenericQueryWithValue<ReturnType> & ReturnType;
    /**
     * add When, work with case
     */
    When: GenericQueryWithValue<ReturnType> & ReturnType;
    /**
     * add Then, work with case
     */
    Then: GenericQueryWithValue<ReturnType> & ReturnType;
    /**
     * add Else, work with case
     */
    Else: GenericQueryWithValue<ReturnType> & ReturnType;
    /**
     * end case, work with case
     */
    EndCase: GenericQueryWithValue<ReturnType> & ReturnType;
    /**
     * Load Child or children
     */
    LoadChildren: <B extends IId<D>>(child: D, childColumn: NonFunctionPropertyNames<B>, parentColumn: NonFunctionPropertyNames<ParentType>, assignTo: NonFunctionPropertyNames<ParentType>, isArray?: boolean) => ReturnType;
}
export type GenericQueryWithValue<ReturnType> = {
    /**
     * Add simple Value, work best with case and else
     */
    Value: (value: SingleValue) => ReturnType;
};
export interface ISelectCase<T, ParentType, D extends string> extends Omit<GenericQuery<T, ParentType, D, ISelectCase<T, ParentType, D>>, "EndCase" | "getSql" | "getInnerSelectSql" | "Select" | "OrderByDesc" | "OrderByAsc" | "Limit" | "Union" | "UnionAll" | "GroupBy" | "Select" | "toList" | "firstOrDefault" | "findOrSave" | "delete"> {
    EndCase: IQueryColumnSelector<T, ParentType, D>;
}
export interface IJoinOn<T, ParentType, D extends string> extends Omit<GenericQuery<T, ParentType, D, IJoinOn<T, ParentType, D>>, "GroupBy" | "Select" | "toList" | "firstOrDefault" | "findOrSave" | "delete"> {
    /**
     * Inner join a table
     * eg InnerJoin<TableB, "b">("TableB", "b").Column(x=> x.a.id).EqualTo(x=> x.b.parentId)...
     */
    InnerJoin: <B, S extends string>(tableName: D, alias: S) => IJoinOn<T & R<B, S>, ParentType, D>;
    /**
     * left join a table
     * eg LeftJoin<TableB, "b">("TableB", "b").Column(x=> x.a.id).EqualTo(x=> x.b.parentId)...
     */
    LeftJoin: <B, S extends string>(tableName: D, alias: S) => IJoinOn<T & R<B, S>, ParentType, D>;
    /**
     * join a table
     * eg Join<TableB, "b">("TableB", "b").Column(x=> x.a.id).EqualTo(x=> x.b.parentId)...
     * This will overwrite the above where, so use the Where that is returned by Join method instead
     */
    Join: <B, S extends string>(tableName: D, alias: S) => IJoinOn<T & R<B, S>, ParentType, D>;
    /**
     * CrossJoin a table
     * eg CrossJoin<TableB, "b">("TableB", "b").Column(x=> x.a.id).EqualTo(x=> x.b.parentId)...
     * This will overwrite the above where, so use the Where that is returned by CrossJoin method instead
     */
    CrossJoin: <B, S extends string>(tableName: D, alias: S) => IJoinOn<T & R<B, S>, ParentType, D>;
    /**
     * right join a table
     * eg RightJoin<TableB, "b">("TableB", "b").Column(x=> x.a.id).EqualTo(x=> x.b.parentId)...
     * sqlite dose not currently support this
     */
    Where: IWhere<T, ParentType, D>;
}
export type IWhere<T, ParentType, D extends string> = {
    /**
     * incase you join data, then you will need to cast or convert the result to other type
     */
    Cast: <B>(converter?: (x: ParentType | unknown) => B) => IReturnMethods<B, D>;
} & GenericQuery<T, ParentType, D, IWhere<T, ParentType, D>>;
export interface IHaving<T, ParentType, D extends string> extends Omit<GenericQuery<T, ParentType, D, IHaving<T, ParentType, D>>, "Select" | "Column"> {
    Column: (columnOrAlias: IColumnSelector<T> | string) => IHaving<T, ParentType, D>;
    /**
     * incase you join data, then you will need to cast or convert the result to other type
     */
    Cast: <B>(converter?: (x: ParentType | unknown) => B) => IReturnMethods<B, D>;
}
export interface IQuerySelector<T, D extends string> extends IReturnMethods<T, D>, Omit<IOrderBy<T, IQuerySelector<T, D>>, "GroupBy"> {
    /**
     * Inner join a table
     * eg InnerJoin<TableB, "b">("TableB", "b").Column(x=> x.a.id).EqualTo(x=> x.b.parentId)...
     */
    Where: IWhere<T, T, D>;
    /**
     * Inner join a table
     * eg InnerJoin<TableB, "b">("TableB", "b").Column(x=> x.a.id).EqualTo(x=> x.b.parentId)...
     * This will overwrite the above where, so use the Where that is returned by InnerJoin method instead
     */
    InnerJoin: <B, S extends string>(tableName: D, alias: S) => IJoinOn<R<T, "a"> & R<B, S>, T, D>;
    /**
     * left join a table
     * eg LeftJoin<TableB, "b">("TableB", "b").Column(x=> x.a.id).EqualTo(x=> x.b.parentId)...
     * This will overwrite the above where, so use the Where that is returned by LeftJoin method instead
     */
    LeftJoin: <B, S extends string>(tableName: D, alias: S) => IJoinOn<R<T, "a"> & R<B, S>, T, D>;
    /**
     * join a table
     * eg Join<TableB, "b">("TableB", "b").Column(x=> x.a.id).EqualTo(x=> x.b.parentId)...
     * This will overwrite the above where, so use the Where that is returned by Join method instead
     */
    Join: <B, S extends string>(tableName: D, alias: S) => IJoinOn<R<T, "a"> & R<B, S>, T, D>;
    /**
     * CrossJoin a table
     * eg CrossJoin<TableB, "b">("TableB", "b").Column(x=> x.a.id).EqualTo(x=> x.b.parentId)...
     * This will overwrite the above where, so use the Where that is returned by CrossJoin method instead
     */
    CrossJoin: <B, S extends string>(tableName: D, alias: S) => IJoinOn<R<T, "a"> & R<B, S>, T, D>;
    /**
     * Add Union Select
     */
    Union: <B extends IId<D>>(...queryselectors: IUnionSelector<B, D>[]) => IQuerySelector<T, D>;
    /**
     * Add UnionAll Select
     */
    UnionAll: <B extends IId<D>>(...queryselectors: IUnionSelector<B, D>[]) => IQuerySelector<T, D>;
    /**
     * Load Child or children
     */
    LoadChildren: <B extends IId<D>>(child: D, childColumn: NonFunctionPropertyNames<B>, parentColumn: NonFunctionPropertyNames<T>, assignTo: NonFunctionPropertyNames<T>, isArray?: boolean) => IQuerySelector<T, D>;
    Select: IQueryColumnSelector<T, T, D>;
}
export interface IQueryColumnSelector<T, ParentType, D extends string> extends IReturnMethods<ParentType, D> {
    /**
     * start a case, and end it with CaseEnd()
     */
    Case: (alias: string) => ISelectCase<T, ParentType, D>;
    /**
     * Default is select * from
     * you can specify the columns here
     */
    Columns: (columns: ArrayAndAliasIColumnSelector<T>) => IQueryColumnSelector<T, ParentType, D>;
    /**
     * sqlite aggrigator from Max
     */
    Max: (columns: IColumnSelector<T>, alias: string) => IQueryColumnSelector<T, ParentType, D>;
    /**
     * sqlite aggrigator from Min
     */
    Min: (columns: IColumnSelector<T>, alias: string) => IQueryColumnSelector<T, ParentType, D>;
    /**
     * sqlite aggrigator from Count
     */
    Count: (columns: IColumnSelector<T>, alias: string) => IQueryColumnSelector<T, ParentType, D>;
    /**
     * sqlite aggrigator from Sum
     */
    Sum: (columns: IColumnSelector<T>, alias: string) => IQueryColumnSelector<T, ParentType, D>;
    /**
     * sqlite aggrigator from Total
     */
    Total: (columns: IColumnSelector<T>, alias: string) => IQueryColumnSelector<T, ParentType, D>;
    /**
     * sqlite concat columns and values eg lastname || ' ' || firstName as FullName;
     */
    Concat: (alias: string, collectCharacters_type: ConcatSeperatorChar, ...columnOrValues: (IColumnSelector<T> | string)[]) => IQueryColumnSelector<T, ParentType, D>;
    /**
     * sqlite aggrigator from group_concat
     */
    GroupConcat: (columns: IColumnSelector<T>, alias: string, seperator?: string) => IQueryColumnSelector<T, ParentType, D>;
    /**
     * sqlite aggrigator from Avg
     */
    Avg: (columns: IColumnSelector<T>, alias: string) => IQueryColumnSelector<T, ParentType, D>;
    /**
     * incase you join data, then you will need to cast or convert the result to other type
     */
    Cast: <B>(converter?: (x: T | unknown) => B) => IReturnMethods<B, D>;
    /**
     * add having search
     */
    Having: IHaving<T, ParentType, D>;
}
declare class ReturnMethods<T, ParentType extends IId<D>, D extends string> {
    parent: QuerySelector<ParentType, D>;
    constructor(parent: QuerySelector<any, D>);
    firstOrDefault(): Promise<IQueryResultItem<ParentType, D>>;
    toList(): Promise<IQueryResultItem<ParentType, D>[]>;
    findOrSave(item: ParentType & IBaseModule<D>): Promise<IQueryResultItem<ParentType, D>>;
    delete(): Promise<void>;
    /**
     * get the translated sqlQuery
     */
    getSql(sqlType: "DELETE" | "SELECT"): {
        sql: string;
        args: any[];
    };
    /**
     * get a simple sql
     * @returns sql string
     */
    getInnerSelectSql(): string;
}
declare class QueryColumnSelector<T, ParentType extends IId<D>, D extends string> extends ReturnMethods<T, ParentType, D> {
    columns: QValue[];
    cases: ISelectCase<T, ParentType, D>[];
    constructor(parent: QuerySelector<any, D>);
    Case(alias: string): ISelectCase<T, ParentType, D>;
    Cast<B>(converter: (x: ParentType | unknown) => B): IReturnMethods<ParentType, D>;
    Columns(columns: ArrayAndAliasIColumnSelector<T>): this;
    Concat(alias: string, collectCharacters_type: ConcatSeperatorChar, ...columnOrValues: (IColumnSelector<T> | string)[]): this;
    Max(columns: IColumnSelector<T>, alias: string): this;
    Min(columns: IColumnSelector<T>, alias: string): this;
    Count(columns: IColumnSelector<T>, alias: string): this;
    Sum(columns: IColumnSelector<T>, alias: string): this;
    Total(columns: IColumnSelector<T>, alias: string): this;
    GroupConcat(columns: IColumnSelector<T>, alias: string, seperator?: string): this;
    Avg(columns: IColumnSelector<T>, alias: string): this;
    get Having(): IHaving<T, ParentType, D>;
}
export declare class Where<T, ParentType extends IId<D>, D extends string> extends ReturnMethods<T, ParentType, D> {
    tableName: D;
    alias?: string;
    Queries: QValue[];
    type: string;
    constructor(tableName: D, parent: QuerySelector<any, D>, alias?: string, ...queries: (Param | QValue)[]);
    LoadChildren<B extends IId<D>>(child: D, childColumn: NonFunctionPropertyNames<B>, parentColumn: NonFunctionPropertyNames<ParentType>, assignTo: NonFunctionPropertyNames<ParentType>, isArray?: boolean): this;
    get Case(): this;
    get When(): this;
    get Then(): this;
    get EndCase(): this;
    get Else(): this;
    Value(value: SingleValue): this;
    Between(value1: SingleValue | IColumnSelector<T>, value2: SingleValue | IColumnSelector<T>): this;
    Cast<B>(converter: (x: ParentType | unknown) => B): IReturnMethods<ParentType, D>;
    get Select(): QueryColumnSelector<any, any, D>;
    Column(column: IColumnSelector<T> | string): this;
    Concat(collectCharacters_type: ConcatSeperatorChar, ...columnOrValues: (IColumnSelector<T> | string)[]): this;
    EqualTo(value: SingleValue | IColumnSelector<T> | InnerSelect): this;
    NotEqualTo(value: SingleValue | IColumnSelector<T> | InnerSelect): this;
    EqualAndGreaterThen(value: NumberValue | StringValue | InnerSelect): this;
    EqualAndLessThen(value: NumberValue | StringValue | IColumnSelector<T> | InnerSelect): this;
    get Start(): this;
    get End(): this;
    get OR(): this;
    get AND(): this;
    GreaterThan(value: NumberValue | StringValue | IColumnSelector<T> | InnerSelect): this;
    LessThan(value: NumberValue | StringValue | IColumnSelector<T> | InnerSelect): this;
    IN(value: ArrayValue | IColumnSelector<T> | InnerSelect): this;
    get Not(): this;
    get Null(): this;
    get NotNull(): this;
    Contains(value: StringValue | IColumnSelector<T>): this;
    StartsWith(value: StringValue | IColumnSelector<T>): this;
    EndsWith(value: StringValue | IColumnSelector<T>): this;
    OrderByAsc(columnName: IColumnSelector<T> | ArrayIColumnSelector<T>): this;
    OrderByDesc(columnName: IColumnSelector<T> | ArrayIColumnSelector<T>): this;
    Limit(value: number): this;
    GroupBy(columnName: IColumnSelector<T> | ArrayIColumnSelector<T>): this;
    InnerJoin<B, S extends string>(tableName: D, alias: S): IJoinOn<T & R<B, S>, T, D>;
    CrossJoin<B, S extends string>(tableName: D, alias: S): IJoinOn<T & R<B, S>, T, D>;
    LeftJoin<B, S extends string>(tableName: D, alias: S): IJoinOn<T & R<B, S>, T, D>;
    Join<B, S extends string>(tableName: D, alias: S): IJoinOn<T & R<B, S>, T, D>;
    RightJoin<B, S extends string>(tableName: D, alias: S): IJoinOn<T & R<B, S>, T, D>;
    Union<B extends IId<D>>(...queryselectors: IUnionSelector<B, D>[]): this;
    UnionAll<B extends IId<D>>(...queryselectors: IUnionSelector<B, D>[]): this;
    get Where(): IWhere<T, T, D>;
}
export default class QuerySelector<T extends IId<D>, D extends string> {
    where?: Where<any, any, D>;
    having?: Where<any, any, D>;
    joins: Where<any, any, D>[];
    unions: {
        type: Param.Union | Param.UnionAll;
        value: GlobalIQuerySelector<T, D>;
    }[];
    tableName: D;
    alias: string;
    queryColumnSelector?: QueryColumnSelector<any, any, D>;
    database: IDataBaseExtender<D>;
    jsonExpression: any;
    others: QValue[];
    type: string;
    translator?: QuerySelectorTranslator;
    children: IChildLoader<D>[];
    converter?: (x: any) => any;
    constructor(tableName: D, database: IDatabase<D>);
    clear(): void;
    buildJsonExpression(tableName: D, alias: string, isInit?: boolean): void;
    get Select(): QueryColumnSelector<any, any, D>;
    Union<B extends IId<D>>(...queryselectors: IUnionSelector<B, D>[]): this;
    UnionAll<B extends IId<D>>(...queryselectors: IUnionSelector<B, D>[]): this;
    InnerJoin<B, S extends string>(tableName: D, alias: S): IJoinOn<R<T, "a"> & R<B, S>, T, D>;
    CrossJoin<B, S extends string>(tableName: D, alias: S): IJoinOn<R<T, "a"> & R<B, S>, T, D>;
    LeftJoin<B, S extends string>(tableName: D, alias: S): IJoinOn<R<T, "a"> & R<B, S>, T, D>;
    Join<B, S extends string>(tableName: D, alias: S): IJoinOn<R<T, "a"> & R<B, S>, T, D>;
    RightJoin<B, S extends string>(tableName: D, alias: S): IJoinOn<R<T, "a"> & R<B, S>, T, D>;
    LoadChildren<B extends IId<D>>(child: D, childColumn: NonFunctionPropertyNames<B>, parentColumn: NonFunctionPropertyNames<T>, assignTo: NonFunctionPropertyNames<T>, isArray?: boolean): this;
    delete(): Promise<void>;
    findOrSave(item: T & IBaseModule<D>): Promise<IQueryResultItem<T, D>>;
    firstOrDefault(): Promise<IQueryResultItem<T, D>>;
    toList(): Promise<IQueryResultItem<T, D>[]>;
    getSql(sqlType: "SELECT" | "DELETE"): {
        sql: string;
        args: any[];
    };
    getInnerSelectSql(): string;
    OrderByAsc(columnName: IColumnSelector<T> | ArrayIColumnSelector<T>): this;
    OrderByDesc(columnName: IColumnSelector<T> | ArrayIColumnSelector<T>): this;
    Limit(value: number): this;
    GroupBy(columnName: IColumnSelector<T> | ArrayIColumnSelector<T>): void;
    get Where(): Where<any, any, D>;
}
export {};
