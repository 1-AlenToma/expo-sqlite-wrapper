import QuerySelector from './QuerySelector';
import { StringBuilder } from './UsefullMethods';
export default class QuerySelectorTranslator {
    selector: QuerySelector<any, string>;
    querySelectorSql: StringBuilder;
    constructor(selector: QuerySelector<any, any>);
    private translateDeleteColumn;
    private translateColumns;
    private translateOthers;
    private translateJoins;
    private translateWhere;
    translateToInnerSelectSql(): string;
    translate(selectType: "SELECT" | "DELETE"): {
        sql: string;
        args: any[];
    };
}
