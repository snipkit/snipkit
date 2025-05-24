declare namespace NodeJS {
  export interface ProcessEnv {
    readonly SNIPKIT_KEY: string;
    readonly GITHUB_CLIENT_ID: string;
    readonly GITHUB_CLIENT_SECRET: string;
  }
}
