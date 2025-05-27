# Snipkit - JS SDK

<p>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/snipkit?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
    <img alt="npm badge" src="https://img.shields.io/npm/v/snipkit?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
  </picture>
</p>

[Snipkit][snipkit] helps developers protect their apps in just a few lines of
code. Bot detection. Rate limiting. Email validation. Attack protection. Data
redaction. A developer-first approach to security.

This is the monorepo containing various [Snipkit][snipkit] open source packages for JavaScript/TypeScript, organized into a modern monorepo structure for better maintainability and developer experience.

## 🏗️ Package Structure

The repository is organized into several categories of packages:

### Core Packages (`/packages/core`)
- `snipkit` - Main SDK package
- `protocol` - Protocol definitions and shared types
- `runtime` - Runtime utilities and shared code

### Framework Integrations (`/packages/frameworks`)
- `snipkit-astro` - Astro integration
- `snipkit-bun` - Bun integration
- `snipkit-deno` - Deno integration
- `snipkit-nest` - NestJS integration
- `snipkit-next` - Next.js integration
- `snipkit-node` - Node.js integration
- `snipkit-remix` - Remix integration
- `snipkit-sveltekit` - SvelteKit integration

### Utilities (`/packages/utils`)
- `body` - Request body parsing
- `decorate` - Utility decorators
- `duration` - Time duration handling
- `env` - Environment variable management
- `headers` - HTTP headers utilities
- `inspect` - Runtime inspection utilities
- `ip` - IP address utilities
- `logger` - Logging utilities
- `redact` - Sensitive data redaction
- `stable-hash` - Stable hashing utilities
- `transport` - Network transport layer

### WebAssembly (`/packages/wasm`)
- `analyze-wasm` - WASM analysis utilities
- `redact-wasm` - WASM-based redaction

## 🚀 Development Workflow

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/snipkit/snipkit.git
   cd snipkit-js
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build all packages**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

### Common Tasks

- **Build all packages**
  ```bash
  npm run build
  ```

- **Watch for changes and rebuild**
  ```bash
  npm run dev
  ```

- **Run tests**
  ```bash
  npm test
  ```

- **Lint code**
  ```bash
  npm run lint
  ```

- **Verify builds**
  ```bash
  npm run verify
  ```

- **Clean build artifacts**
  ```bash
  npm run clean
  ```

- **Full reset**
  ```bash
  npm run reset
  ```

## 🛠️ Features

Snipkit security features for protecting JS apps:

Snipkit security features for protecting JS apps:

- 🤖 [Bot protection][bot-protection-quick-start] - manage traffic by automated
  clients and bots.
- 🛑 [Rate limiting][rate-limiting-quick-start] - limit the number of requests a
  client can make.
- 🛡️ [Shield WAF][shield-quick-start] - protect your application against common
  attacks.
- 📧 [Email validation][email-validation-quick-start] - prevent users from
  signing up with fake email addresses.
- 📝 [Signup form protection][signup-protection-quick-start] - combines rate
  limiting, bot protection, and email validation to protect your signup forms.
- 🕵️‍♂️ [Sensitive information detection][sensitive-info-quick-start] - block
  personally identifiable information (PII).
- 🚅 [Nosecone][nosecone-quick-start] - set security headers such as
  `Content-Security-Policy` (CSP).

## Quick start

- [Bun][bun-quick-start]
- [Deno][deno-quick-start]
- [NestJS][nest-quick-start]
- [Next.js][next-quick-start]
- [Node.js][node-quick-start]
- [Remix][remix-quick-start]
- [SvelteKit][sveltekit-quick-start]

### Get help

[Join our Discord server][discord-invite] or [reach out for support][support].

## Example apps

- [NestJS][example-nestjs]
- [Next.js][example-nextjs] ([try live][example-url])
- [Remix][example-remix]
- ... [more examples][example-examples-folder]

## Blueprints

- [AI quota control][blueprint-ai-quota-control]
- [IP geolocation][blueprint-ip-geolocation]
- [Cookie banner][blueprint-cookie-banner]
- [Payment form protection][blueprint-payment-form-protection]
- [VPN & proxy detection][blueprint-vpn-proxy-detection]

