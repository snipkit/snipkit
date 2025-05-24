<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Snipkit response decoration with Next.js

This example shows how to use Snipkit response decoration with different Next.js
[route
handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory and install the example's dependencies.

   ```bash
   cd examples/nextjs-decorate
   npm ci
   ```

3. Rename `.env.local.example` to `.env.local` and add your Snipkit key.

4. Start the dev server.

   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000/api/snipkit` for pages response decoration.
6. Refresh the page to trigger the rate limit.
7. Visit `http://localhost:3000/api-app/snipkit` for app response decoration.
8. Refresh the page to trigger the different rate limit.
