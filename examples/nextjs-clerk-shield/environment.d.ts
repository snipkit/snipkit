declare namespace NodeJS {
  export interface ProcessEnv {
    readonly SNIPKIT_KEY: string;
    readonly NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
    readonly CLERK_SECRET_KEY: string;
  }
}