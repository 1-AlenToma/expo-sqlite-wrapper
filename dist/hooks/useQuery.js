"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UsefullMethods_1 = require("../UsefullMethods");
const react_1 = require("react");
const UseQuery = (query, dbContext, tableName, onItemChange) => {
    const [_, setUpdater] = (0, react_1.useState)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const dataRef = (0, react_1.useRef)([]);
    const refTimer = (0, react_1.useRef)();
    const refWatcher = (0, react_1.useRef)(dbContext.watch(tableName));
    const refMounted = (0, react_1.useRef)(false);
    const refreshData = async () => {
        if (!refMounted.current)
            return;
        clearTimeout(refTimer.current);
        refTimer.current = setTimeout(async () => {
            try {
                if (!refMounted.current)
                    return;
                setIsLoading(true);
                const sQuery = query;
                const iQuery = query;
                const fn = query;
                if (iQuery.Column !== undefined) {
                    dataRef.current = await iQuery.toList();
                }
                else if (!UsefullMethods_1.Functions.isFunc(query)) {
                    const r = [];
                    for (const x of (await dbContext.find(sQuery.sql, sQuery.args, tableName))) {
                        r.push(await (0, UsefullMethods_1.createQueryResultType)(x, dbContext));
                    }
                    dataRef.current = r;
                }
                else {
                    const r = [];
                    for (const x of (await fn())) {
                        r.push(await (0, UsefullMethods_1.createQueryResultType)(x, dbContext));
                    }
                    dataRef.current = r;
                }
                update();
            }
            catch (e) {
                console.error(e);
            }
            finally {
                setIsLoading(false);
            }
        }, 0);
    };
    const update = () => {
        if (!refMounted.current)
            return;
        setUpdater(x => ((x !== null && x !== void 0 ? x : 0) > 100 ? 0 : (x !== null && x !== void 0 ? x : 0)) + 1);
    };
    const onSave = async (items) => {
        try {
            if (!refMounted.current)
                return;
            if (onItemChange == undefined)
                await refreshData();
            else {
                setIsLoading(true);
                items = [...items, ...(dataRef.current.filter(x => !items.find(a => a.id == x.id)))];
                const itemsAdded = onItemChange(items);
                const r = [];
                for (const x of itemsAdded) {
                    r.push(await (0, UsefullMethods_1.createQueryResultType)(x, dbContext));
                }
                dataRef.current = r;
                update();
                setIsLoading(false);
            }
        }
        catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    };
    const onDelete = async (items) => {
        try {
            if (!refMounted.current)
                return;
            let updateList = false;
            const r = [...dataRef.current];
            items.forEach(a => {
                if (r.find(x => a.id == x.id)) {
                    r.splice(r.findIndex(x => a.id == x.id), 1);
                    updateList = true;
                }
            });
            if (updateList) {
                dataRef.current = r;
                update();
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    const onBulkSave = async () => {
        if (!refMounted.current)
            return;
        await refreshData();
    };
    refWatcher.current.identifier = "Hook";
    refWatcher.current.onSave = async (items, operation) => await onSave(items);
    refWatcher.current.onBulkSave = async () => await onBulkSave();
    refWatcher.current.onDelete = async (items) => await onDelete(items);
    (0, react_1.useEffect)(() => {
        refMounted.current = true;
        refreshData();
        return () => {
            clearTimeout(refTimer.current);
            refWatcher.current.removeWatch();
            refMounted.current = false;
        };
    }, []);
    return [dataRef.current, isLoading, refreshData, dbContext];
};
exports.default = UseQuery;
//# sourceMappingURL=useQuery.js.map