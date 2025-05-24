<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# `@snipkit/env`

<p>
  <a href="https://www.npmjs.com/package/@snipkit/env">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40snipkit%2Fenv?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
      <img alt="npm badge" src="https://img.shields.io/npm/v/%40snipkit%2Fenv?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
    </picture>
  </a>
</p>

[Snipkit][snipkit] environment detection.

Currently operates on an environment object with the type:

```ts
type Env = {
  FLY_APP_NAME?: string;
  NODE_ENV?: string;
  SNIPKIT_KEY?: string;
  SNIPKIT_ENV?: string;
  SNIPKIT_LOG_LEVEL?: string;
  SNIPKIT_BASE_URL?: string;
};
```

## Installation

```shell
npm install -S @snipkit/env
```

## Example

```ts
import * as env from "@snipkit/env";

env.platform({ FLY_APP_NAME: "foobar" }) === "fly-io";
env.platform({}) === undefined;

env.isDevelopment({ NODE_ENV: "production" }) === false;
env.isDevelopment({ NODE_ENV: "development" }) === true;
env.isDevelopment({ SNIPKIT_ENV: "production" }) === false;
env.isDevelopment({ SNIPKIT_ENV: "development" }) === true;

env.logLevel({ SNIPKIT_LOG_LEVEL: "debug" }) === "debug";
env.logLevel({ SNIPKIT_LOG_LEVEL: "info" }) === "info";
env.logLevel({ SNIPKIT_LOG_LEVEL: "warn" }) === "warn";
env.logLevel({ SNIPKIT_LOG_LEVEL: "error" }) === "error";
env.logLevel({ SNIPKIT_LOG_LEVEL: "" }) === "warn"; // default

// Will use various environment variables to detect the proper base URL
env.baseUrl(process.env);

env.apiKey({ SNIPKIT_KEY: "ajkey_abc123" }) === "ajkey_abc123";
env.apiKey({ SNIPKIT_KEY: "invalid" }) === undefined;
```

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
