<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Snipkit bot detection with Next.js + Better Auth

This example shows how to use Snipkit with [Better
Auth](https://www.better-auth.com). Snipkit is implemented as a wrapper around
the `POST` handler in `app/api/auth/[...all]/route.ts`.

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory and install the example's dependencies.

   ```bash
   cd examples/nextjs-better-auth
   npm ci
   ```

3. Rename `.env.local.example` to `.env.local` and add your Snipkit key and a
   secret for Better Auth. You will need to [create a GitHub OAuth
   app](https://github.com/settings/applications) for testing (see the [Better
   Auth docs](https://www.better-auth.com/docs/authentication/github)).

4. Run the database migration. A SQLite database is used for this example.

   ```bash
   npx @better-auth/cli migrate
   ```

5. Start the dev server.

   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3000`.
