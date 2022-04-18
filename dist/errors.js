"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncorrectContent = exports.NoRequiredInput = void 0;
class NoRequiredInput extends Error {
    constructor(inputName) {
        super(`There is no required input: '${inputName}'`);
    }
}
exports.NoRequiredInput = NoRequiredInput;
class IncorrectContent extends Error {
    constructor(inputName, contentType) {
        super(`Input '${inputName}' must contain valid ${contentType} data.`);
        this.name = 'IncorrectContent';
    }
}
exports.IncorrectContent = IncorrectContent;
//# sourceMappingURL=errors.js.map