"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Functions_1 = __importDefault(require("./Functions"));
class QValue {
    constructor() {
        this.type = "QValue";
    }
    validate() {
        this.isInnerSelect = this.value && this.value.getInnerSelectSql !== undefined;
        this.isFunction = Functions_1.default.isFunc(this.value);
    }
    toSqlValue(database, tableName, column) {
        return Functions_1.default.translateAndEncrypt(this.value, database, tableName, column);
    }
    async getInnserSelectorValue() {
        if (!this.selector)
            throw "Database cannot be null";
        const items = await this.value.toList();
        const res = [];
        items.forEach(x => {
            for (const k in x) {
                const v = x[k];
                if (k === "tableName" || !Functions_1.default.isPrimitive(v))
                    continue;
                res.push(v);
            }
        });
        this.value = res;
    }
    map(fn) {
        return this.toArray().map(x => {
            const item = QValue.Q;
            item.isColumn = this.isColumn;
            item.args = this.args;
            item.isFunction = this.isFunction;
            item.Value(x);
            return fn(item);
        });
    }
    toArray() {
        return Array.isArray(this.value) ? this.value : [this.value];
    }
    toType() {
        return this.value;
    }
    getColumn(jsonExpression) {
        try {
            if (typeof this.value === "string")
                return this.value;
            else {
                return this.toType()(jsonExpression, Functions_1.default.aliasNameming).toString().split(",").filter(x => x.length > 0).join(",");
            }
        }
        catch (e) {
            console.error(e, this);
            throw e;
        }
    }
    getColumns(jsonExpression) {
        if (typeof this.value === "string")
            return [this.value];
        else {
            return this.toType()(jsonExpression, Functions_1.default.aliasNameming).toString().split(",").filter(x => x.length > 1);
        }
    }
    static get Q() {
        return new QValue();
    }
    Value(value) {
        this.value = value;
        this.validate();
        return this;
    }
    Value2(value) {
        this.value2 = value;
        return this;
    }
    Args(args) {
        this.args = args;
        return this;
    }
    IsColumn(isColumn) {
        this.isColumn = isColumn;
        return this;
    }
    Alias(alias) {
        this.alias = alias;
        return this;
    }
    getInnerSelect(param) {
        let sql = this.value.getInnerSelectSql();
        return param.indexOf("(") === -1 ? `(${sql})` : `${sql}`;
    }
}
exports.default = QValue;
//# sourceMappingURL=QValue.js.map