<a href="https://snipkit.khulnasoft.com" target="_snipkit-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://snipkit.khulnasoft.com/logo/snipkit-dark-lockup-voyage-horizontal.svg">
    <img src="https://snipkit.khulnasoft.com/logo/snipkit-light-lockup-voyage-horizontal.svg" alt="Snipkit Logo" height="128" width="auto">
  </picture>
</a>

# Snipkit Bot Detection with Express for Node.js

This example shows how to use Snipkit to perform bot detection with a Node.js
[Express](https://expressjs.com/) server.

## How to use

1. From the root of the project, install the SDK dependencies.

   ```bash
   npm ci
   ```

2. Enter this directory and install the example's dependencies.

   ```bash
   cd examples/express-bots
   npm ci
   ```

3. Rename `.env.local.example` to `.env.local` and add your Snipkit key.

4. Start the server.

   ```bash
   npm start
   ```

   This assumes you're using Node.js 20 or later because the `start` script
   loads a local environment file with `--env-file`. If you're using an older
   version of Node.js, you can use a package like
   [dotenv](https://www.npmjs.com/package/dotenv) to load the environment file.

4. Visit `http://localhost:3000/` in your browser to see a welcome message.
5. Use curl to access `http://localhost:3000/` and the request will be denied.
   `curl http://localhost:3000/`
