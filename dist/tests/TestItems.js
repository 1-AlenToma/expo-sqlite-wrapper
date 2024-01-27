"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tables = void 0;
const TableStructor_1 = __importDefault(require("../TableStructor"));
exports.tables = [
    (0, TableStructor_1.default)("DetaliItems").column("id").number.autoIncrement.primary
        .column("title")
        .column("image").encrypt("testEncryptions")
        .column("description").nullable
        .column("novel").encrypt("testEncryptions")
        .column("parserName")
        .column("chapterIndex").number
        .column("isFavorit").boolean,
    (0, TableStructor_1.default)("Chapters").column("id").number.autoIncrement.primary
        .column("chapterUrl").encrypt("testEncryptions")
        .column("isViewed").boolean.nullable
        .column("currentProgress").number.nullable
        .column("audioProgress").number
        .column("finished").boolean.nullable
        .column("detaliItem_Id").number
        .column("unlocked").boolean.nullable
        .constrain("detaliItem_Id", "DetaliItems", "id")
];
//# sourceMappingURL=TestItems.js.map