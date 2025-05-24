<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# `@snipkit/remix`

<p>
  <a href="https://www.npmjs.com/package/@snipkit/remix">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40snipkit%2Fremix?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
      <img alt="npm badge" src="https://img.shields.io/npm/v/%40snipkit%2Fremix?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
    </picture>
  </a>
</p>

[Snipkit][snipkit] helps developers protect their apps in just a few lines of
code. Implement rate limiting, bot protection, email verification, and defense
against common attacks.

This is the [Snipkit][snipkit] SDK for [Remix][remix].

## Example app

Try an Snipkit protected app live at [https://example.snipkit.khulnasoft.com][example-url]
([source code][example-source]).

## Installation

```shell
npm install @snipkit/remix
```

## Rate limit + bot detection example

The [Snipkit rate limit][rate-limit-concepts-docs] example below applies a token
bucket rate limit rule to a route where we identify the user based on their ID
e.g. if they are logged in. The bucket is configured with a maximum capacity of
10 tokens and refills by 5 tokens every 10 seconds. Each request consumes 5
tokens.

```tsx
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";

import snipkit, { tokenBucket, detectBot } from "@snipkit/remix";

const aj = snipkit({
  key: process.env.SNIPKIT_KEY!, // Get your site key from https://app-snipkit.khulnasoft.com
  characteristics: ["userId"], // track requests by a custom user ID
  rules: [
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      refillRate: 5, // refill 5 tokens per interval
      interval: 10, // refill every 10 seconds
      capacity: 10, // bucket maximum capacity of 10 tokens
    }),
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // configured with a list of bots to allow from
      // https://snipkit.khulnasoft.com/bot-list
      allow: [], // "allow none" will block all detected bots
    }),
  ],
});

export async function loader(args: LoaderFunctionArgs) {
  const decision = await aj.protect(args);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      throw new Response(null, {
        status: 429,
        statusText: "Too Many Requests",
      });
    } else {
      throw new Response(null, { status: 403, statusText: "Forbidden" });
    }
  }

  return json({ message: "Hello Snipkit" });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return <h1>{data.message}</h1>;
}
```

## Shield example

[Snipkit Shield][shield-concepts-docs] protects your application against common
attacks, including the OWASP Top 10. You can run Shield on every request with
negligible performance impact.

```tsx
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";

import snipkit, { shield } from "@snipkit/remix";

const aj = snipkit({
  key: process.env.SNIPKIT_KEY, // Get your site key from https://app-snipkit.khulnasoft.com
  rules: [
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
  ],
});

export async function loader(args: LoaderFunctionArgs) {
  const decision = await aj.protect(args);

  if (decision.isDenied()) {
    throw new Response(null, { status: 403, statusText: "Forbidden" });
  }

  return json({ message: "Hello Snipkit" });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return <h1>{data.message}</h1>;
}
```

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[remix]: https://remix.run/
[example-url]: https://example.snipkit.khulnasoft.com
[example-source]: https://github.com/snipkit/snipkit-example
[rate-limit-concepts-docs]: https://docs-snipkit.khulnasoft.com/rate-limiting/concepts
[shield-concepts-docs]: https://docs-snipkit.khulnasoft.com/shield/concepts
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
