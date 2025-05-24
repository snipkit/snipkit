<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# `@snipkit/rollup-config`

<p>
  <a href="https://www.npmjs.com/package/@snipkit/rollup-config">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40snipkit%2Frollup-config?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
      <img alt="npm badge" src="https://img.shields.io/npm/v/%40snipkit%2Frollup-config?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
    </picture>
  </a>
</p>

Custom rollup config for [Snipkit][snipkit] projects.

## Installation

```shell
npm install -D @snipkit/rollup-config
```

## Example

In your `rollup.config.js` file:

```ts
import { createConfig } from "@snipkit/rollup-config";

export default createConfig(import.meta.url);
```

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
