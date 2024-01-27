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
                args: []
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
                else if (typeof v === "object" && v)
                    v = JSON.stringify(v);
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
                args: []
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
                else if (typeof v === "object" && v)
                    v = JSON.stringify(v);
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
                args: [item.id]
            };
            this.quries.push(q);
        });
        return this;
    }
    async execute() {
        if (this.quries.length > 0) {
            await this.dbContext.executeRawSql(this.quries, false);
            const db = this
                .dbContext;
            await db.triggerWatch([], "onBulkSave", undefined, this.tableName);
        }
    }
}
exports.default = BulkSave;
//# sourceMappingURL=BulkSave.js.map