"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Param = exports.IBaseModule = exports.IId = void 0;
class IId {
    constructor(id) {
        this.id = id !== null && id !== void 0 ? id : id;
    }
}
exports.IId = IId;
class IBaseModule extends IId {
    constructor(tableName, id) {
        super(id);
        this.tableName = tableName;
    }
}
exports.IBaseModule = IBaseModule;
var Param;
(function (Param) {
    Param["StartParameter"] = "#(";
    Param["EqualTo"] = "#=";
    Param["EndParameter"] = "#)";
    Param["OR"] = "#OR";
    Param["AND"] = "#AND";
    Param["LessThan"] = "#<";
    Param["GreaterThan"] = "#>";
    Param["IN"] = "#IN";
    Param["NotIn"] = "#NOT IN";
    Param["NULL"] = "#IS NULL";
    Param["NotNULL"] = "#IS NOT NULL";
    Param["NotEqualTo"] = "#!=";
    Param["Contains"] = "#like";
    Param["StartWith"] = "S#like";
    Param["EndWith"] = "E#like";
    Param["EqualAndGreaterThen"] = "#>=";
    Param["EqualAndLessThen"] = "#<=";
    Param["OrderByDesc"] = "#Order By #C DESC";
    Param["OrderByAsc"] = "#Order By #C ASC";
    Param["Limit"] = "#Limit #Counter";
})(Param = exports.Param || (exports.Param = {}));
const OUseQuery = (tableName, query, onDbItemsChanged) => [
    [],
    {},
    new Function(),
    {}
];
//# sourceMappingURL=expo.sql.wrapper.types.js.map