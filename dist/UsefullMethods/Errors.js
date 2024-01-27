"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StringBuilder_1 = __importDefault(require("./StringBuilder"));
class Errors {
    missingTableBuilder(tableName) {
        const str = new StringBuilder_1.default().append("Missing TableBuilder for", tableName);
        console.error(str.toString());
        return str.toString();
    }
}
const errors = new Errors();
exports.default = errors;
//# sourceMappingURL=Errors.js.map