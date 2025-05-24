<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# `@snipkit/astro`

<p>
  <a href="https://www.npmjs.com/package/@snipkit/astro">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40snipkit%2Fastro?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
      <img alt="npm badge" src="https://img.shields.io/npm/v/%40snipkit%2Fastro?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
    </picture>
  </a>
</p>

[Snipkit][snipkit] helps developers protect their apps in just a few lines of
code. Implement rate limiting, bot protection, email verification, and defense
against common attacks.

This is the [Snipkit][snipkit] SDK integration for [Astro][astro].

## Getting started

Visit the [quick start guide][quick-start] to get started.

## Example app

Try an Snipkit protected app live at [https://example.snipkit.khulnasoft.com][example-url]
([source code][example-source]).

## Installation

```shell
npx astro add @snipkit/astro
```

## Usage

If installed via the Astro CLI command above, your `astro.config.mjs` should be
changed like:

```diff
  // @ts-check
  import { defineConfig } from "astro/config";
+ import snipkit from "@snipkit/astro";

  // https://astro.build/config
  export default defineConfig({
+   integrations: [
+     snipkit(),
+   ],
  });
```

However, if installed manually, you'll want to add the above lines to your Astro
configuration.

We also recommended validating your environment variables at build time. To do
this, update your `astro.config.mjs` to add the option:

```diff
  // @ts-check
  import { defineConfig } from "astro/config";
  import snipkit from "@snipkit/astro";

  // https://astro.build/config
  export default defineConfig({
+   env: {
+     validateSecrets: true
+   },
    integrations: [
      snipkit(),
    ],
  });
```

Once Snipkit is added as an integration, you'll want to start the Astro dev
server to build the `snipkit:client` virtual module and types. In your terminal,
run:

```sh
npx astro dev
```

You can now import from the `snipkit:client` module within your Astro project!

This example adds Snipkit to your middleware, but note this only works for
non-prerendered pages:

```ts
// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import aj from "snipkit:client";

export const onRequest = defineMiddleware(
  async ({ isPrerendered, request }, next) => {
    // Snipkit can be run in your middleware; however, Snipkit can only process a
    // request when the page is NOT prerendered.
    if (!isPrerendered) {
      // console.log(request);
      const decision = await aj.protect(request);

      // Deny decisions respond immediately to avoid any additional server
      // processing.
      if (decision.isDenied()) {
        return new Response(null, { status: 403, statusText: "Forbidden" });
      }
    }

    return next();
  },
);
```

## Rate limit + bot detection example

The [Snipkit rate limit][rate-limit-concepts-docs] example below applies a token
bucket rate limit rule to a route where we identify the user based on their ID
e.g. if they are logged in. The bucket is configured with a maximum capacity of
10 tokens and refills by 5 tokens every 10 seconds. Each request consumes 5
tokens.

The rule is defined in your `astro.config.mjs` file:

```js
// @ts-check
import { defineConfig } from "astro/config";
import snipkit, { tokenBucket, detectBot } from "@snipkit/astro";

// https://astro.build/config
export default defineConfig({
  env: {
    validateSecrets: true,
  },
  integrations: [
    snipkit({
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
    }),
  ],
});
```

Then Snipkit is called from within this page route:

```ts
// src/pages/api.json.ts
import type { APIRoute } from "astro";
import aj from "snipkit:client";

export const GET: APIRoute = async ({ request }) => {
  const userId = "user123"; // Replace with your authenticated user ID
  const decision = await aj.protect(request, { userId, requested: 5 }); // Deduct 5 tokens from the bucket
  console.log("Snipkit decision", decision);

  if (decision.isDenied()) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  } else {
    return Response.json({ message: "Hello world" });
  }
};
```

## Shield example

[Snipkit Shield][shield-concepts-docs] protects your application against common
attacks, including the OWASP Top 10. You can run Shield on every request with
negligible performance impact.

The rule is defined in your `astro.config.mjs` file:

```js
// @ts-check
import { defineConfig } from "astro/config";
import snipkit, { shield } from "@snipkit/astro";

// https://astro.build/config
export default defineConfig({
  env: {
    validateSecrets: true,
  },
  integrations: [
    snipkit({
      rules: [
        shield({
          mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
        }),
      ],
    }),
  ],
});
```

Then Snipkit is called from within this page route:

```ts
// src/pages/api.json.ts
import type { APIRoute } from "astro";
import aj from "snipkit:client";

export const GET: APIRoute = async ({ request }) => {
  const decision = await aj.protect(request);

  if (decision.isDenied()) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  } else {
    return Response.json({ message: "Hello world" });
  }
};
```

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[astro]: https://astro.build/
[example-url]: https://example.snipkit.khulnasoft.com
[quick-start]: https://docs-snipkit.khulnasoft.com/get-started/astro
[example-source]: https://github.com/snipkit/snipkit-example
[rate-limit-concepts-docs]: https://docs-snipkit.khulnasoft.com/rate-limiting/concepts
[shield-concepts-docs]: https://docs-snipkit.khulnasoft.com/shield/concepts
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
