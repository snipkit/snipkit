declare namespace NodeJS {
    export interface ProcessEnv {
        readonly SNIPKIT_KEY: string;
        readonly OPENAI_API_KEY: string;
    }
}