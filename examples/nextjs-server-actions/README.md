<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Snipkit email verification with Next.js Server Actions

This example shows how to use Snipkit with Next.js [server
actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory and install the example's dependencies.

   ```bash
   cd examples/nextjs-server-actions
   npm ci
   ```

3. Rename `.env.local.example` to `.env.local` and add your Snipkit key.

4. Start the dev server.

   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000/`

6. Enter some email addresses in the form to validate them.
