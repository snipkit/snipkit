<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Permissions-Based Security in Next.js Apps with Snipkit and Permit.io

This example shows how to use [Snipkit](https://snipkit.khulnasoft.com/) with a permissions system such as [Permit.io](https://www.permit.io/) to protect [Next.js](https://nextjs.org/) apps.

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory and install the example's dependencies.

   ```bash
   cd examples/nextjs-permit
   npm ci
   ```

3. Rename `.env.example` to `.env` and add your Snipkit key, Clerk keys, and Permit.io token.

4. Set up Clerk and Permit.io per [the accompanying blog post](https://blog.snipkit.khulnasoft.com/permissions-based-security-in-nextjs-with-snipkit-and-permitio/).

4. Start the server.

   ```bash
   npm start
   ```

5. Visit `http://localhost:3000/` in a browser.

6. Visit `http://localhost:3000/stats` in a browser and refresh the page to trigger the rate limit.

7. Try logging in, changing your user's role in Permit.io, and see how that affects the rate limit.
