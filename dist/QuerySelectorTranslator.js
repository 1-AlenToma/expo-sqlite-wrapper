"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuerySelector_1 = require("./QuerySelector");
const UsefullMethods_1 = require("./UsefullMethods");
class QuerySelectorTranslator {
    constructor(selector) {
        this.selector = selector;
        this.querySelectorSql = new UsefullMethods_1.StringBuilder();
    }
    translateDeleteColumn() {
        let sql = new UsefullMethods_1.StringBuilder();
        return sql.append("DELETE FROM", this.selector.tableName);
    }
    translateColumns(args) {
        var _a;
        let sql = new UsefullMethods_1.StringBuilder();
        if (!this.selector.queryColumnSelector)
            return sql.append("SELECT * FROM", this.selector.tableName, this.selector.joins.length > 0 ? "as a" : "");
        const counter = new UsefullMethods_1.Counter(this.selector.queryColumnSelector.columns);
        let addedColumns = false;
        while (counter.hasNext) {
            const value = counter.next;
            switch (value.args) {
                case QuerySelector_1.Param.Count:
                    sql.append(`count(${value.getColumn(this.selector.jsonExpression)})`, "as", value.alias, ",");
                    break;
                case QuerySelector_1.Param.Min:
                    sql.append(`min(${value.getColumn(this.selector.jsonExpression)})`, "as", value.alias, ",");
                    break;
                case QuerySelector_1.Param.Max:
                    sql.append(`max(${value.getColumn(this.selector.jsonExpression)})`, "as", value.alias, ",");
                    break;
                case QuerySelector_1.Param.Sum:
                    sql.append(`sum(${value.getColumn(this.selector.jsonExpression)})`, "as", value.alias, ",");
                    break;
                case QuerySelector_1.Param.Avg:
                    sql.append(`avg(${value.getColumn(this.selector.jsonExpression)})`, "as", value.alias, ",");
                    break;
                case QuerySelector_1.Param.Total:
                    sql.append(`total(${value.getColumn(this.selector.jsonExpression)})`, "as", value.alias, ",");
                    break;
                case QuerySelector_1.Param.GroupConcat:
                    sql.append(`group_concat(${value.getColumn(this.selector.jsonExpression)}${value.value2 ? `,'${value.value2}'` : ""})`, "as", value.alias, ",");
                    break;
                case QuerySelector_1.Param.Concat:
                    const arr = value.map(x => { var _a, _b; return x.isFunction ? x.getColumn(this.selector.jsonExpression) : `'${((_b = (_a = x.value) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "")}'`; }).filter(x => x.length > 0).join(` ${(_a = value.value2) !== null && _a !== void 0 ? _a : "||"} `);
                    sql.append(arr, "as", value.alias, ",");
                    break;
                default:
                    addedColumns = true;
                    sql.append(value.getColumn(this.selector.jsonExpression), ",");
                    break;
            }
        }
        this.selector.queryColumnSelector.cases.forEach(x => {
            const item = x;
            const c = this.translateWhere(item, args);
            if (!c.isEmpty)
                sql.append("(", c.toString(), ")", "as", item.alias);
        });
        if (!addedColumns && !sql.isEmpty)
            sql.append("*");
        if (sql.isEmpty)
            return sql.append("SELECT * FROM", this.selector.tableName, this.selector.joins.length > 0 ? "as a" : "");
        return sql.trimEnd(",").prepend("SELECT").append("FROM", this.selector.tableName, this.selector.joins.length > 0 ? "as a" : "");
    }
    translateOthers() {
        const counter = new UsefullMethods_1.Counter(this.selector.others.filter(x => x.args != QuerySelector_1.Param.GroupBy));
        let sql = new UsefullMethods_1.StringBuilder();
        if (counter.length <= 0)
            return sql;
        const orderBy = [];
        let limit = "";
        while (counter.hasNext) {
            const value = counter.next;
            switch (value.args) {
                case QuerySelector_1.Param.OrderByAsc:
                case QuerySelector_1.Param.OrderByDesc:
                    const columns = value.getColumns(this.selector.jsonExpression);
                    columns.forEach(c => {
                        orderBy.push(`${c} ${value.args === QuerySelector_1.Param.OrderByAsc ? "ASC" : "DESC"}`);
                    });
                    break;
                case QuerySelector_1.Param.Limit:
                    limit = value.args.toString().substring(1).replace("#Counter", value.value.toString());
                    break;
            }
        }
        if (orderBy.length > 0) {
            sql.append("ORDER BY", orderBy.join(", "));
        }
        if (limit.length > 0)
            sql.append(limit);
        return sql;
    }
    translateJoins(args) {
        const counter = new UsefullMethods_1.Counter(this.selector.joins);
        let sql = new UsefullMethods_1.StringBuilder();
        if (counter.length <= 0)
            return sql;
        while (counter.hasNext) {
            const value = counter.next;
            const joinType = value.Queries[0];
            const joinWhere = this.translateWhere(value, args);
            if (!joinWhere.isEmpty)
                sql.append(`${joinType.args.substring(1)} ${value.tableName} as ${value.alias} ON ${joinWhere.toString()}`);
            else
                sql.append(`${joinType.args.substring(1)} ${value.tableName} as ${value.alias}`);
        }
        return sql;
    }
    translateWhere(item, args) {
        var _a;
        const counter = new UsefullMethods_1.Counter(item.Queries);
        let sql = new UsefullMethods_1.StringBuilder();
        const findColumn = () => {
            for (let i = counter.currentIndex; i >= 0; i--) {
                const value = counter.index(i);
                if (value && value.isColumn)
                    return value.getColumn(this.selector.jsonExpression);
            }
            return undefined;
        };
        while (counter.hasNext) {
            const value = counter.next;
            let column = findColumn();
            ;
            const arrValue = value.map(x => x);
            switch (value.args) {
                case QuerySelector_1.Param.EqualTo:
                case QuerySelector_1.Param.LessThan:
                case QuerySelector_1.Param.GreaterThan:
                case QuerySelector_1.Param.IN:
                case QuerySelector_1.Param.NotEqualTo:
                case QuerySelector_1.Param.EqualAndGreaterThen:
                case QuerySelector_1.Param.EqualAndLessThen:
                    sql.append(value.args.substring(1));
                    if ((!value.isFunction && !value.isColumn) || value.isInnerSelect) {
                        {
                            if (value.isInnerSelect) {
                                if (value.args.indexOf("(") != -1)
                                    sql.append(value.getInnerSelect(value.args), ")");
                                else
                                    sql.append(value.getInnerSelect(value.args));
                            }
                            else {
                                if (value.args.indexOf("(") != -1)
                                    sql.append(arrValue.map(x => "?").join(", "), ")");
                                else
                                    sql.append("?");
                                args.push(...arrValue.map(x => UsefullMethods_1.Functions.translateAndEncrypt(x.value, this.selector.database, item.tableName, column)));
                            }
                        }
                    }
                    else {
                        if (value.args.indexOf("(") != -1)
                            sql.append(arrValue.map(x => x.getColumn(this.selector.jsonExpression)).join(", "), ")");
                        else
                            sql.append(value.getColumn(this.selector.jsonExpression));
                    }
                    break;
                case QuerySelector_1.Param.NotNULL:
                case QuerySelector_1.Param.NULL:
                case QuerySelector_1.Param.OR:
                case QuerySelector_1.Param.AND:
                case QuerySelector_1.Param.StartParameter:
                case QuerySelector_1.Param.EndParameter:
                case QuerySelector_1.Param.Not:
                case QuerySelector_1.Param.Between:
                case QuerySelector_1.Param.Case:
                case QuerySelector_1.Param.When:
                case QuerySelector_1.Param.Then:
                case QuerySelector_1.Param.EndCase:
                case QuerySelector_1.Param.Else:
                    sql.append(value.args.substring(1));
                    break;
                case QuerySelector_1.Param.Value:
                    if (value.isFunction || value.isColumn) {
                        sql.append(value.getColumn(this.selector.jsonExpression));
                    }
                    else {
                        sql.append("?");
                        args.push(UsefullMethods_1.Functions.translateToSqliteValue(value.value));
                    }
                    break;
                case QuerySelector_1.Param.Concat:
                    const arr = value.map(x => { var _a, _b; return x.isFunction ? x.getColumn(this.selector.jsonExpression) : `'${((_b = (_a = x.value) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "")}'`; }).filter(x => x.length > 0).join(` ${(_a = value.value2) !== null && _a !== void 0 ? _a : "||"} `);
                    sql.append(arr);
                    break;
                case QuerySelector_1.Param.Contains:
                case QuerySelector_1.Param.StartWith:
                case QuerySelector_1.Param.EndWith:
                    let v = value.isFunction ? value.getColumn(this.selector.jsonExpression) : UsefullMethods_1.Functions.translateAndEncrypt(value.value, this.selector.database, this.selector.tableName, column);
                    if (value.args === QuerySelector_1.Param.Contains)
                        v = value.isFunction ? `'%' + ${v} + '%'` : `%${v}%`;
                    else if (value.args === QuerySelector_1.Param.StartWith)
                        v = value.isFunction ? `${v} + '%'` : `${v}%`;
                    else
                        v = value.isFunction ? `'%' +${v}` : `%${v}`;
                    if (!value.isFunction) {
                        sql.append("like", "?");
                        args.push(v);
                    }
                    else {
                        sql.append("like", v);
                    }
                    break;
                default:
                    if (value.isFunction || value.isColumn)
                        sql.append(value.getColumn(this.selector.jsonExpression));
                    break;
            }
        }
        return sql;
    }
    translateToInnerSelectSql() {
        const sqlQuery = this.translate("SELECT");
        const sql = new UsefullMethods_1.StringBuilder(sqlQuery.sql);
        const args = [...sqlQuery.args];
        const tempQuestionMark = "#questionMark";
        const c = "?";
        while (sql.indexOf(c) !== -1 && args.length > 0) {
            {
                let value = args.shift();
                if (UsefullMethods_1.Functions.isDefained(value) && typeof value === "string") {
                    if (value.indexOf(c) !== -1)
                        value = value.replace(new RegExp("\\" + c, "gmi"), tempQuestionMark);
                    value = `'${value}'`;
                }
                if (!UsefullMethods_1.Functions.isDefained(value))
                    value = "NULL";
                sql.replaceIndexOf(c, value.toString());
            }
        }
        return sql.toString().replace(new RegExp(tempQuestionMark, "gmi"), c);
    }
    translate(selectType) {
        try {
            const args = [];
            const selectcColumnSql = selectType == "DELETE" ? this.translateDeleteColumn() : this.translateColumns(args);
            const whereSql = this.selector.where ? this.translateWhere(this.selector.where, args) : new UsefullMethods_1.StringBuilder();
            const groupBy = this.selector.others.filter(x => x.args === QuerySelector_1.Param.GroupBy).map(x => x.getColumn(this.selector.jsonExpression));
            const otherSql = this.translateOthers();
            const joinSql = selectType === "SELECT" ? this.translateJoins(args) : new UsefullMethods_1.StringBuilder();
            const havingSql = this.selector.having && selectType === "SELECT" ? this.translateWhere(this.selector.having, args) : new UsefullMethods_1.StringBuilder();
            const sql = new UsefullMethods_1.StringBuilder(selectcColumnSql.toString().trim());
            if (!joinSql.isEmpty && selectType == "SELECT")
                sql.append(joinSql.toString().trim());
            if (!whereSql.isEmpty)
                sql.append("WHERE", whereSql.toString().trim());
            if (groupBy.length > 0 && selectType == "SELECT")
                sql.append("GROUP BY", groupBy.join(", "));
            if (!havingSql.isEmpty && selectType == "SELECT")
                sql.append("HAVING", havingSql.toString().trim());
            if (!otherSql.isEmpty && selectType == "SELECT")
                sql.append(otherSql.toString().trim());
            if (selectType == "SELECT" && this.selector.unions.length > 0) {
                this.selector.unions.forEach(x => {
                    const q = x.value.getSql("SELECT");
                    sql.append(x.type.substring(1), q.sql);
                    q.args.forEach(a => args.push(a));
                });
            }
            return { sql: sql.toString().trim(), args: args };
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
}
exports.default = QuerySelectorTranslator;
//# sourceMappingURL=QuerySelectorTranslator.js.map