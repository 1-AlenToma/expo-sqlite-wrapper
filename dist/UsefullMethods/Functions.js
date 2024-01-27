"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = __importDefault(require("./Errors"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const json_sql_1 = __importDefault(require("json-sql"));
class Functions {
    constructor() {
        this.encryptionsIdentifier = "#dbEncrypted&";
    }
    buildJsonExpression(jsonExpression, database, tableName, alias, isInit) {
        const table = database.tables.find(x => x.tableName == tableName);
        if (!table)
            throw Errors_1.default.missingTableBuilder(tableName);
        let item = jsonExpression;
        if (!isInit) {
            item[alias] = {};
            item = item[alias];
        }
        table.props.forEach(x => {
            item[x.columnName] = isInit ? x.columnName : `${alias}.${x.columnName}`;
        });
        return jsonExpression;
    }
    aliasNameming(column, alias) {
        return `${column} as ${alias}`;
    }
    isPrimitive(v) {
        if (!this.isDefained(v) ||
            typeof v === 'string' ||
            typeof v === 'number' ||
            typeof v === 'function' ||
            Object.prototype.toString.call(v) === '[object Date]' ||
            typeof v === 'boolean' ||
            typeof v === 'bigint')
            return true;
        return false;
    }
    isDefained(v) {
        return v !== null && v !== undefined;
    }
    isFunc(value) {
        if (value === null || value === undefined || value.toString === undefined)
            return false;
        if (typeof value === "function")
            return true;
        return value.toString().indexOf('function') !== -1;
    }
    isDate(v) {
        if (v === null || v === undefined)
            return false;
        if (Object.prototype.toString.call(v) === "[object Date]")
            return true;
        return false;
    }
    translateToSqliteValue(v) {
        if (v === null || v === undefined)
            return v;
        if (this.isDate(v))
            return v.toISOString();
        if (typeof v === "boolean")
            return v === true ? 1 : 0;
        return v;
    }
    translateAndEncrypt(v, database, tableName, column) {
        if (column && column.indexOf("."))
            column = this.last(column.split("."));
        const table = database.tables.find(x => x.tableName == tableName);
        const encryptValue = typeof v === "string" && column && table && table.props.find(f => f.columnName === column && f.encryptionKey) != undefined;
        v = this.translateToSqliteValue(v);
        if (encryptValue) {
            v = this.encrypt(v, table.props.find(x => x.columnName === column).encryptionKey);
        }
        return v;
    }
    encrypt(str, key) {
        if (!str || str == "" || str.startsWith(this.encryptionsIdentifier))
            return str; // already Encrypted
        const hash = crypto_js_1.default.SHA256(key);
        return this.encryptionsIdentifier + crypto_js_1.default.AES.encrypt(str, hash, { mode: crypto_js_1.default.mode.ECB }).toString();
    }
    decrypt(str, key) {
        if (!str || str == "" || !str.startsWith(this.encryptionsIdentifier))
            return str;
        const hash = crypto_js_1.default.SHA256(key);
        str = str.substring(this.encryptionsIdentifier.length);
        const bytes = crypto_js_1.default.AES.decrypt(str, hash, { mode: crypto_js_1.default.mode.ECB });
        const originalText = bytes.toString(crypto_js_1.default.enc.Utf8);
        return originalText;
    }
    oEncypt(item, tableBuilder) {
        if (!tableBuilder)
            return item;
        tableBuilder.props.filter(x => x.encryptionKey).forEach(x => {
            const v = item[x.columnName];
            if (v)
                item[x.columnName] = this.encrypt(v, x.encryptionKey);
        });
        return item;
    }
    oDecrypt(item, tableBuilder) {
        if (!tableBuilder)
            return item;
        tableBuilder.props.filter(x => x.encryptionKey).forEach(x => {
            const v = item[x.columnName];
            if (v)
                item[x.columnName] = this.decrypt(v, x.encryptionKey);
        });
        return item;
    }
    validateTableName(item, tableName) {
        if (!item.tableName || item.tableName.length <= 2)
            if (!tableName)
                throw "TableName cannot be null, This item could not be saved";
            else
                item.tableName = tableName;
        return item;
    }
    jsonToSqlite(query) {
        try {
            const builder = (0, json_sql_1.default)();
            const sql = builder.build(query);
            sql.query = sql.query.replace(/\"/g, '');
            const vArray = [];
            for (const key in sql.values) {
                while (sql.query.indexOf('$' + key) !== -1) {
                    sql.query = sql.query.replace('$' + key, '?');
                    vArray.push(sql.values[key]);
                }
            }
            const sqlResult = { sql: sql.query, args: vArray };
            return sqlResult;
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
    translateSimpleSql(database, tableName, query) {
        var q = `SELECT * FROM ${tableName} ${query ? 'WHERE ' : ''}`;
        var values = [];
        if (query && Object.keys(query).length > 0) {
            const table = database.tables.find(x => x.tableName == tableName);
            const keys = Object.keys(query);
            keys.forEach((x, i) => {
                var start = x.startsWith('$') ? x.substring(0, x.indexOf('-')).replace('-', '') : undefined;
                const columnName = start ? x.replace("$in-", "").trim() : x.trim();
                const column = table ? table.props.find(f => f.columnName === columnName) : undefined;
                if (!start) {
                    q += x + '=? ' + (i < keys.length - 1 ? 'AND ' : '');
                    let v = query[x];
                    if (column)
                        v = this.translateAndEncrypt(v, database, tableName, columnName);
                    values.push(v);
                }
                else {
                    if (start == '$in') {
                        let v = query[x];
                        q += x.replace("$in-", "") + ' IN (';
                        v.forEach((item, index) => {
                            q += '?' + (index < v.length - 1 ? ', ' : '');
                            if (column)
                                item = this.translateAndEncrypt(item, database, tableName, columnName);
                            values.push(item);
                        });
                    }
                    q += ') ' + (i < keys.length - 1 ? 'AND ' : '');
                }
            });
        }
        return { sql: q, args: values };
    }
    getAvailableKeys(dbKeys, item) {
        return dbKeys.filter(x => Object.keys(item).includes(x));
    }
    createSqlInstaceOfType(prototype, item) {
        if (!prototype)
            return item;
        const x = Object.create(prototype);
        for (const key in item)
            x[key] = item[key];
        return x;
    }
    counterSplit(titems, counter) {
        var items = [];
        titems.forEach((x, index) => {
            var _a;
            if (items.length <= 0 || index % counter === 0) {
                items.push([]);
            }
            var current = (_a = this.last(items)) !== null && _a !== void 0 ? _a : [];
            current.push(x);
        });
        return items;
    }
    findAt(titems, index) {
        if (!titems)
            return undefined;
        if (index < 0 || index >= titems.length)
            return undefined;
        return this[index];
    }
    last(titems) {
        return titems && titems.length > 0 ? titems[titems.length - 1] : undefined;
    }
    toType(titems) {
        return titems !== null && titems !== void 0 ? titems : [];
    }
    single(titems) {
        return titems && titems.length > 0 ? titems[0] : undefined;
    }
}
const functions = new Functions();
exports.default = functions;
//# sourceMappingURL=Functions.js.map