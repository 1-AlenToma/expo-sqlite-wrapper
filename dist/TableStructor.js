"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableBuilder = void 0;
class TableBuilder {
    constructor(tableName) {
        this.props = [];
        this.tableName = tableName;
        this.constrains = [];
    }
    colType(colType) {
        if (colType !== "String" &&
            this.getLastProp.encryptionKey) {
            const ms = `Error:Encryption can only be done to columns with String Types. (${this.tableName}.${this.getLastProp.columnName})`;
            console.error(ms);
            throw ms;
        }
        this.getLastProp.columnType = colType;
        return this;
    }
    get blob() {
        return this.colType("BLOB");
    }
    get json() {
        return this.colType("JSON");
    }
    get boolean() {
        return this.colType("Boolean");
    }
    get number() {
        return this.colType("Number");
    }
    get decimal() {
        return this.colType("Decimal");
    }
    get string() {
        return this.colType("String");
    }
    get dateTime() {
        return this.colType("DateTime");
    }
    get nullable() {
        this.getLastProp.isNullable = true;
        return this;
    }
    get primary() {
        this.getLastProp.isPrimary = true;
        return this;
    }
    get autoIncrement() {
        this.getLastProp.isAutoIncrement = true;
        return this;
    }
    get unique() {
        this.getLastProp.isUnique = true;
        return this;
    }
    get getLastProp() {
        if (this.props.length > 0)
            return this.props[this.props.length - 1];
        return {};
    }
    objectPrototype(objectProptoType) {
        this.typeProptoType = objectProptoType;
        return this;
    }
    encrypt(encryptionKey) {
        if (this.getLastProp.columnType !== "String") {
            const ms = `Error:Encryption can only be done to columns with String Types. (${this.tableName}.${this.getLastProp.columnName})`;
            console.error(ms);
            throw ms;
        }
        this.getLastProp.encryptionKey =
            encryptionKey;
        return this;
    }
    onItemCreate(func) {
        this.itemCreate = func;
        return this;
    }
    column(colName) {
        const col = {
            columnName: colName,
            columnType: "String"
        };
        this.props.push(col);
        return this;
    }
    constrain(columnName, contraintTableName, contraintColumnName) {
        this.constrains.push({
            columnName,
            contraintColumnName,
            contraintTableName
        });
        return this;
    }
}
exports.TableBuilder = TableBuilder;
exports.default = (tableName) => {
    return new TableBuilder(tableName);
};
//# sourceMappingURL=TableStructor.js.map