## Usage

Read the docs at [docs-snipkit.khulnasoft.com][snipkit-docs].

### Next.js bot detection

This example will enable [Snipkit bot protection][bot-protection-concepts-docs]
across your entire Next.js application. Next.js middleware runs before every
request, allowing Snipkit to protect your entire application before your code
runs.

It will return a 403 Forbidden response for all requests from bots not in the
allow list.

```ts
// middleware.ts
import snipkit, { SnipkitRuleResult, detectBot } from "@snipkit/next";
import { isSpoofedBot } from "@snipkit/inspect";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  // matcher tells Next.js which routes to run the middleware on.
  // This runs the middleware on all routes except for static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
const aj = snipkit({
  key: process.env.SNIPKIT_KEY!, // Get your site key from https://app-snipkit.khulnasoft.com
  rules: [
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://snipkit.khulnasoft.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
  ],
});

export default async function middleware(request: NextRequest) {
  const decision = await aj.protect(request);

  // Bots not in the allow list will be blocked
  if (decision.isDenied()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Snipkit Pro plan verifies the authenticity of common bots using IP data.
  // Verification isn't always possible, so we recommend checking the results
  // separately.
  // https://docs-snipkit.khulnasoft.com/bot-protection/reference#bot-verification
  if (decision.results.some(isSpoofedBot)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}
```

### Node.js bot protection example

This simple Node.js server is protected with [Snipkit bot
protection][bot-protection-concepts-docs]. It will return a 403 Forbidden
response for all requests from bots not in the allow list.

