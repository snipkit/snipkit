<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# `@snipkit/analyze`

<p>
  <a href="https://www.npmjs.com/package/@snipkit/analyze">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40snipkit%2Fanalyze?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
      <img alt="npm badge" src="https://img.shields.io/npm/v/%40snipkit%2Fanalyze?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
    </picture>
  </a>
</p>

[Snipkit][snipkit] helps developers protect their apps in just a few lines of
code. Implement rate limiting, bot protection, email verification, and defense
against common attacks.

This is the [Snipkit][snipkit] local analysis engine.

## Installation

```shell
npm install -S @snipkit/analyze
```

## Example

```ts
import { generateFingerprint, isValidEmail } from "@snipkit/analyze";

const fingerprint = generateFingerprint("127.0.0.1");
console.log("fingerprint: ", fingerprint);

const valid = isValidEmail("hello@example.com");
console.log("is email valid?", valid);
```

## Implementation

This package uses the Wasm bindings provided by `@snipkit/analyze-wasm` to
call various functions that are exported by our wasm bindings.

We chose to put this logic in a separate package because we need to change the
import structure for each runtime that we support in the wasm bindings. Moving
this to a separate package allows us not to have to duplicate code while providing
a combined higher-level api for calling our core functionality in Wasm.

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
