<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# `@snipkit/redact`

<p>
  <a href="https://www.npmjs.com/package/@snipkit/redact">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40snipkit%2Fredact?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
      <img alt="npm badge" src="https://img.shields.io/npm/v/%40snipkit%2Fredact?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
    </picture>
  </a>
</p>

[Snipkit][snipkit] helps developers protect their apps in just a few lines of
code. Implement rate limiting, bot protection, email verification, and defense
against common attacks.

This is the [Snipkit][snipkit] TypeScript and JavaScript sensitive information
redaction library.

## Installation

```shell
npm install -S @snipkit/redact
```

## Reference

The full reference documentation can be found in the [Snipkit docs][redact-ref].

## Example

```typescript
const text = "Hi, my name is John and my email adress is john@example.com";
const [redacted, unredact] = await redact(text, {
  redact: ["email", "phone-number"],
});
console.log(redacted);
// Hi, my name is John and my email address is <Redacted email #0>

const unredacted = unredact("Your email address is <Redacted email #0>");
console.log(unredacted); // Your email address is john@example.com
```

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[redact-ref]: https://docs-snipkit.khulnasoft.com/redact/reference
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
