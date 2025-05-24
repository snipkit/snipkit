<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Using the `ip` property on an SnipkitDecision with Next.js

This example shows how to use `decision.ip` in a Next.js [API
Route](https://nextjs.org/docs/pages/building-your-application/routing/api-routes).

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory and install the example's dependencies.

   ```bash
   cd examples/nextjs-ip-details
   npm ci
   ```

3. Rename `.env.local.example` to `.env.local` and add your Snipkit key.

4. Start the dev server.

   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000/api/snipkit`.
