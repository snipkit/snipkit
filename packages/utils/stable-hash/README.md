<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# `@snipkit/stable-hash`

<p>
  <a href="https://www.npmjs.com/package/@snipkit/stable-hash">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40snipkit%2Fstable-hash?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
      <img alt="npm badge" src="https://img.shields.io/npm/v/%40snipkit%2Fstable-hash?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
    </picture>
  </a>
</p>

[Snipkit][snipkit] stable hashing utility.

## Installation

```shell
npm install -S @snipkit/stable-hash
```

## Example

```ts
import * as hasher from "@snipkit/stable-hash";

const id = hasher.hash(
  hasher.string("type", "EMAIL"),
  hasher.uint32("version", 0),
  hasher.string("mode", "LIVE"),
  hasher.stringSliceOrdered("allow", []),
  hasher.stringSliceOrdered("deny", []),
);
```

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
