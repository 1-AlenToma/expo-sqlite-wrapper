"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createQueryResultType = async function (item, database, children) {
    var result = item;
    result.saveChanges = async () => { return createQueryResultType((await database.save(result, false, undefined, true))[0], database); };
    result.update = async (...keys) => {
        if (!keys || keys.length <= 0)
            return;
        const kItem = { tableName: result.tableName, id: result.id };
        keys.forEach(k => {
            kItem[k] = result[k];
        });
        await database.save(kItem, false, undefined, true);
        if (result.id == 0 || result.id === undefined)
            result.id = kItem.id;
    };
    result.delete = async () => await database.delete(result);
    if (children && children.length > 0) {
        for (var x of children) {
            if (x.childTableName.length > 0 && x.childProperty.length > 0 && x.parentProperty.length > 0 && x.parentTable.length > 0 && x.assignTo.length > 0) {
                if (item[x.parentProperty] === undefined) {
                    if (x.isArray)
                        item[x.assignTo] = [];
                    continue;
                }
                var filter = {};
                filter[x.childProperty] = item[x.parentProperty];
                var items = await database.where(x.childTableName, filter);
                if (x.isArray) {
                    var r = [];
                    for (var m of items)
                        r.push(await createQueryResultType(m, database));
                    item[x.assignTo] = r;
                }
                else {
                    if (items.length > 0) {
                        item[x.assignTo] = await createQueryResultType(items[0], database);
                    }
                }
            }
        }
    }
    return result;
};
exports.default = createQueryResultType;
//# sourceMappingURL=QueryResultType.js.map