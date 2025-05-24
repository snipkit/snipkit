declare module "astro:env/server" {
  const SNIPKIT_BASE_URL: string | undefined;
  const SNIPKIT_ENV: string | undefined;
  const SNIPKIT_KEY: string | undefined;
  const SNIPKIT_LOG_LEVEL: string | undefined;
  const FLY_APP_NAME: string | undefined;
  const VERCEL: string | undefined;
}

interface ImportMetaEnv {
  readonly MODE: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
