<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# `@snipkit/eslint-config`

<p>
  <a href="https://www.npmjs.com/package/@snipkit/eslint-config">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40snipkit%2Feslint-config?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
      <img alt="npm badge" src="https://img.shields.io/npm/v/%40snipkit%2Feslint-config?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
    </picture>
  </a>
</p>

Custom eslint config for [Snipkit][snipkit] projects.

## Installation

```shell
npm install -D @snipkit/eslint-config
```

## Example

In your `.eslintrc.cjs` file:

```ts
module.exports = {
  root: true,
  extends: ["@snipkit/eslint-config"],
};
```

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
