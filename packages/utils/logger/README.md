<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# `@snipkit/logger`

<p>
  <a href="https://www.npmjs.com/package/@snipkit/logger">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40snipkit%2Flogger?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
      <img alt="npm badge" src="https://img.shields.io/npm/v/%40snipkit%2Flogger?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
    </picture>
  </a>
</p>

[Snipkit][snipkit] lightweight logger which mirrors the [Pino][pino-api]
structured logger interface.

## Installation

```shell
npm install -S @snipkit/logger
```

## Example

```ts
import logger from "@snipkit/logger";

logger.debug("only printed in debug mode");
logger.log("only printed in log mode");
logger.warn("printed in default mode");
// printf-style printing
logger.error("printed always: %s", new Error("oops"));
```

## Log levels

Log levels can be changed by setting the `SNIPKIT_LOG_LEVEL` environment variable
to one of: `"DEBUG"`, `"LOG"`, `"WARN"`, or `"ERROR"`.

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[pino-api]: https://github.com/pinojs/pino/blob/8db130eba0439e61c802448d31eb1998cebfbc98/docs/api.md#logger
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
