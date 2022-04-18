"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core = __importStar(require("@actions/core"));
const GitHub = __importStar(require("@actions/github"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const errors_1 = require("./errors");
function getInput(inputName, required) {
    try {
        return Core.getInput(inputName, { required });
    }
    catch (e) {
        throw new errors_1.NoRequiredInput(inputName);
    }
}
function getObjectInput(inputName, required) {
    let input;
    try {
        input = Core.getInput(inputName, { required });
    }
    catch (e) {
        throw new errors_1.NoRequiredInput(inputName);
    }
    try {
        return js_yaml_1.default.load(input);
    }
    catch (e) {
        throw new errors_1.IncorrectContent(inputName, 'YAML');
    }
}
function setConstants() {
    const pullRequest = GitHub.context.payload.pull_request;
    Core.info(`PR: ${JSON.stringify(pullRequest)}`);
    return {
        input: {
            configurationFile: getInput('configurationFile', true),
            inputs: getObjectInput('inputs', true),
        },
        dirname: process.env.GITHUB_WORKSPACE || __dirname,
        repo: {
            owner: GitHub.context.repo.owner,
            repo: GitHub.context.repo.repo,
            prNumber: pullRequest?.number || -1,
            headSha: pullRequest ? pullRequest.head.sha : GitHub.context.sha,
            baseSha: pullRequest?.base?.sha,
        },
    };
}
const constants = setConstants();
Core.debug(`Inputs: ${JSON.stringify(constants)}`);
exports.default = constants;
//# sourceMappingURL=constants.js.map