<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Snipkit Rate Limit / Auth.js 5 Authentication Example

This example shows how to use an Snipkit rate limit with a user ID from [Auth.js
authentication with Next.js](https://authjs.dev/). It's a copy of [the Next.js
demo](https://github.com/nextauthjs/next-auth/tree/5ea8b7b0f4d285e48f141dd91e518c905c9fb34e/apps/examples/nextjs),
but with Snipkit added.

**Note:** Auth.js 5 is still in development and was renamed from NextAuth. The
stable version is NextAuth 4. See [the Snipkit
docs](https://docs-snipkit.khulnasoft.com/integrations/nextauth) and separate example app if
you're using that version.

## Protection

* The main Auth.js route handler at `app/auth/[...nextauth]/route.ts` has `POST`
  requests protected with a rate limit and bot protection. This helps protect
  the login and signup actions against brute force attacks and other abuse.
* The `/app/api/protected/route.ts` route handler applies a rate limit based on
  the authenticated user's ID.
* Middleware in `middleware.ts` runs on requests to `/middleware-example` and
  checks the user's session, applying a rate limit based on the user's ID if
  they are authenticated.

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory and install the example's dependencies.

   ```bash
   cd examples/nextjs-authjs-5
   npm ci
   ```

3. Rename `.env.local.example` to `.env.local` and fill in the required
   environment variables. You will need to [create a GitHub OAuth
   app](https://github.com/settings/applications) for testing. The callback URL
   setting for your OAuth app is usually `http://localhost:3000`.

4. Start the dev server.

   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000`.
6. Try the different routes linked on the page.
