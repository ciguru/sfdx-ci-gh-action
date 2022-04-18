interface Inputs {
    [k: string]: string | number | boolean | null;
}
interface Constants {
    input: {
        configurationFile: string;
        inputs: Inputs;
    };
    dirname: string;
    repo: {
        owner: string;
        repo: string;
        prNumber: number;
        headSha: string;
        baseSha?: string;
    };
}
declare const constants: Constants;
export default constants;
