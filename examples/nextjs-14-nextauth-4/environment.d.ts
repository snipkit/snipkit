declare namespace NodeJS {
  export interface ProcessEnv {
    readonly SNIPKIT_KEY: string;
    readonly NEXTAUTH_SECRET: string;
    readonly GITHUB_ID: string;
    readonly GITHUB_SECRET: string;
  }
}