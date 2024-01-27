"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = exports.getColumns = void 0;
const expo_sql_wrapper_types_1 = require("./expo.sql.wrapper.types");
const UsefullMethods_1 = require("./UsefullMethods");
const UsefullMethods_2 = require("./UsefullMethods");
class ChildQueryLoader {
    constructor(parent, tableName) {
        this.parent = parent;
        this.tableName = tableName;
    }
    With(columnName) {
        var child = this.parent.Children[this.parent.Children.length - 1];
        child.childProperty = (0, exports.getColumns)("function " + columnName.toString());
        child.childTableName = this.tableName;
        return this;
    }
    AssignTo(columnName) {
        var child = this.parent.Children[this.parent.Children.length - 1];
        child.assignTo = (0, exports.getColumns)("function " + columnName.toString());
        return this.parent;
    }
}
const isColumnFunc = (value) => {
    if (UsefullMethods_2.Functions.isFunc(value) && value.toString().indexOf("_column ") !== -1)
        return true;
    return false;
};
const getColumns = (fn) => {
    if (!UsefullMethods_2.Functions.isFunc(fn))
        return fn;
    var str = fn.toString();
    if (str.indexOf('.') !== -1) {
        str = str.substring(str.indexOf('.') + 1);
    }
    if (str.indexOf('[') !== -1) {
        str = str.substring(str.indexOf('[') + 1);
    }
    str = str.replace(/\]|'|"|\+|return|;|\.|\}|\{|\(|\)|function|_column| /gim, '').replace(/\r?\n|\r/g, "");
    return str;
};
exports.getColumns = getColumns;
class Query {
    constructor(tableName, database) {
        this.Queries = [];
        this.Children = [];
        this.currentIndex = 0;
        this.database = database;
        this.tableName = tableName;
    }
    //#region private methods
    hasNext(queries) {
        return queries.length > 0 && this.currentIndex < queries.length;
    }
    prevColumn(queries) {
        for (let i = this.currentIndex; i >= this.currentIndex - 3; i--) {
            if (i < 0)
                return undefined;
            const v = queries[i];
            if (isColumnFunc(v))
                return (0, exports.getColumns)(v);
        }
        return undefined;
    }
    prevValue(queries) {
        if (this.currentIndex > 1)
            return queries[this.currentIndex - 2];
        return undefined;
    }
    nextValue(queries) {
        return queries.length > 0 ? queries[this.currentIndex] : undefined;
    }
    getLast(queries) {
        if (queries.length > 0)
            return queries[queries.length - 1];
        return undefined;
    }
    cleanLast() {
        var value = undefined;
        while ((value = this.getLast(this.Queries)) != undefined) {
            if (value != expo_sql_wrapper_types_1.Param.AND &&
                value != expo_sql_wrapper_types_1.Param.StartParameter &&
                value != expo_sql_wrapper_types_1.Param.EndParameter &&
                value != expo_sql_wrapper_types_1.Param.OR)
                this.Queries.pop();
            else
                break;
        }
    }
    getValue(queries) {
        var item = queries[this.currentIndex];
        if (this.hasNext(queries))
            this.currentIndex++;
        return item;
    }
    validateValue(value, argstoAdd) {
        if (value === undefined ||
            value === null ||
            (Array.isArray(value) &&
                value.filter((x) => x !== undefined && x !== null).length <= 0)) {
            if (this.Queries.length > 0)
                this.cleanLast();
            return;
        }
        this.Queries.push(argstoAdd);
        this.Queries.push({ queryValue: value });
    }
    validate() {
        var totalLoob = this.Queries.length;
        for (var i = 0; i < totalLoob; i++) {
            var foundError = false;
            if (this.Queries.length <= 0)
                break;
            this.currentIndex = 0;
            let breakit;
            while (this.hasNext(this.Queries)) {
                var pValue = this.prevValue(this.Queries);
                var value = this.getValue(this.Queries);
                var next = this.nextValue(this.Queries);
                switch (value) {
                    case expo_sql_wrapper_types_1.Param.EqualTo:
                    case expo_sql_wrapper_types_1.Param.OR:
                    case expo_sql_wrapper_types_1.Param.AND:
                    case expo_sql_wrapper_types_1.Param.LessThan:
                    case expo_sql_wrapper_types_1.Param.GreaterThan:
                    case expo_sql_wrapper_types_1.Param.IN:
                    case expo_sql_wrapper_types_1.Param.NotIn:
                    case expo_sql_wrapper_types_1.Param.NotEqualTo:
                    case expo_sql_wrapper_types_1.Param.Contains:
                    case expo_sql_wrapper_types_1.Param.StartWith:
                    case expo_sql_wrapper_types_1.Param.EndWith:
                    case expo_sql_wrapper_types_1.Param.EqualAndGreaterThen:
                    case expo_sql_wrapper_types_1.Param.EqualAndLessThen:
                        if (next === undefined) {
                            this.Queries.pop();
                            breakit = true;
                        }
                        break;
                    case expo_sql_wrapper_types_1.Param.StartParameter:
                        if (next == expo_sql_wrapper_types_1.Param.AND || next == expo_sql_wrapper_types_1.Param.OR) {
                            this.Queries.splice(this.currentIndex, 1);
                            breakit = true;
                        }
                        if (next === undefined) {
                            this.Queries.pop();
                            breakit = true;
                        }
                        break;
                    case expo_sql_wrapper_types_1.Param.EndParameter:
                        if (pValue == expo_sql_wrapper_types_1.Param.AND ||
                            pValue == expo_sql_wrapper_types_1.Param.OR ||
                            pValue == expo_sql_wrapper_types_1.Param.StartParameter ||
                            pValue == undefined) {
                            this.Queries.splice(this.currentIndex - 1, 1);
                            breakit = true;
                        }
                        break;
                    case expo_sql_wrapper_types_1.Param.NULL:
                    case expo_sql_wrapper_types_1.Param.NotNULL:
                        break;
                    default: {
                    }
                }
                if (breakit) {
                    foundError = true;
                    break;
                }
            }
            if (!foundError)
                break;
        }
        this.currentIndex = 0;
    }
    //#endregion
    //#region public Methods
    Column(columnName) {
        this.Queries.push("_column function " + columnName.toString());
        return this;
    }
    EqualTo(value) {
        if (this.Queries.length > 0)
            this.validateValue(value, expo_sql_wrapper_types_1.Param.EqualTo);
        return this;
    }
    NotEqualTo(value) {
        if (this.Queries.length > 0)
            this.validateValue(value, expo_sql_wrapper_types_1.Param.NotEqualTo);
        return this;
    }
    EqualAndGreaterThen(value) {
        if (this.Queries.length > 0)
            this.validateValue(value, expo_sql_wrapper_types_1.Param.EqualAndGreaterThen);
        return this;
    }
    EqualAndLessThen(value) {
        if (this.Queries.length > 0)
            this.validateValue(value, expo_sql_wrapper_types_1.Param.EqualAndLessThen);
        return this;
    }
    Start() {
        this.Queries.push(expo_sql_wrapper_types_1.Param.StartParameter);
        return this;
    }
    End() {
        if (this.Queries.length > 0)
            this.Queries.push(expo_sql_wrapper_types_1.Param.EndParameter);
        return this;
    }
    OR() {
        if (this.Queries.length > 0)
            this.Queries.push(expo_sql_wrapper_types_1.Param.OR);
        return this;
    }
    AND() {
        if (this.Queries.length > 0)
            this.Queries.push(expo_sql_wrapper_types_1.Param.AND);
        return this;
    }
    GreaterThan(value) {
        if (this.Queries.length > 0)
            this.validateValue(value, expo_sql_wrapper_types_1.Param.GreaterThan);
        return this;
    }
    LessThan(value) {
        if (this.Queries.length > 0)
            this.validateValue(value, expo_sql_wrapper_types_1.Param.LessThan);
        return this;
    }
    IN(value) {
        if (this.Queries.length > 0)
            this.validateValue(value, expo_sql_wrapper_types_1.Param.IN);
        return this;
    }
    NotIn(value) {
        if (this.Queries.length > 0)
            this.validateValue(value, expo_sql_wrapper_types_1.Param.NotIn);
        return this;
    }
    Null() {
        if (this.Queries.length > 0)
            this.Queries.push(expo_sql_wrapper_types_1.Param.NULL);
        return this;
    }
    NotNull() {
        if (this.Queries.length > 0)
            this.Queries.push(expo_sql_wrapper_types_1.Param.NotNULL);
        return this;
    }
    Contains(value) {
        if (this.Queries.length > 0)
            this.validateValue(value, expo_sql_wrapper_types_1.Param.Contains);
        return this;
    }
    StartWith(value) {
        if (this.Queries.length > 0)
            this.validateValue(value, expo_sql_wrapper_types_1.Param.StartWith);
        return this;
    }
    EndWith(value) {
        if (this.Queries.length > 0)
            this.validateValue(value, expo_sql_wrapper_types_1.Param.EndWith);
        return this;
    }
    OrderByAsc(columnName) {
        this.Queries.push(expo_sql_wrapper_types_1.Param.OrderByAsc);
        this.Queries.push("function " + columnName.toString());
        return this;
    }
    OrderByDesc(columnName) {
        this.Queries.push(expo_sql_wrapper_types_1.Param.OrderByDesc);
        this.Queries.push("function " + columnName.toString());
        return this;
    }
    Limit(value) {
        this.validateValue(value, expo_sql_wrapper_types_1.Param.Limit);
        return this;
    }
    LoadChildren(childTableName, parentProperty) {
        var item = {
            parentProperty: parentProperty,
            parentTable: this.tableName,
            childTableName: childTableName,
            childProperty: '',
            isArray: true,
            assignTo: "",
        };
        this.Children.push(item);
        return new ChildQueryLoader(this, childTableName);
    }
    LoadChild(childTableName, parentProperty) {
        var item = {
            parentProperty: parentProperty,
            parentTable: this.tableName,
            childTableName: childTableName,
            childProperty: '',
            isArray: false,
            assignTo: "",
        };
        this.Children.push(item);
        return new ChildQueryLoader(this, childTableName);
    }
    getQueryResult(operation) {
        if (!operation)
            operation = "SELECT";
        this.validate();
        var queries = [];
        if (operation === "DELETE") {
            for (var i = 0; i < this.Queries.length; i++) {
                const x = this.Queries[i];
                if ((x == expo_sql_wrapper_types_1.Param.Limit || x == expo_sql_wrapper_types_1.Param.OrderByAsc || x == expo_sql_wrapper_types_1.Param.OrderByDesc)) {
                    i++;
                    continue;
                }
                queries.push(x);
            }
        }
        else
            queries = [...this.Queries];
        var addWhere = false;
        for (var i = 0; i < queries.length; i++) {
            const x = queries[i];
            if (x == expo_sql_wrapper_types_1.Param.Limit || x == expo_sql_wrapper_types_1.Param.OrderByAsc || x == expo_sql_wrapper_types_1.Param.OrderByDesc) {
                i++;
                continue;
            }
            else {
                addWhere = true;
                break;
            }
        }
        var result = {
            sql: `${operation} ${operation == "SELECT" ? "* " : ""}FROM ${this.tableName} ${addWhere ? ' WHERE ' : ''}`,
            values: [],
            children: this.Children,
        };
        const appendSql = (s) => {
            result.sql += s + ' ';
        };
        const translate = (value) => {
            var _a;
            const pValue = this.prevValue(queries);
            switch (value) {
                case expo_sql_wrapper_types_1.Param.StartParameter:
                case expo_sql_wrapper_types_1.Param.EqualTo:
                case expo_sql_wrapper_types_1.Param.EndParameter:
                case expo_sql_wrapper_types_1.Param.OR:
                case expo_sql_wrapper_types_1.Param.AND:
                case expo_sql_wrapper_types_1.Param.LessThan:
                case expo_sql_wrapper_types_1.Param.GreaterThan:
                case expo_sql_wrapper_types_1.Param.IN:
                case expo_sql_wrapper_types_1.Param.NotIn:
                case expo_sql_wrapper_types_1.Param.NotEqualTo:
                case expo_sql_wrapper_types_1.Param.NotNULL:
                case expo_sql_wrapper_types_1.Param.NULL:
                case expo_sql_wrapper_types_1.Param.EqualAndGreaterThen:
                case expo_sql_wrapper_types_1.Param.EqualAndLessThen:
                    value = value.toString().substring(1);
                    appendSql(value);
                    break;
                case expo_sql_wrapper_types_1.Param.OrderByAsc:
                case expo_sql_wrapper_types_1.Param.OrderByDesc:
                    appendSql(value.toString().substring(1).replace("#C", (0, exports.getColumns)(this.getValue(queries))));
                    break;
                case expo_sql_wrapper_types_1.Param.Limit:
                    appendSql(value.toString().substring(1).replace("#Counter", this.getValue(queries).queryValue));
                    break;
                case expo_sql_wrapper_types_1.Param.Contains:
                case expo_sql_wrapper_types_1.Param.StartWith:
                case expo_sql_wrapper_types_1.Param.EndWith:
                    appendSql("like");
                    break;
                default: {
                    if (UsefullMethods_2.Functions.isFunc(value))
                        appendSql((_a = (0, exports.getColumns)(value)) !== null && _a !== void 0 ? _a : '');
                    else if (value.queryValue !== undefined && (pValue === expo_sql_wrapper_types_1.Param.IN || pValue == expo_sql_wrapper_types_1.Param.NotIn)) {
                        const prevColumn = this.prevColumn(queries);
                        var v = Array.isArray(value.queryValue)
                            ? value.queryValue
                            : [value.queryValue];
                        appendSql(`( ${v.map((x) => '?').join(',')} )`);
                        v.forEach((x) => {
                            if (x !== undefined)
                                result.values.push(UsefullMethods_2.Functions.translateAndEncrypt(x, this.database, this.tableName, prevColumn));
                        });
                    }
                    else if (value.queryValue !== undefined) {
                        const prevColumn = this.prevColumn(queries);
                        if (pValue == expo_sql_wrapper_types_1.Param.Contains || pValue == expo_sql_wrapper_types_1.Param.StartWith || pValue == expo_sql_wrapper_types_1.Param.EndWith) {
                            if (pValue == expo_sql_wrapper_types_1.Param.Contains)
                                value = { queryValue: `%${UsefullMethods_2.Functions.translateAndEncrypt(value.queryValue, this.database, this.tableName, prevColumn)}%` };
                            else if (pValue == expo_sql_wrapper_types_1.Param.StartWith)
                                value = { queryValue: `${UsefullMethods_2.Functions.translateAndEncrypt(value.queryValue, this.database, this.tableName, prevColumn)}%` };
                            else
                                value = { queryValue: `%${UsefullMethods_2.Functions.translateAndEncrypt(value.queryValue, this.database, this.tableName, prevColumn)}` };
                        }
                        else
                            value.queryValue = UsefullMethods_2.Functions.translateAndEncrypt(value.queryValue, this.database, this.tableName, prevColumn);
                        appendSql('?');
                        if (Array.isArray(value.queryValue))
                            value.queryValue = value.queryValue.map(x => UsefullMethods_2.Functions.translateAndEncrypt(x, this.database, this.tableName, prevColumn)).join(',');
                        result.values.push(value.queryValue);
                    }
                }
            }
        };
        while (this.hasNext(queries)) {
            translate(this.getValue(queries));
        }
        this.currentIndex = 0;
        return result;
    }
    async delete() {
        var item = this.getQueryResult("DELETE");
        console.log("Execute delete:" + item.sql);
        await this.database.execute(item.sql, item.values);
    }
    async firstOrDefault() {
        var item = this.getQueryResult();
        console.log("Execute firstOrDefault:" + item.sql);
        var tItem = UsefullMethods_2.Functions.single(await this.database.find(item.sql, item.values, this.tableName));
        return tItem ? await (0, UsefullMethods_1.createQueryResultType)(tItem, this.database, this.Children) : undefined;
    }
    async findOrSave(item) {
        var sqls = this.getQueryResult();
        item.tableName = this.tableName;
        var dbItem = UsefullMethods_2.Functions.single(await this.database.find(sqls.sql, sqls.values, this.tableName));
        if (!dbItem) {
            dbItem = (await this.database.save(item, false, this.tableName))[0];
        }
        dbItem.tableName = this.tableName;
        return await (0, UsefullMethods_1.createQueryResultType)(dbItem, this.database, this.Children);
    }
    async toList() {
        var item = this.getQueryResult();
        var result = [];
        for (var x of await this.database.find(item.sql, item.values, this.tableName)) {
            x.tableName = this.tableName;
            result.push(await (0, UsefullMethods_1.createQueryResultType)(x, this.database, this.Children));
        }
        return result;
    }
}
exports.Query = Query;
//# sourceMappingURL=SqlQueryBuilder.js.map