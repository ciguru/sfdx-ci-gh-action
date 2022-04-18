export declare class NoRequiredInput extends Error {
    constructor(inputName: string);
}
export declare class IncorrectContent extends Error {
    name: string;
    constructor(inputName: string, contentType: string);
}
