<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Snipkit Block Sensitive Info with Next.js using the App Router

This example shows how to use Snipkit with a Next.js [route
handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory and install the example's dependencies.

   ```bash
   cd examples/nextjs-sensitive-info
   npm ci
   ```

3. Rename `.env.local.example` to `.env.local` and add your Snipkit key.

4. Start the dev server.

   ```bash
   npm run dev
   ```

5. Curl `http://localhost:3000/api/snipkit` with some data
   `curl http://localhost:3000/api/snipkit -H "Content-Type: text/plain" -X POST --data "my email is test@example.com"`
   `curl http://localhost:3000/api/snipkit -H "Content-Type: text/plain" -X POST --data "here's a string that contains-a-dash"`
6. If the data you sent contains any blocked types then the route will return a 400.
