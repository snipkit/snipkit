<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# `@snipkit/nest`

<p>
  <a href="https://www.npmjs.com/package/@snipkit/nest">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40snipkit%2Fnest?style=flat-square&label=%E2%9C%A6Aj&labelColor=000000&color=5C5866">
      <img alt="npm badge" src="https://img.shields.io/npm/v/%40snipkit%2Fnest?style=flat-square&label=%E2%9C%A6Aj&labelColor=ECE6F0&color=ECE6F0">
    </picture>
  </a>
</p>

[Snipkit][snipkit] helps developers protect their apps in just a few lines of
code. Implement rate limiting, bot protection, email verification, and defense
against common attacks.

This is the [Snipkit][snipkit] SDK for [NestJS][nest-js].

**Looking for our Next.js framework SDK?** Check out the
[`@snipkit/next`][alt-sdk] package.

## Getting started

Visit the [quick start guide][quick-start] to get started.

## Example app

Try an Snipkit protected app live at [https://example.snipkit.khulnasoft.com][example-url]
([source code][example-source]).

## Installation

```shell
npm install -S @snipkit/nest
```

## Shield example

[Snipkit Shield][shield-concepts-docs] protects your application against common
attacks, including the OWASP Top 10. You can run Shield on every request with
negligible performance impact.

```ts
import { Module } from "@nestjs/common";
import { NestFactory, APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { SnipkitModule, SnipkitGuard, shield } from "@snipkit/nest";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.local",
    }),
    SnipkitModule.forRoot({
      isGlobal: true,
      key: process.env.SNIPKIT_KEY!,
      rules: [shield({ mode: "LIVE" })],
    }),
  ],
  controllers: [],
  providers: [
    // You can enable SnipkitGuard globally on every route using the `APP_GUARD`
    // token; however, this is generally NOT recommended. If you need to inject
    // the SnipkitNest client, you want to make sure you aren't also running
    // SnipkitGuard on the handlers calling `protect()` to avoid making multiple
    // requests to Snipkit and you can't opt-out of this global Guard.
    {
      provide: APP_GUARD,
      useClass: SnipkitGuard,
    },
  ],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

## License

Licensed under the [Apache License, Version 2.0][apache-license].

[snipkit]: https://snipkit.khulnasoft.com
[nest-js]: https://nestjs.com/
[alt-sdk]: https://www.npmjs.com/package/@snipkit/next
[example-url]: https://example.snipkit.khulnasoft.com
[quick-start]: https://docs-snipkit.khulnasoft.com/get-started/nestjs
[example-source]: https://github.com/snipkit/snipkit-example
[shield-concepts-docs]: https://docs-snipkit.khulnasoft.com/shield/concepts
[apache-license]: http://www.apache.org/licenses/LICENSE-2.0
