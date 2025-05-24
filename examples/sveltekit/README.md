<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Snipkit Protection with Svelte

This example shows how to use Snipkit to protect [SvelteKit](https://kit.svelte.dev/) apps.

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory and install the example's dependencies.

   ```bash
   cd examples/sveltekit
   npm ci
   ```

3. Rename `.env.example` to `.env` and add your Snipkit key.

4. Start the server.

   ```bash
   npm run dev
   ```

5. Visit `http://localhost:5173/` in a browser and follow the links to test the various examples.

6. Test shield by making this request:

   ```bash
   curl -v -H "x-snipkit-suspicious: true" http://localhost:5173
   ```

## How it works

The `snipkit` instance is created in the server-only module `/src/lib/server/snipkit.ts` and is configured to enable [Shield](https://docs-snipkit.khulnasoft.com/shield).

`/src/hooks.server.ts` imports the `snipkit` instance and runs the `protect()` method on all requests. The only exception is any requests who's pathanme is listed in `filteredRoutes`, in which case protection is left to that route's server code.

The rate-limited page has a server-side script file at `/src/routes/rate-limited/+page.server.ts`, which imports the `snipkit` instance, and then applies extra rate-limiting rules before calling the `protect()` method.

Finally, the rate-limited API end-point performs the same augmentation of the rules as the rate-limted web page, as can be seen in `/src/routes/api/rate-limited/+server.ts`.
