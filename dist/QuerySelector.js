"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Where = exports.Param = void 0;
const QuerySelectorTranslator_1 = __importDefault(require("./QuerySelectorTranslator"));
const UsefullMethods_1 = require("./UsefullMethods");
var Param;
(function (Param) {
    Param["StartParameter"] = "#(";
    Param["EqualTo"] = "#=";
    Param["EndParameter"] = "#)";
    Param["OR"] = "#OR";
    Param["AND"] = "#AND";
    Param["LessThan"] = "#<";
    Param["GreaterThan"] = "#>";
    Param["IN"] = "#IN(";
    Param["Not"] = "#NOT";
    Param["NULL"] = "#IS NULL";
    Param["NotNULL"] = "#IS NOT NULL";
    Param["NotEqualTo"] = "#!=";
    Param["Contains"] = "C#like";
    Param["StartWith"] = "S#like";
    Param["EndWith"] = "E#like";
    Param["EqualAndGreaterThen"] = "#>=";
    Param["EqualAndLessThen"] = "#<=";
    Param["OrderByDesc"] = "#Order By #C DESC";
    Param["OrderByAsc"] = "#Order By #C ASC";
    Param["Limit"] = "#Limit #Counter";
    Param["GroupBy"] = "#GROUP BY";
    Param["InnerJoin"] = "#INNER JOIN";
    Param["LeftJoin"] = "#LEFT JOIN";
    Param["RightJoin"] = "#RIGHT JOIN";
    Param["CrossJoin"] = "#CROSS JOIN";
    Param["Join"] = "#JOIN";
    Param["Max"] = "#MAX";
    Param["Min"] = "#MIN";
    Param["Count"] = "#COUNT";
    Param["Sum"] = "#SUM";
    Param["Total"] = "#Total";
    Param["GroupConcat"] = "#GroupConcat";
    Param["Avg"] = "#AVG";
    Param["Between"] = "#BETWEEN";
    Param["Value"] = "#Value";
    Param["Concat"] = "#Concat";
    Param["Union"] = "#UNION";
    Param["UnionAll"] = "#UNION ALL";
    Param["Case"] = "#CASE";
    Param["When"] = "#WHEN";
    Param["Then"] = "#THEN";
    Param["Else"] = "#ELSE";
    Param["EndCase"] = "#END";
})(Param = exports.Param || (exports.Param = {}));
;
;
class ReturnMethods {
    constructor(parent) {
        this.parent = parent;
    }
    async firstOrDefault() {
        return await this.parent.firstOrDefault();
    }
    async toList() {
        return await this.parent.toList();
    }
    async findOrSave(item) {
        return await this.parent.findOrSave(item);
    }
    async delete() {
        await this.parent.delete();
    }
    /**
    * get the translated sqlQuery
    */
    getSql(sqlType) {
        return this.parent.getSql(sqlType);
    }
    /**
     * get a simple sql
     * @returns sql string
     */
    getInnerSelectSql() {
        return this.parent.getInnerSelectSql();
    }
}
class QueryColumnSelector extends ReturnMethods {
    constructor(parent) {
        super(parent);
        this.columns = [];
        this.cases = [];
    }
    Case(alias) {
        const caseItems = new Where(this.parent.tableName, this.parent, alias, Param.Case);
        Object.defineProperty(caseItems, "EndCase", {
            get: () => {
                caseItems.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.EndCase));
                return this;
            }
        });
        this.cases.push(caseItems);
        return caseItems;
    }
    Cast(converter) {
        this.parent.converter = converter;
        return this;
    }
    Columns(columns) {
        this.parent.clear();
        this.columns.push(UsefullMethods_1.QValue.Q.Value(columns));
        return this;
    }
    Concat(alias, collectCharacters_type, ...columnOrValues) {
        this.parent.clear();
        this.columns.push(UsefullMethods_1.QValue.Q.Value(columnOrValues).Args(Param.Concat).Value2(collectCharacters_type).Alias(alias));
        return this;
    }
    Max(columns, alias) {
        this.parent.clear();
        this.columns.push(UsefullMethods_1.QValue.Q.Value(columns).Args(Param.Max).Alias(alias));
        return this;
    }
    Min(columns, alias) {
        this.parent.clear();
        this.columns.push(UsefullMethods_1.QValue.Q.Value(columns).Args(Param.Min).Alias(alias));
        return this;
    }
    Count(columns, alias) {
        this.parent.clear();
        this.columns.push(UsefullMethods_1.QValue.Q.Value(columns).Args(Param.Count).Alias(alias));
        return this;
    }
    Sum(columns, alias) {
        this.parent.clear();
        this.columns.push(UsefullMethods_1.QValue.Q.Value(columns).Args(Param.Sum).Alias(alias));
        return this;
    }
    Total(columns, alias) {
        this.parent.clear();
        this.columns.push(UsefullMethods_1.QValue.Q.Value(columns).Args(Param.Total).Alias(alias));
        return this;
    }
    GroupConcat(columns, alias, seperator) {
        this.parent.clear();
        this.columns.push(UsefullMethods_1.QValue.Q.Value(columns).Args(Param.GroupConcat).Alias(alias).Value2(seperator));
        return this;
    }
    Avg(columns, alias) {
        this.parent.clear();
        this.columns.push(UsefullMethods_1.QValue.Q.Value(columns).Args(Param.Avg).Alias(alias));
        return this;
    }
    get Having() {
        this.parent.clear();
        this.parent.having = new Where(this.parent.tableName, this.parent);
        return this.parent.having;
    }
}
class Where extends ReturnMethods {
    constructor(tableName, parent, alias, ...queries) {
        super(parent);
        this.type = "QuerySelector";
        this.Queries = queries.map((x) => x.type != "QValue" ? UsefullMethods_1.QValue.Q.Args(x) : x);
        this.tableName = tableName;
        this.alias = alias;
    }
    LoadChildren(child, childColumn, parentColumn, assignTo, isArray) {
        this.parent.children.push({
            parentProperty: parentColumn,
            parentTable: this.parent.tableName,
            childProperty: childColumn,
            childTableName: child,
            assignTo: assignTo,
            isArray: isArray !== null && isArray !== void 0 ? isArray : false
        });
        return this;
    }
    get Case() {
        this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.Case));
        return this;
    }
    get When() {
        this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.When));
        return this;
    }
    get Then() {
        this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.Then));
        return this;
    }
    get EndCase() {
        this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.EndCase));
        return this;
    }
    get Else() {
        this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.Else));
        return this;
    }
    Value(value) {
        this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.Value).Value(value));
        return this;
    }
    Between(value1, value2) {
        this.parent.clear();
        if (this.Queries.length > 0) {
            this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.Between));
            this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.Value).Value(value1));
            this.AND;
            this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.Value).Value(value2));
        }
        return this;
    }
    Cast(converter) {
        this.parent.converter = converter;
        return this;
    }
    get Select() {
        this.parent.queryColumnSelector = new QueryColumnSelector(this.parent);
        return this.parent.queryColumnSelector;
    }
    Column(column) {
        this.parent.clear();
        this.Queries.push(UsefullMethods_1.QValue.Q.Value(column).IsColumn(true));
        return this;
    }
    Concat(collectCharacters_type, ...columnOrValues) {
        this.parent.clear();
        this.Queries.push(UsefullMethods_1.QValue.Q.Value(columnOrValues).Args(Param.Concat).Value2(collectCharacters_type));
        return this;
    }
    EqualTo(value) {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Value(value).Args(Param.EqualTo));
        return this;
    }
    NotEqualTo(value) {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Value(value).Args(Param.NotEqualTo));
        return this;
    }
    EqualAndGreaterThen(value) {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Value(value).Args(Param.EqualAndGreaterThen));
        return this;
    }
    EqualAndLessThen(value) {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Value(value).Args(Param.EqualAndLessThen));
        return this;
    }
    get Start() {
        this.parent.clear();
        this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.StartParameter));
        return this;
    }
    get End() {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.EndParameter));
        return this;
    }
    get OR() {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.OR));
        return this;
    }
    get AND() {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.AND));
        return this;
    }
    GreaterThan(value) {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Value(value).Args(Param.GreaterThan));
        return this;
    }
    LessThan(value) {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Value(value).Args(Param.LessThan));
        return this;
    }
    IN(value) {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Value(value).Args(Param.IN));
        return this;
    }
    get Not() {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.Not));
        return this;
    }
    get Null() {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.NULL));
        return this;
    }
    get NotNull() {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Args(Param.NotNULL));
        return this;
    }
    Contains(value) {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Value(value).Args(Param.Contains));
        return this;
    }
    StartsWith(value) {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Value(value).Args(Param.StartWith));
        return this;
    }
    EndsWith(value) {
        this.parent.clear();
        if (this.Queries.length > 0)
            this.Queries.push(UsefullMethods_1.QValue.Q.Value(value).Args(Param.EndWith));
        return this;
    }
    OrderByAsc(columnName) {
        this.parent.clear();
        this.parent.others.push(UsefullMethods_1.QValue.Q.Value(columnName).Args(Param.OrderByAsc));
        return this;
    }
    OrderByDesc(columnName) {
        this.parent.clear();
        this.parent.others.push(UsefullMethods_1.QValue.Q.Value(columnName).Args(Param.OrderByDesc));
        return this;
    }
    Limit(value) {
        this.parent.clear();
        this.parent.others = this.parent.others.filter(x => x.args !== Param.Limit);
        this.parent.others.push(UsefullMethods_1.QValue.Q.Value(value).Args(Param.Limit));
        return this;
    }
    GroupBy(columnName) {
        this.parent.clear();
        this.parent.others.push(UsefullMethods_1.QValue.Q.Value(columnName).Args(Param.GroupBy));
        return this;
    }
    InnerJoin(tableName, alias) {
        this.parent.clear();
        if (this.alias == alias || this.parent.joins.find((x) => x.alias == alias))
            throw `alias can not be ${alias}, it is already in use`;
        this.parent.buildJsonExpression(tableName, alias);
        const join = new Where(tableName, this.parent, alias, Param.InnerJoin);
        this.parent.joins.push(join);
        return join;
    }
    CrossJoin(tableName, alias) {
        this.parent.clear();
        if (this.alias == alias || this.parent.joins.find((x) => x.alias == alias))
            throw `alias can not be ${alias}, it is already in use`;
        this.parent.buildJsonExpression(tableName, alias);
        const join = new Where(tableName, this.parent, alias, Param.CrossJoin);
        this.parent.joins.push(join);
        return join;
    }
    LeftJoin(tableName, alias) {
        this.parent.clear();
        if (this.alias == alias || this.parent.joins.find((x) => x.alias == alias))
            throw `alias can not be ${alias}, it is already in use`;
        this.parent.buildJsonExpression(tableName, alias);
        const join = new Where(tableName, this.parent, alias, Param.LeftJoin);
        this.parent.joins.push(join);
        return join;
    }
    Join(tableName, alias) {
        this.parent.clear();
        if (this.alias == alias || this.parent.joins.find((x) => x.alias == alias))
            throw `alias can not be ${alias}, it is already in use`;
        this.parent.buildJsonExpression(tableName, alias);
        const join = new Where(tableName, this.parent, alias, Param.Join);
        this.parent.joins.push(join);
        return join;
    }
    RightJoin(tableName, alias) {
        this.parent.clear();
        if (this.alias == alias || this.parent.joins.find((x) => x.alias == alias))
            throw `alias can not be ${alias}, it is already in use`;
        this.parent.buildJsonExpression(tableName, alias);
        const join = new Where(tableName, this.parent, alias, Param.RightJoin);
        this.parent.joins.push(join);
        return join;
    }
    Union(...queryselectors) {
        queryselectors.forEach(x => this.parent.unions.push({ type: Param.Union, value: x(this.parent.database) }));
        return this;
    }
    UnionAll(...queryselectors) {
        queryselectors.forEach(x => this.parent.unions.push({ type: Param.UnionAll, value: x(this.parent.database) }));
        return this;
    }
    get Where() {
        this.parent.clear();
        this.parent.where = new Where(this.tableName, this.parent, undefined);
        return this.parent.where;
    }
}
exports.Where = Where;
class QuerySelector {
    constructor(tableName, database) {
        this.type = "QuerySelector";
        this.tableName = tableName;
        this.joins = [];
        this.database = database;
        this.jsonExpression = {};
        this.buildJsonExpression(tableName, tableName, true);
        this.buildJsonExpression(tableName, "a");
        this.others = [];
        this.children = [];
        this.unions = [];
    }
    clear() {
        this.translator = undefined;
    }
    buildJsonExpression(tableName, alias, isInit) {
        this.queryColumnSelector = undefined;
        this.jsonExpression = UsefullMethods_1.Functions.buildJsonExpression(this.jsonExpression, this.database, tableName, alias, isInit);
    }
    get Select() {
        this.queryColumnSelector = new QueryColumnSelector(this);
        return this.queryColumnSelector;
    }
    Union(...queryselectors) {
        queryselectors.forEach(x => this.unions.push({ type: Param.Union, value: x(this.database) }));
        return this;
    }
    UnionAll(...queryselectors) {
        queryselectors.forEach(x => this.unions.push({ type: Param.UnionAll, value: x(this.database) }));
        return this;
    }
    InnerJoin(tableName, alias) {
        if (this.alias == alias || this.joins.find((x) => x.alias == alias))
            throw `alias can not be ${alias}, it is already in use`;
        this.alias = 'a';
        this.buildJsonExpression(tableName, alias);
        this.others = [];
        const join = new Where(tableName, this, alias, Param.InnerJoin);
        this.joins.push(join);
        return join;
    }
    CrossJoin(tableName, alias) {
        if (this.alias == alias || this.joins.find((x) => x.alias == alias))
            throw `alias can not be ${alias}, it is already in use`;
        this.alias = 'a';
        this.buildJsonExpression(tableName, alias);
        this.others = [];
        const join = new Where(tableName, this, alias, Param.CrossJoin);
        this.joins.push(join);
        return join;
    }
    LeftJoin(tableName, alias) {
        if (this.alias == alias || this.joins.find((x) => x.alias == alias))
            throw `alias can not be ${alias}, it is already in use`;
        this.alias = 'a';
        this.buildJsonExpression(tableName, alias);
        this.others = [];
        const join = new Where(tableName, this, alias, Param.LeftJoin);
        this.joins.push(join);
        return join;
    }
    Join(tableName, alias) {
        if (this.alias == alias || this.joins.find((x) => x.alias == alias))
            throw `alias can not be ${alias}, it is already in use`;
        this.alias = 'a';
        this.buildJsonExpression(tableName, alias);
        this.others = [];
        const join = new Where(tableName, this, alias, Param.Join);
        this.joins.push(join);
        return join;
    }
    RightJoin(tableName, alias) {
        if (this.alias == alias || this.joins.find((x) => x.alias == alias))
            throw `alias can not be ${alias}, it is already in use`;
        this.alias = 'a';
        this.buildJsonExpression(tableName, alias);
        this.others = [];
        const join = new Where(tableName, this, alias, Param.RightJoin);
        this.joins.push(join);
        return join;
    }
    LoadChildren(child, childColumn, parentColumn, assignTo, isArray) {
        this.children.push({
            parentProperty: parentColumn,
            parentTable: this.tableName,
            childProperty: childColumn,
            childTableName: child,
            assignTo: assignTo,
            isArray: isArray !== null && isArray !== void 0 ? isArray : false
        });
        return this;
    }
    async delete() {
        var item = this.getSql("DELETE");
        console.log("Execute delete:" + item.sql);
        await this.database.execute(item.sql, item.args);
    }
    async findOrSave(item) {
        const sql = this.getSql("SELECT");
        item.tableName = this.tableName;
        var dbItem = UsefullMethods_1.Functions.single(await this.database.find(sql.sql, sql.args, this.tableName));
        if (!dbItem) {
            dbItem = UsefullMethods_1.Functions.single(await this.database.save(item, false, this.tableName));
        }
        dbItem.tableName = this.tableName;
        if (dbItem && this.converter)
            dbItem = this.converter(dbItem);
        return await (0, UsefullMethods_1.createQueryResultType)(dbItem, this.database, this.children);
    }
    async firstOrDefault() {
        var item = this.getSql("SELECT");
        let tItem = UsefullMethods_1.Functions.single(await this.database.find(item.sql, item.args, this.tableName));
        if (tItem && this.converter)
            tItem = this.converter(tItem);
        return tItem ? await (0, UsefullMethods_1.createQueryResultType)(tItem, this.database, this.children) : undefined;
    }
    async toList() {
        const sql = this.getSql("SELECT");
        var result = [];
        for (var x of await this.database.find(sql.sql, sql.args, this.tableName)) {
            x.tableName = this.tableName;
            if (this.converter)
                x = this.converter(x);
            result.push(await (0, UsefullMethods_1.createQueryResultType)(x, this.database, this.children));
        }
        return result;
    }
    getSql(sqlType) {
        return ((this.translator = (this.translator ? this.translator : new QuerySelectorTranslator_1.default(this))).translate(sqlType));
    }
    getInnerSelectSql() {
        return ((this.translator = (this.translator ? this.translator : new QuerySelectorTranslator_1.default(this))).translateToInnerSelectSql());
    }
    OrderByAsc(columnName) {
        this.clear();
        this.others.push(UsefullMethods_1.QValue.Q.Value(columnName).Args(Param.OrderByAsc));
        return this;
    }
    OrderByDesc(columnName) {
        this.clear();
        this.others.push(UsefullMethods_1.QValue.Q.Value(columnName).Args(Param.OrderByDesc));
        return this;
    }
    Limit(value) {
        this.clear();
        this.others = this.others.filter(x => x.args !== Param.Limit);
        this.others.push(UsefullMethods_1.QValue.Q.Value(value).Args(Param.Limit));
        return this;
    }
    GroupBy(columnName) {
        this.clear();
        this.others.push(UsefullMethods_1.QValue.Q.Value(columnName).Args(Param.GroupBy));
    }
    get Where() {
        this.where = new Where(this.tableName, this, this.alias);
        return this.where;
    }
}
exports.default = QuerySelector;
//# sourceMappingURL=QuerySelector.js.map