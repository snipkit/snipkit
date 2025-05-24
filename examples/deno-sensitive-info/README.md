<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Snipkit Sensitive Info Detection with Deno

This example shows how to use Snipkit to perform Sensitive Information detection
with a [Deno](https://deno.com/) server.

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory.

   ```bash
   cd examples/deno-sensitive-info
   ```

3. Rename `.env.example` to `.env` and add your Snipkit key.

4. Start the server.

   ```bash
   deno task start
   ```

5. POST a request to `http://localhost:3000/` without any sensitive data.

   ```bash
   curl http://localhost:3000/ -H "Content-Type: text/plain" -X POST --data "hello world!"
   ```

6. POST a request to `http://localhost:3000/` with some blocked entities in the
   body and the request should fail.

   ```bash
   curl http://localhost:3000/ -H "Content-Type: text/plain" -X POST --data "my email address is test@example.com"
   ```
