"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UsefullMethods_1 = require("./UsefullMethods");
class BulkSave {
    constructor(dbContext, keys, tableName) {
        this.dbContext = dbContext;
        this.keys = keys;
        this.tableName = tableName;
        this.quries = [];
    }
    insert(items) {
        const itemArray = Array.isArray(items)
            ? items
            : [items];
        const table = this.dbContext.tables.find(x => x.tableName == this.tableName);
        itemArray.forEach(item => {
            const q = {
                sql: `INSERT INTO ${this.tableName} (`,
                args: [],
                parseble: true
            };
            const keys = UsefullMethods_1.Functions.getAvailableKeys(this.keys, item);
            keys.forEach((k, i) => {
                q.sql +=
                    k + (i < keys.length - 1 ? "," : "");
            });
            q.sql += ") values(";
            keys.forEach((k, i) => {
                q.sql +=
                    "?" + (i < keys.length - 1 ? "," : "");
            });
            q.sql += ")";
            keys.forEach((k, i) => {
                var _a;
                const column = table === null || table === void 0 ? void 0 : table.props.find(x => x.columnName == k && x.encryptionKey);
                let v = (_a = item[k]) !== null && _a !== void 0 ? _a : null;
                if (UsefullMethods_1.Functions.isDate(v))
                    v = v.toISOString();
                else if (column &&
                    column.columnType === "JSON" &&
                    v)
                    v = JSON.stringify(v);
                if (column &&
                    column.columnType === "BLOB")
                    q.parseble = false;
                if (typeof v === "boolean")
                    v = v === true ? 1 : 0;
                if (column)
                    v = UsefullMethods_1.Functions.encrypt(v, column.encryptionKey);
                q.args.push(v);
            });
            this.quries.push(q);
        });
        return this;
    }
    update(items) {
        const itemArray = Array.isArray(items)
            ? items
            : [items];
        const table = this.dbContext.tables.find(x => x.tableName == this.tableName);
        itemArray.forEach(item => {
            const q = {
                sql: `UPDATE ${this.tableName} SET `,
                args: [],
                parseble: true
            };
            const keys = UsefullMethods_1.Functions.getAvailableKeys(this.keys, item);
            keys.forEach((k, i) => {
                q.sql +=
                    ` ${k}=? ` +
                        (i < keys.length - 1 ? "," : "");
            });
            q.sql += " WHERE id=?";
            keys.forEach((k, i) => {
                var _a;
                const column = table === null || table === void 0 ? void 0 : table.props.find(x => x.columnName == k && x.encryptionKey);
                let v = (_a = item[k]) !== null && _a !== void 0 ? _a : null;
                if (UsefullMethods_1.Functions.isDate(v))
                    v = v.toISOString();
                else if (column &&
                    column.columnType === "JSON" &&
                    v) {
                    v = JSON.stringify(v);
                }
                if (column &&
                    column.columnType === "BLOB")
                    q.parseble = false;
                if (typeof v === "boolean")
                    v = v === true ? 1 : 0;
                if (column)
                    v = UsefullMethods_1.Functions.encrypt(v, column.encryptionKey);
                q.args.push(v);
            });
            q.args.push(item.id);
            this.quries.push(q);
        });
        return this;
    }
    delete(items) {
        const itemArray = Array.isArray(items)
            ? items
            : [items];
        itemArray.forEach(item => {
            const q = {
                sql: `DELETE FROM ${this.tableName} WHERE id = ?`,
                args: [item.id],
                parseble: true
            };
            this.quries.push(q);
        });
        return this;
    }
    async execute() {
        if (this.quries.length > 0) {
            let qs = [
                ...this.quries.filter(x => !x.parseble)
            ];
            let sql = [];
            let c = "?";
            const tempQuestionMark = "#questionMark";
            for (let q of this.quries.filter(x => x.parseble)) {
                let s = new UsefullMethods_1.StringBuilder(q.sql);
                while (s.indexOf(c) !== -1 &&
                    q.args.length > 0) {
                    let value = q.args.shift();
                    if (UsefullMethods_1.Functions.isDefained(value) &&
                        typeof value === "string") {
                        if (value.indexOf(c) !== -1)
                            value = value.replace(new RegExp("\\" + c, "gmi"), tempQuestionMark);
                        value = `'${value}'`;
                    }
                    if (!UsefullMethods_1.Functions.isDefained(value))
                        value = "NULL";
                    s.replaceIndexOf(c, value.toString());
                }
                sql.push(s);
            }
            if (sql.length > 0)
                qs.push({
                    sql: sql
                        .join(";\n")
                        .replace(new RegExp(tempQuestionMark, "gmi"), c),
                    args: []
                });
            await this.dbContext.executeRawSql(qs);
            const db = this
                .dbContext;
            await db.triggerWatch([], "onBulkSave", undefined, this.tableName);
        }
    }
}
exports.default = BulkSave;
//# sourceMappingURL=BulkSave.js.map