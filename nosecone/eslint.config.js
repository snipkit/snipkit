import base from "@snipkit/eslint-config";

export default [
  ...base,
  {
    ignores: [
      ".turbo/",
      "coverage/",
      "node_modules/",
      "**/*.d.ts",
      "**/*.js",
      "!*.config.js",
    ],
  },
];