```ts
// server.ts
import snipkit, { detectBot } from "@snipkit/node";
import http from "node:http";

const aj = snipkit({
  key: process.env.SNIPKIT_KEY!, // Get your site key from https://app-snipkit.khulnasoft.com
  rules: [
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // configured with a list of bots to allow from
      // https://snipkit.khulnasoft.com/bot-list
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://snipkit.khulnasoft.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
  ],
});

const server = http.createServer(async function (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) {
  const decision = await aj.protect(req);
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

## Packages

We provide the source code for various packages in this repository, so you can
find a specific one through the categories and descriptions below.

### SDKs

- [`@snipkit/bun`](./snipkit-bun/README.md): SDK for Bun.sh.
- [`@snipkit/deno`](./snipkit-deno/README.md): SDK for Deno.
- [`@snipkit/nest`](./snipkit-nest/README.md): SDK for NestJS.
- [`@snipkit/next`](./snipkit-next/README.md): SDK for Next.js.
- [`@snipkit/node`](./snipkit-node/README.md): SDK for Node.js.
- [`@snipkit/remix`](./snipkit-remix/README.md): SDK for Remix.
- [`@snipkit/sveltekit`](./snipkit-sveltekit/README.md): SDK for SvelteKit.

### Analysis

- [`@snipkit/analyze`](./analyze/README.md): Local analysis engine.
- [`@snipkit/headers`](./headers/README.md): Snipkit extension of the Headers
  class.
- [`@snipkit/ip`](./ip/README.md): Utilities for finding the originating IP of a
  request.
- [`@snipkit/redact`](./redact/README.md): Redact & unredact sensitive
  information from strings.

### Nosecone

See [the docs][nosecone-docs] for details.

- [`nosecone`](./nosecone/README.md): Protect your `Response` with secure
  headers.
- [`@nosecone/next`](./nosecone-next/README.md): Protect your Next.js
  application with secure headers.
- [`@nosecone/sveltekit`](./nosecone-sveltekit/README.md): Protect your
  SvelteKit application with secure headers.

### Utilities

- [`snipkit`](./snipkit/README.md): JS SDK core.
- [`@snipkit/body`](./body/README.md): utilities for extracting the body from a
  Node.js IncomingMessage.
- [`@snipkit/decorate`](./decorate/README.md): Utilities for decorating responses
  with information.
- [`@snipkit/duration`](./duration/README.md): Utilities for parsing duration
  strings into seconds integers.
- [`@snipkit/env`](./env/README.md): Environment detection for Snipkit variables.
- [`@snipkit/inspect`](./inspect/README.md): Utilities for inspecting decisions
  made by an SDK.
- [`@snipkit/logger`](./logger/README.md): Lightweight logger which mirrors the
  Pino structured logger interface.
- [`@snipkit/protocol`](./protocol/README.md): JS interface into the Snipkit
  protocol.
- [`@snipkit/runtime`](./runtime/README.md): Runtime detection.
- [`@snipkit/sprintf`](./sprintf/README.md): Platform-independent replacement for
  `util.format`.
- [`@snipkit/transport`](./transport/README.md): Transport mechanisms for the
  Snipkit protocol.

### Internal development

- [`@snipkit/eslint-config`](./eslint-config/README.md): Custom eslint config for
  our projects.
- [`@snipkit/redact-wasm`](./redact-wasm/README.md): Sensitive information
  redaction detection engine.
- [`@snipkit/rollup-config`](./rollup-config/README.md): Custom rollup config for
  our projects.
- [`@snipkit/tsconfig`](./tsconfig/README.md): Custom tsconfig for our projects.

## Support

This repository follows the [Snipkit Support Policy][snipkit-support].

## Security

This repository follows the [Snipkit Security Policy][snipkit-security].

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[bun-quick-start]: https://docs-snipkit.khulnasoft.com/get-started?f=bun
[deno-quick-start]: https://docs-snipkit.khulnasoft.com/get-started?f=deno
[nest-quick-start]: https://docs-snipkit.khulnasoft.com/get-started?f=nest-js
[next-quick-start]: https://docs-snipkit.khulnasoft.com/get-started?f=next-js
[node-quick-start]: https://docs-snipkit.khulnasoft.com/get-started?f=node-js
[remix-quick-start]: https://docs-snipkit.khulnasoft.com/get-started?f=remix
[sveltekit-quick-start]: https://docs-snipkit.khulnasoft.com/get-started?f=sveltekit
[discord-invite]: https://snipkit.khulnasoft.com/discord
[support]: https://docs-snipkit.khulnasoft.com/support
[example-url]: https://example.snipkit.khulnasoft.com
[bot-protection-concepts-docs]: https://docs-snipkit.khulnasoft.com/bot-protection/concepts
[snipkit-docs]: https://docs-snipkit.khulnasoft.com/
[snipkit-support]: https://docs-snipkit.khulnasoft.com/support
[snipkit-security]: https://docs-snipkit.khulnasoft.com/security
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
[nosecone-docs]: https://docs-snipkit.khulnasoft.com/nosecone/quick-start
[example-nestjs]: https://github.com/snipkit/example-nestjs
[example-nextjs]: https://github.com/snipkit/example-nextjs
[example-remix]: https://github.com/snipkit/example-remix
[example-examples-folder]: ./examples
[blueprint-ai-quota-control]: https://docs-snipkit.khulnasoft.com/blueprints/ai-quota-control
[blueprint-ip-geolocation]: https://docs-snipkit.khulnasoft.com/blueprints/ip-geolocation
[blueprint-cookie-banner]: https://docs-snipkit.khulnasoft.com/blueprints/cookie-banner
[blueprint-payment-form-protection]: https://docs-snipkit.khulnasoft.com/blueprints/payment-form
[blueprint-vpn-proxy-detection]: https://docs-snipkit.khulnasoft.com/blueprints/vpn-proxy-detection
[bot-protection-quick-start]: https://docs-snipkit.khulnasoft.com/bot-protection/quick-start
[rate-limiting-quick-start]: https://docs-snipkit.khulnasoft.com/rate-limiting/quick-start
[shield-quick-start]: https://docs-snipkit.khulnasoft.com/shield/quick-start
[email-validation-quick-start]: https://docs-snipkit.khulnasoft.com/email-validation/quick-start
[signup-protection-quick-start]: https://docs-snipkit.khulnasoft.com/signup-protection/quick-start
[sensitive-info-quick-start]: https://docs-snipkit.khulnasoft.com/sensitive-info/quick-start
[nosecone-quick-start]: https://docs-snipkit.khulnasoft.com/nosecone/quick-start
