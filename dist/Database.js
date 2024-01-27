"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BulkSave_1 = __importDefault(require("./BulkSave"));
const useQuery_1 = __importDefault(require("./hooks/useQuery"));
const QuerySelector_1 = __importDefault(require("./QuerySelector"));
const UsefullMethods_1 = require("./UsefullMethods");
function default_1(databaseTables, getDatabase, onInit, disableLog) {
    return new Database(databaseTables, getDatabase, onInit, disableLog);
}
exports.default = default_1;
const watchers = [];
class Watcher {
    constructor(tableName) {
        this.removeWatch = () => watchers.splice(watchers.findIndex(x => x == this), 1);
        this.tableName = tableName;
        this.identifier = "Other";
    }
}
class Database {
    constructor(databaseTables, getDatabase, onInit, disableLog) {
        this.timeout = undefined;
        this.allowedKeys = async (tableName, fromCachedKyes, allKeys) => {
            if (fromCachedKyes === true &&
                !allKeys &&
                this.mappedKeys.has(tableName))
                return this.mappedKeys.get(tableName);
            return new Promise(async (resolve, reject) => {
                (await this.dataBase()).exec([
                    {
                        sql: `PRAGMA table_info(${tableName})`,
                        args: []
                    }
                ], true, (error, result) => {
                    var _a, _b, _c;
                    try {
                        if (error) {
                            console.error(error);
                            reject(error);
                            return;
                        }
                        const arr = Array.isArray(result)
                            ? result
                            : [result];
                        if ((_a = UsefullMethods_1.Functions.single(arr)) === null || _a === void 0 ? void 0 : _a.error) {
                            console.error((_b = UsefullMethods_1.Functions.single(arr)) === null || _b === void 0 ? void 0 : _b.error);
                            reject((_c = UsefullMethods_1.Functions.single(arr)) === null || _c === void 0 ? void 0 : _c.error);
                            return;
                        }
                        const table = this.tables.find(x => x.tableName === tableName);
                        const data = result;
                        var keys = [];
                        for (var i = 0; i < data.length; i++) {
                            for (let r = 0; r < data[i].rows.length; r++) {
                                if ((table === undefined &&
                                    data[i].rows[r].name !=
                                        "id") ||
                                    (table &&
                                        (table.props.find(x => x.columnName ==
                                            data[i].rows[r]
                                                .name &&
                                            !x.isAutoIncrement) ||
                                            allKeys)))
                                    keys.push(data[i].rows[r].name);
                            }
                        }
                        if (!allKeys)
                            this.mappedKeys.set(tableName, keys);
                        resolve(keys);
                    }
                    catch (e) {
                        console.error(e);
                        reject(e);
                    }
                });
            });
        };
        this.executeRawSql = async (queries, readOnly) => {
            const key = "executeRawSql" + JSON.stringify(queries);
            this.operations.set(key, true);
            return new Promise(async (resolve, reject) => {
                try {
                    (await this.dataBase()).exec(queries, readOnly, (error, result) => {
                        if (error) {
                            console.error("SQL Error", error);
                            reject(error);
                        }
                        else
                            resolve();
                    });
                }
                catch (e) {
                    console.error(e);
                    reject(e);
                }
                finally {
                    this.operations.delete(key);
                }
            });
        };
        this.execute = async (query, args) => {
            const key = "execute" + query;
            this.operations.set(key, true);
            return new Promise(async (resolve, reject) => {
                try {
                    this.info("Executing Query:" + query);
                    await this.executeRawSql([{ sql: query, args: args || [] }], false);
                    this.info("Quary executed");
                    resolve(true);
                }
                catch (e) {
                    console.error("Could not execute query:", query, args, e);
                    reject(e);
                }
                finally {
                    this.operations.delete(key);
                    clearTimeout(this.timeout);
                }
            });
        };
        this.dropTables = async () => {
            try {
                for (var x of this.tables) {
                    await this.execute(`DROP TABLE if exists ${x.tableName}`);
                }
                await this.setUpDataBase(true);
            }
            catch (e) {
                console.error(e);
            }
        };
        this.setUpDataBase = async (forceCheck) => {
            try {
                if (!Database.dbIni || forceCheck) {
                    await this.beginTransaction();
                    const dbType = (columnType) => {
                        if (columnType == "Boolean" ||
                            columnType == "Number")
                            return "INTEGER";
                        if (columnType == "Decimal")
                            return "REAL";
                        return "TEXT";
                    };
                    this.log(`dbIni= ${Database.dbIni}`);
                    this.log(`forceCheck= ${forceCheck}`);
                    this.log("initilize database table setup");
                    for (var table of this.tables) {
                        var query = `CREATE TABLE if not exists ${table.tableName} (`;
                        table.props.forEach((col, index) => {
                            query += `${col.columnName.toString()} ${dbType(col.columnType)} ${!col.isNullable ? "NOT NULL" : ""} ${col.isPrimary ? "UNIQUE" : ""},\n`;
                        });
                        table.props
                            .filter(x => x.isPrimary === true)
                            .forEach((col, index) => {
                            query +=
                                `PRIMARY KEY(${col.columnName.toString()} ${col.isAutoIncrement === true
                                    ? "AUTOINCREMENT"
                                    : ""})` +
                                    (index <
                                        table.props.filter(x => x.isPrimary === true).length -
                                            1
                                        ? ",\n"
                                        : "\n");
                        });
                        if (table.constrains &&
                            table.constrains.length > 0) {
                            query += ",";
                            table.constrains.forEach((col, index) => {
                                var _a, _b;
                                query +=
                                    `CONSTRAINT "fk_${col.columnName.toString()}" FOREIGN KEY(${col.columnName.toString()}) REFERENCES ${col.contraintTableName}(${col.contraintColumnName})` +
                                        (index <
                                            ((_b = (_a = table.constrains) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) -
                                                1
                                            ? ",\n"
                                            : "\n");
                            });
                        }
                        query += ");";
                        await this.execute(query);
                    }
                    await this.commitTransaction();
                }
            }
            catch (e) {
                console.error(e);
                await this.rollbackTransaction();
                throw e;
            }
        };
        this.disableLog = disableLog;
        this.onInit = onInit;
        this.mappedKeys = new Map();
        this.isClosing = false;
        this.timer = undefined;
        this.transacting = false;
        this.operations = new Map();
        this.tempStore = [];
        this.dataBase = async () => {
            var _a, _b;
            while (this.isClosing)
                await this.wait();
            if (this.db === undefined ||
                this.isClosed) {
                this.db = await getDatabase();
                this.isClosed = false;
                await ((_a = this.onInit) === null || _a === void 0 ? void 0 : _a.call(this, this));
            }
            this.isOpen = true;
            return (_b = this.db) !== null && _b !== void 0 ? _b : (await getDatabase());
        };
        this.tables = databaseTables;
    }
    log(...items) {
        if (!this.disableLog)
            console.log(items);
    }
    info(...items) {
        if (!this.disableLog)
            console.info(items);
    }
    //#region Hooks
    useQuery(tableName, query, onDbItemChanged) {
        return (0, useQuery_1.default)(query, this, tableName, onDbItemChanged);
    }
    //#endregion Hooks
    //#region private methods
    resetRefresher() {
        if (this.refresherSettings) {
            this.startRefresher(this.refresherSettings.ms);
        }
    }
    isLocked() {
        return this.transacting === true;
    }
    AddToTempStore(items, operation, subOperation, tableName, identifier) {
        try {
            let store = this.tempStore.find(x => x.tableName === tableName &&
                x.operation === operation &&
                x.subOperation === subOperation &&
                x.identifier === identifier);
            if (store === undefined) {
                store = {
                    operation: operation,
                    subOperation: subOperation,
                    tableName: tableName,
                    items: [...items],
                    identifier: identifier
                };
                this.tempStore.push(store);
            }
            else {
                items.forEach(x => {
                    if (!store.items.find(a => a.id === x.id))
                        store.items.push(x);
                });
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    async executeStore(identifier) {
        for (let item of this.tempStore
            .filter(x => x.identifier === identifier)
            .sort((a, b) => {
            if (a.operation !== "onBulkSave")
                return -1;
            if (b.operation !== "onBulkSave")
                return 1;
            return 0;
        })) {
            await this.triggerWatch(item.items, item.operation, item.subOperation, item.tableName, item.identifier);
        }
        this.tempStore = this.tempStore.filter(x => x.identifier !== identifier);
    }
    async triggerWatch(items, operation, subOperation, tableName, identifier) {
        try {
            const tItems = Array.isArray(items)
                ? items
                : [items];
            var s = UsefullMethods_1.Functions.single(tItems);
            if (s && !tableName && s && s.tableName)
                tableName = s.tableName;
            if (!tableName)
                return;
            const w = watchers.filter(x => {
                const watcher = x;
                return (watcher.tableName == tableName &&
                    (identifier === undefined ||
                        identifier === x.identifier));
            });
            for (let watcher of w) {
                try {
                    if (this._disableWatchers &&
                        watcher.identifier !== "Hook") {
                        // this.info("Watcher is Frozen", operation);
                        this.AddToTempStore(tItems, operation, subOperation, tableName, "Other");
                        continue;
                    }
                    if (this._disableHooks &&
                        watcher.identifier === "Hook") {
                        // this.info("Hook is Frozen", operation);
                        this.AddToTempStore(tItems, operation, subOperation, tableName, "Hook");
                        continue;
                    }
                    if (operation === "onSave" &&
                        watcher.onSave) {
                        // this.info("Call Watcher", operation);
                        await watcher.onSave(tItems, subOperation !== null && subOperation !== void 0 ? subOperation : "INSERT");
                    }
                    if (operation === "onDelete" &&
                        watcher.onDelete) {
                        //  this.info("Call Watcher", operation);
                        await watcher.onDelete(tItems);
                    }
                    if (operation === "onBulkSave" &&
                        watcher.onBulkSave) {
                        // this.info("Call Watcher", operation);
                        await watcher.onBulkSave();
                    }
                }
                catch (e) {
                    console.error("Watchers.Error:", operation, subOperation, tableName, e);
                }
            }
        }
        catch (e) {
            console.error("Watchers.Error:", e);
        }
    }
    localSave(item, insertOnly, tableName, saveAndForget) {
        UsefullMethods_1.Functions.validateTableName(item, tableName);
        const key = "localSave" + item.tableName;
        return new Promise(async (resolve, reject) => {
            var _a;
            try {
                if (!item) {
                    reject(undefined);
                    return;
                }
                this.operations.set(key, true);
                this.log("Executing Save...");
                const uiqueItem = await this.getUique(item);
                const keys = UsefullMethods_1.Functions.getAvailableKeys(await this.allowedKeys(item.tableName, true), item);
                const sOperations = uiqueItem
                    ? "UPDATE"
                    : "INSERT";
                let query = "";
                let args = [];
                if (uiqueItem) {
                    if (insertOnly) {
                        resolve(item);
                        return;
                    }
                    query = `UPDATE ${item.tableName} SET `;
                    keys.forEach((k, i) => {
                        query +=
                            ` ${k}=? ` +
                                (i < keys.length - 1 ? "," : "");
                    });
                    query += " WHERE id=?";
                }
                else {
                    query = `INSERT INTO ${item.tableName} (`;
                    keys.forEach((k, i) => {
                        query +=
                            k +
                                (i < keys.length - 1 ? "," : "");
                    });
                    query += ") values(";
                    keys.forEach((k, i) => {
                        query +=
                            "?" +
                                (i < keys.length - 1 ? "," : "");
                    });
                    query += ")";
                }
                keys.forEach((k, i) => {
                    let value = item[k];
                    if (typeof value === "object" &&
                        value !== null &&
                        !UsefullMethods_1.Functions.isDate(value))
                        value = JSON.stringify(value);
                    let v = value !== null && value !== void 0 ? value : null;
                    v = UsefullMethods_1.Functions.translateAndEncrypt(v, this, item.tableName, k);
                    args.push(v);
                });
                if (uiqueItem)
                    item.id = uiqueItem.id;
                if (uiqueItem != undefined)
                    args.push(uiqueItem.id);
                await this.execute(query, args);
                if (saveAndForget !== true ||
                    item.id === 0 ||
                    item.id === undefined) {
                    const lastItem = (_a = (await this.selectLastRecord(item))) !== null && _a !== void 0 ? _a : item;
                    item.id = lastItem.id;
                }
                this.operations.delete(key);
                await this.triggerWatch(item, "onSave", sOperations, tableName);
                resolve(item);
            }
            catch (error) {
                console.error(error, item);
                reject(error);
                this.operations.delete(key);
            }
        });
    }
    async localDelete(items, tableName) {
        const key = "localDelete" + tableName;
        this.operations.set(key, true);
        var q = `DELETE FROM ${tableName} WHERE id IN (${items
            .map(x => "?")
            .join(",")})`;
        await this.execute(q, items.map(x => x.id));
        this.operations.delete(key);
    }
    async getUique(item) {
        if (item.id != undefined && item.id > 0)
            return UsefullMethods_1.Functions.single(await this.where(item.tableName, { id: item.id }));
        this.log("Executing getUique...");
        const trimValue = (value) => {
            if (typeof value === "string")
                return value.trim();
            return value;
        };
        var filter = {};
        var addedisUnique = false;
        var table = this.tables.find(x => x.tableName === item.tableName);
        if (table)
            table.props
                .filter(x => x.isUnique === true)
                .forEach(x => {
                var anyItem = item;
                var columnName = x.columnName;
                if (anyItem[columnName] !== undefined &&
                    anyItem[columnName] !== null) {
                    filter[columnName] = trimValue(anyItem[columnName]);
                    addedisUnique = true;
                }
            });
        if (!addedisUnique)
            return undefined;
        return UsefullMethods_1.Functions.single(await this.where(item.tableName, filter));
    }
    async selectLastRecord(item) {
        this.log("Executing SelectLastRecord... ");
        if (!item.tableName) {
            this.log("TableName cannot be empty for:", item);
            return;
        }
        return UsefullMethods_1.Functions.single((await this.find(!item.id || item.id <= 0
            ? `SELECT * FROM ${item.tableName} ORDER BY id DESC LIMIT 1;`
            : `SELECT * FROM ${item.tableName} WHERE id=?;`, item.id && item.id > 0
            ? [item.id]
            : undefined, item.tableName)).map((x) => {
            x.tableName = item.tableName;
            return x;
        }));
    }
    wait(ms) {
        return new Promise((resolve, reject) => setTimeout(resolve, ms !== null && ms !== void 0 ? ms : 100));
    }
    //#endregion
    //#region public Methods for Select
    disableWatchers() {
        this._disableWatchers = true;
        return this;
    }
    async enableWatchers() {
        this._disableWatchers = false;
        await this.executeStore("Other");
    }
    disableHooks() {
        this._disableHooks = true;
        return this;
    }
    async enableHooks() {
        this._disableHooks = false;
        await this.executeStore("Hook");
    }
    async beginTransaction() {
        this.resetRefresher();
        if (this.transacting)
            return;
        this.info("creating transaction");
        await this.execute("begin transaction");
        this.transacting = true;
    }
    async commitTransaction() {
        this.resetRefresher();
        if (!this.transacting)
            return;
        this.info("commiting transaction");
        await this.execute("commit");
        this.transacting = false;
    }
    async rollbackTransaction() {
        this.resetRefresher();
        if (!this.transacting)
            return;
        this.info("rollback transaction");
        await this.execute("rollback");
        this.transacting = false;
    }
    startRefresher(ms) {
        if (this.timer)
            clearInterval(this.timer);
        this.refresherSettings = { ms };
        this.timer = setInterval(async () => {
            if (this.isClosing || this.isClosed)
                return;
            this.info("db refresh:", await this.tryToClose());
        }, ms);
    }
    async close() {
        const db = this.db;
        if (db && db.closeAsync != undefined) {
            await db.closeAsync();
            this.isOpen = false;
            this.isClosed = true;
            this.db = undefined;
            this.isClosing = false;
        }
    }
    async tryToClose() {
        let r = false;
        try {
            const db = this.db;
            if (!this.db || !this.isOpen)
                return false;
            if (db.closeAsync === undefined)
                throw "Cant close the database, name cant be undefined";
            if (this.isLocked() ||
                this.operations.size > 0)
                return false;
            this.isClosing = true;
            await db.closeAsync();
            r = true;
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
        finally {
            if (r) {
                this.isOpen = false;
                this.isClosed = true;
                this.db = undefined;
            }
            this.isClosing = false;
        }
    }
    watch(tableName) {
        var watcher = new Watcher(tableName);
        watchers.push(watcher);
        return watcher;
    }
    async asQueryable(item, tableName) {
        UsefullMethods_1.Functions.validateTableName(item, tableName);
        var db = this;
        return await (0, UsefullMethods_1.createQueryResultType)(item, db);
    }
    querySelector(tableName) {
        return new QuerySelector_1.default(tableName, this);
    }
    async save(items, insertOnly, tableName, saveAndForget) {
        var _a;
        const tItems = Array.isArray(items)
            ? items
            : [items];
        try {
            var returnItem = [];
            for (var item of tItems) {
                returnItem.push((_a = (await this.localSave(item, insertOnly, tableName, saveAndForget))) !== null && _a !== void 0 ? _a : item);
            }
            return returnItem;
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
    async delete(items, tableName) {
        try {
            var tItems = (Array.isArray(items) ? items : [items]).reduce((v, c) => {
                const x = UsefullMethods_1.Functions.validateTableName(c, tableName);
                if (v[x.tableName])
                    v[x.tableName].push(c);
                else
                    v[x.tableName] = [c];
                return v;
            }, {});
            for (let key of Object.keys(tItems)) {
                await this.localDelete(tItems[key], key);
                await this.triggerWatch(tItems[key], "onDelete", undefined, tableName);
            }
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }
    async jsonToSql(jsonQuery, tableName) {
        const query = UsefullMethods_1.Functions.jsonToSqlite(jsonQuery);
        return (await this.find(query.sql, query.args, tableName));
    }
    async where(tableName, query) {
        const q = UsefullMethods_1.Functions.translateSimpleSql(this, tableName, query);
        return (await this.find(q.sql, q.args, tableName));
    }
    async find(query, args, tableName) {
        const key = query + tableName;
        this.operations.set(key, true);
        return new Promise(async (resolve, reject) => {
            this.info("executing find:", query);
            (await this.dataBase()).exec([{ sql: query, args: args || [] }], true, (error, result) => {
                var _a, _b, _c;
                if (error) {
                    console.error("Could not execute query:", query, error);
                    reject(error);
                    this.operations.delete(key);
                    return;
                }
                const arr = Array.isArray(result)
                    ? result
                    : [result];
                if ((_a = UsefullMethods_1.Functions.single(arr)) === null || _a === void 0 ? void 0 : _a.error) {
                    console.error((_b = UsefullMethods_1.Functions.single(arr)) === null || _b === void 0 ? void 0 : _b.error);
                    reject((_c = UsefullMethods_1.Functions.single(arr)) === null || _c === void 0 ? void 0 : _c.error);
                    return;
                }
                const data = result;
                const table = this.tables.find(x => x.tableName == tableName);
                const booleanColumns = table === null || table === void 0 ? void 0 : table.props.filter(x => x.columnType == "Boolean");
                const dateColumns = table === null || table === void 0 ? void 0 : table.props.filter(x => x.columnType == "DateTime");
                const jsonColumns = table === null || table === void 0 ? void 0 : table.props.filter(x => x.columnType == "JSON");
                const translateKeys = (item) => {
                    if (!item || !table)
                        return item;
                    jsonColumns.forEach(column => {
                        var columnName = column.columnName;
                        if (item[columnName] != undefined &&
                            item[columnName] != null &&
                            item[columnName] != "")
                            item[columnName] = JSON.parse(item[columnName]);
                    });
                    booleanColumns.forEach(column => {
                        var columnName = column.columnName;
                        if (item[columnName] != undefined &&
                            item[columnName] != null) {
                            if (item[columnName] === 0 ||
                                item[columnName] === "0" ||
                                item[columnName] === false)
                                item[columnName] = false;
                            else
                                item[columnName] = true;
                        }
                    });
                    dateColumns.forEach(column => {
                        var columnName = column.columnName;
                        if (item[columnName] != undefined &&
                            item[columnName] != null &&
                            item[columnName].length > 0) {
                            try {
                                item[columnName] = new Date(item[columnName]);
                            }
                            catch (_a) {
                                /// ignore
                            }
                        }
                    });
                    return item;
                };
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    for (let r = 0; r < data[i].rows.length; r++) {
                        const item = data[i].rows[r];
                        if (tableName)
                            item.tableName = tableName;
                        let translatedItem = translateKeys(item);
                        UsefullMethods_1.Functions.oDecrypt(translatedItem, table);
                        if (table && table.typeProptoType)
                            translatedItem =
                                UsefullMethods_1.Functions.createSqlInstaceOfType(table.typeProptoType, translatedItem);
                        const rItem = table && table.itemCreate
                            ? table.itemCreate(translatedItem)
                            : translatedItem;
                        items.push(rItem);
                    }
                }
                this.operations.delete(key);
                resolve(items);
            });
        });
    }
    async bulkSave(tableName) {
        const item = new BulkSave_1.default(this, await this.allowedKeys(tableName, true), tableName);
        return item;
    }
    //#endregion
    //#region TableSetup
    async tableHasChanges(item) {
        const tbBuilder = item;
        var appSettingsKeys = await this.allowedKeys(tbBuilder.tableName);
        return (appSettingsKeys.filter(x => x != "id")
            .length !=
            tbBuilder.props.filter(x => x.columnName != "id").length ||
            tbBuilder.props.filter(x => x.columnName != "id" &&
                !appSettingsKeys.find(a => a == x.columnName)).length > 0);
    }
    async dropDatabase() {
        await this.close();
        await (await this.dataBase()).deleteAsync();
    }
    async migrateNewChanges() {
        const dbType = (columnType) => {
            if (columnType == "Boolean" ||
                columnType == "Number")
                return "INTEGER";
            if (columnType == "Decimal")
                return "REAL";
            return "TEXT";
        };
        let sqls = [];
        for (var table of this.tables) {
            this.log(`migrating-check ${table.tableName}`);
            let keys = await this.allowedKeys(table.tableName, false, true);
            let rColumns = keys.filter(x => !table.props.find(k => x == k.columnName.toString()));
            let aColumns = table.props.filter(x => !keys.find(k => k == x.columnName.toString()));
            rColumns.forEach(x => {
                sqls.push(`ALTER TABLE ${table.tableName} DROP COLUMN ${x}`);
            });
            aColumns.forEach(x => {
                sqls.push(`ALTER TABLE ${table.tableName} ADD COLUMN ${x.columnName.toString()} ${dbType(x.columnType)}`);
            });
        }
        this.log(`migrating`);
        try {
            if (sqls.length > 0) {
                await this.beginTransaction();
                await this.execute("PRAGMA foreign_keys=OFF");
            }
            for (let sql of sqls) {
                await this.execute(sql);
            }
            if (sqls.length > 0) {
                await this.execute("PRAGMA foreign_keys=ON");
                await this.commitTransaction();
            }
            else
                this.log("The database is upp to date, no migration needed");
        }
        catch (e) {
            await this.execute("PRAGMA foreign_keys=ON");
            await this.rollbackTransaction();
            console.error("migrating failed", e);
            throw e;
        }
    }
}
Database.dbIni = false;
//# sourceMappingURL=Database.js.map