"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringBuilder {
    constructor(text) {
        this.text = text !== null && text !== void 0 ? text : "";
    }
    get isEmpty() {
        if (this.text.trim().length <= 0)
            return true;
        return false;
    }
    append(...texts) {
        texts.forEach(x => {
            if (x.length > 0 && !this.text.endsWith(" "))
                this.text += " ";
            this.text += x;
        });
        return this;
    }
    prepend(...texts) {
        texts.forEach(x => {
            if (x.length > 0 && !this.text.startsWith(" "))
                this.text = " " + this.text;
            this.text = x + this.text;
        });
        return this;
    }
    trimEnd(...q) {
        this.text = this.text.trim();
        q.forEach(x => {
            if (this.text.endsWith(x))
                this.text = this.text.substring(0, this.text.length - 1);
        });
        return this;
    }
    indexOf(search) {
        return this.text.indexOf(search);
    }
    replaceIndexOf(text, replacement) {
        const index = this.text.indexOf(text);
        this.text = this.text.substring(0, index) + replacement + this.text.substring(index + text.length);
        return this;
    }
    toString() {
        return this.text;
    }
}
exports.default = StringBuilder;
//# sourceMappingURL=StringBuilder.js.map