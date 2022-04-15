interface Constants {
    input: {
        configurationFile: string;
        inputs: string;
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
