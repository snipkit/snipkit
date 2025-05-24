<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# `@snipkit/decorate`

<p>
  <a href="https://www.npmjs.com/package/@snipkit/decorate">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40snipkit%2Fdecorate?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
      <img alt="npm badge" src="https://img.shields.io/npm/v/%40snipkit%2Fdecorate?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
    </picture>
  </a>
</p>

[Snipkit][snipkit] utilities for decorating responses with information.

## Installation

```shell
npm install -S @snipkit/decorate
```

## Example

```ts
import snipkit, { fixedWindow } from "@snipkit/next";
import { setRateLimitHeaders } from "@snipkit/decorate";
import { NextApiRequest, NextApiResponse } from "next";

const aj = snipkit({
  key: process.env.SNIPKIT_KEY!, // Get your site key from https://app-snipkit.khulnasoft.com
  rules: [
    // Create a fixed window rate limit. Other algorithms are supported.
    fixedWindow({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      window: "1m", // 1 min fixed window
      max: 1, // allow a single request
    }),
  ],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const decision = await aj.protect(req);

  setRateLimitHeaders(res, decision);

  if (decision.isDenied()) {
    return res.status(429).json({
      error: "Too Many Requests",
      reason: decision.reason,
    });
  }

  res.status(200).json({ name: "Hello world" });
}
```

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
