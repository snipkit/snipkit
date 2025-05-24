<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Snipkit protections with Remix

This example shows how to leverage Snipkit protections in a
[Remix](https://remix.run/) application.

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory.

   ```bash
   cd examples/remix-express
   ```

3. Rename `.env.example` to `.env` and add your Snipkit key.

4. Start the server.

   ```bash
   npm start
   ```

5. Visit `http://localhost:3000/`.

6. Submit the form with some sensitive information and get denied.

7. Go back to `http://localhost:3000/` and refresh the page a view times to be
   rate limited.
