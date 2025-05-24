<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Snipkit Bot Detection leveraging categories with Next.js

This example shows how to use Snipkit to allow detected bots based on categories,
individual selection, and filtering bots out of defined categories.

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory and install the example's dependencies.

   ```bash
   cd examples/nextjs-bot-categories
   npm ci
   ```

3. Rename `.env.local.example` to `.env.local` and add your Snipkit key.

4. Start the dev server.

   ```bash
   npm run dev
   ```

5. Use curl to access the API and display headers:
   ```sh
   curl -v localhost:3000/api/snipkit
   ```
   These headers in our terminal output inform us that `CURL` was detected and
   allowed because of `CATEGORY:TOOL`.
   ```txt
   x-snipkit-bot-allowed: CATEGORY:TOOL, CURL
   x-snipkit-bot-denied:
   ```
6. Now, change the User-Agent we are sending:
   ```sh
   curl -v -A "vercel-screenshot" localhost:3000/api/snipkit
   ```
   These headers inform us that `VERCEL_MONITOR_PREVIEW` was detected and
   allowed, but it did not belong to our selected categories.
   ```txt
   x-snipkit-bot-allowed: VERCEL_MONITOR_PREVIEW
   x-snipkit-bot-denied:
   ```
7. Finally, pretend to be Google's AdsBot:
   ```sh
   curl -v -A "AdsBot-Google" localhost:3000/api/snipkit
   ```
   These headers inform us that `GOOGLE_ADSBOT` was detected and blocked. It
   does not list the `CATEGORY:GOOGLE` because we programatically filtered the
   list, which translates our category into all individual items.
   ```txt
   x-snipkit-bot-allowed:
   x-snipkit-bot-denied: GOOGLE_ADSBOT
   ```
