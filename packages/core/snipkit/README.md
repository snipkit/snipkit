<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# `snipkit`

<p>
  <a href="https://www.npmjs.com/package/snipkit">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/snipkit?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
      <img alt="npm badge" src="https://img.shields.io/npm/v/snipkit?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
    </picture>
  </a>
</p>

[Snipkit][snipkit] helps developers protect their apps in just a few lines of
code. Implement rate limiting, bot protection, email verification, and defense
against common attacks.

This is the [Snipkit][snipkit] TypeScript and JavaScript SDK core.

## Getting started

Visit [docs-snipkit.khulnasoft.com](https://docs-snipkit.khulnasoft.com) to get started.

Generally, you'll want to use the Snipkit SDK for your specific framework, such
as [`@snipkit/next`](../snipkit-next/README.md) for Next.js. However, this package
can be used to interact with Snipkit if your framework does not have an
integration.

## Installation

```shell
npm install -S snipkit
```

## Rate limit + bot detection example

The example below applies a token bucket rate limit rule to a route where we
identify the user based on their ID e.g. if they are logged in. The bucket is
configured with a maximum capacity of 10 tokens and refills by 5 tokens every 10
seconds. Each request consumes 5 tokens.

Bot detection is also enabled to block requests from known bots.

```ts
import http from "http";
import snipkit, { createRemoteClient, tokenBucket, detectBot } from "snipkit";
import { baseUrl } from "@snipkit/env";
import { createConnectTransport } from "@connectrpc/connect-node";

const aj = snipkit({
  // Get your site key from https://app-snipkit.khulnasoft.com
  // and set it as an environment variable rather than hard coding.
  // See: https://www.npmjs.com/package/dotenv
  key: process.env.SNIPKIT_KEY,
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
  client: createRemoteClient({
    transport: createConnectTransport({
      baseUrl: baseUrl(process.env),
      httpVersion: "2",
    }),
  }),
});

const server = http.createServer(async function (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  // Any sort of additional context that might want to be included for the
  // execution of `protect()`. This is mostly only useful for writing adapters.
  const ctx = {};

  // Construct an object with Snipkit request details
  const path = new URL(req.url || "", `http://${req.headers.host}`);
  const details = {
    ip: req.socket.remoteAddress,
    method: req.method,
    host: req.headers.host,
    path: path.pathname,
  };

  const decision = await aj.protect(ctx, details, { requested: 5 }); // Deduct 5 tokens from the bucket
  console.log(decision);

  if (decision.isDenied()) {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Forbidden" }));
  } else {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ data: "Hello World!" }));
  }
});

server.listen(8000);
```

## API

Reference documentation is available at [docs-snipkit.khulnasoft.com][ts-sdk-docs].

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[ts-sdk-docs]: https://docs-snipkit.khulnasoft.com/reference/ts-js
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
