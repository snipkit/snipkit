<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# `@snipkit/node`

<p>
  <a href="https://www.npmjs.com/package/@snipkit/node">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40snipkit%2Fnode?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
      <img alt="npm badge" src="https://img.shields.io/npm/v/%40snipkit%2Fnode?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
    </picture>
  </a>
</p>

[Snipkit][snipkit] helps developers protect their apps in just a few lines of
code. Implement rate limiting, bot protection, email verification, and defense
against common attacks.

This is the [Snipkit][snipkit] SDK for [Node.js][node-js].

**Looking for our Next.js framework SDK?** Check out the
[`@snipkit/next`][alt-sdk] package.

## Getting started

Visit the [quick start guide][quick-start] to get started.

## Example app

Try an Snipkit protected app live at [https://example.snipkit.khulnasoft.com][example-url]
([source code][example-source]).

## Installation

```shell
npm install -S @snipkit/node
```

## Rate limit example

The example below applies a token bucket rate limit rule to a route where we
identify the user based on their ID e.g. if they are logged in. The bucket is
configured with a maximum capacity of 10 tokens and refills by 5 tokens every 10
seconds. Each request consumes 5 tokens.

Bot detection is also enabled to block requests from known bots.

```ts
import snipkit, { tokenBucket, detectBot } from "@snipkit/node";
import http from "node:http";

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

const server = http.createServer(async function (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  const userId = "user123"; // Replace with your authenticated user ID
  const decision = await aj.protect(req, { userId, requested: 5 }); // Deduct 5 tokens from the bucket
  console.log("Snipkit decision", decision);

  if (decision.isDenied()) {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Forbidden" }));
  } else {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello world" }));
  }
});

server.listen(8000);
```

## Shield example

[Snipkit Shield][shield-concepts-docs] protects your application against common
attacks, including the OWASP Top 10. You can run Shield on every request with
negligible performance impact.

```ts
import snipkit, { shield } from "@snipkit/node";
import http from "node:http";

const aj = snipkit({
  key: process.env.SNIPKIT_KEY!, // Get your site key from https://app-snipkit.khulnasoft.com
  rules: [
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
  ],
});

const server = http.createServer(async function (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Forbidden" }));
  } else {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello world" }));
  }
});

server.listen(8000);
```

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[node-js]: https://nodejs.org/
[alt-sdk]: https://www.npmjs.com/package/@snipkit/next
[example-url]: https://example.snipkit.khulnasoft.com
[quick-start]: https://docs-snipkit.khulnasoft.com/get-started/nodejs
[example-source]: https://github.com/snipkit/snipkit-example
[shield-concepts-docs]: https://docs-snipkit.khulnasoft.com/shield/concepts
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
