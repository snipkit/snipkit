<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Snipkit Rate Limit / NextAuth 4 Authentication Example

This example shows how to use an Snipkit rate limit with a user ID from [NextAuth
4 authentication and Next.js](https://next-auth.js.org/getting-started/example).

It sets up the `/api/snipkit` route.

* Unauthenticated users receive a low rate limit based on the user IP address.
* Users authenticated with NextAuth have a higher rate limit based on the user
  email.
* A bot detection rule is also added to check all requests.

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory and install the example's dependencies.

   ```bash
   cd examples/nextjs-14-nextauth-4
   npm ci
   ```

3. Rename `.env.local.example` to `.env.local` and fill in the required
   environment variables. You will need to [create a GitHub OAuth
   app](https://github.com/settings/applications) for testing.

4. Start the dev server.

   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000`.
6. Try the different routes linked on the page.
