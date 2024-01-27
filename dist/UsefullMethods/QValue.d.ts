import { IDataBaseExtender } from '../expo.sql.wrapper.types';
import QuerySelector, { Param } from '../QuerySelector';
export default class QValue {
    value?: any;
    value2?: any;
    args?: Param;
    isColumn?: boolean;
    alias?: string;
    isFunction: boolean;
    selector?: QuerySelector<any, any>;
    isInnerSelect?: boolean;
    type: string;
    validate(): void;
    toSqlValue(database: IDataBaseExtender<string>, tableName: string, column?: string): any;
    getInnserSelectorValue(): Promise<void>;
    map<B>(fn: (x: QValue) => B): B[];
    toArray(): any[];
    toType<T>(): T;
    getColumn(jsonExpression: any): string;
    getColumns(jsonExpression: any): any;
    static get Q(): QValue;
    Value(value?: any): this;
    Value2(value?: any): this;
    Args(args: Param): this;
    IsColumn(isColumn: boolean): this;
    Alias(alias: string): this;
    getInnerSelect(param: Param): string;
}
