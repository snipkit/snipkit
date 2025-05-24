<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Snipkit Protection with NestJS + GraphQL

This example shows how to use Snipkit to protect [NestJS](https://nestjs.com/)
GraphQL applications using the `@snipkit/nest` adapter.

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory and install the example's dependencies.

   ```bash
   cd examples/nestjs-graphql
   npm ci
   ```

3. Rename `.env.local.example` to `.env.local` and add your Snipkit key.

4. Start the server.

   ```bash
   npm run start:dev
   ```

5. Visit `http://localhost:3000/graphql` in a browser and submit a GraphQL
   query.

   ```graphql
   query {
      recipes {
         id
         title
         description
         ingredients
      }
   }
   ```

6. In the UI, change the headers to include `{ "user-agent": "curl" }` and
   submit another GraphQL query and the request should be blocked.
