// @ts-check
import { defineConfig } from "astro/config";

import node from "@astrojs/node";
import snipkit, { detectBot, shield } from "@snipkit/astro";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  env: {
    validateSecrets: true
  },
  integrations: [
    snipkit({
      rules: [shield({ mode: "LIVE" }), detectBot({ mode: "LIVE", allow: [] })],
    }),
  ],
});
